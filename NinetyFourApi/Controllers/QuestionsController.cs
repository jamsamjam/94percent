using Google.GenAI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NinetyFourApi.Models;

namespace NinetyFourApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class QuestionsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<QuestionsController> _logger;

    public QuestionsController(AppDbContext context, IServiceProvider serviceProvider, ILogger<QuestionsController> logger)
    {
        _context = context;
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    // GET api/questions/random
    [HttpGet("random")]
    public async Task<ActionResult<Question>> GetRandomQuestion([FromQuery] List<int> exclude)
    {
        var question = await _context.Questions
            .OrderBy(q => EF.Functions.Random())
            .FirstOrDefaultAsync();

        if (question == null)
            return NotFound();

        return Ok(question);
    }

    // POST api/questions/{id}/guess
    [HttpPost("{id}/guess")]
    public async Task<IActionResult> CheckAnswer(int id, [FromBody] GuessRequest request)
    {
        var question = await _context.Questions.FindAsync(id);
        if (question == null) return NotFound();

        var answers = await _context.Answers
            .Where(a => a.QuestionId == id)
            .ToListAsync();

        if (!answers.Any()) return NotFound();

        var userAnswer = request.Input.Trim();

        var exact = answers.FirstOrDefault(a =>
            a.AnswerText.Trim().ToLower() == userAnswer.Trim().ToLower()
        );

        if (exact != null)
        {
            return Ok(new {
                correct = true,
                percentage = exact.Percentage,
                answer = exact.AnswerText
            });
        }

        var client = _serviceProvider.GetService<Client>();
        
        if (client == null)
        {
            return StatusCode(503, new { error = "Gemini API is not configured" });
        }

        _logger.LogInformation("Calling Gemini API for question {question.id}, {userAnswer}", 
            question.Id, userAnswer);

        var matchedAnswer = await CheckBatchSimilarity(
            client,
            question.Text,
            answers,
            userAnswer
        );

        if (matchedAnswer != null)
        {
            return Ok(new {
                correct = true,
                percentage = matchedAnswer.Percentage,
                answer = matchedAnswer.AnswerText
            });
        }

        return Ok(new {
            correct = false
        });
    }

    private async Task<Answer?> CheckBatchSimilarity(
        Client client,
        string questionText,
        List<Answer> answerCandidates,
        string userAnswer)    
    {
        var candidatesList = string.Join("\n", 
            answerCandidates.Select((a, i) => $"{i + 1}. {a.AnswerText}")
        );

        var prompt = $"""
You are checking if the user's answer should be accepted as correct for a 94% quiz question.

Question:
"{questionText}"

User answer:
"{userAnswer}"

Answer candidates:
{candidatesList}

Decide which answer candidate (if any) means the same thing as the user's answer *in the context of the question*.
Respond with ONLY the number (1-{answerCandidates.Count}) of the matching answer, or "0" if none match.
Do not include anything else - just the number.
""";

        var response = await client.Models.GenerateContentAsync(
            model: "gemini-2.0-flash",
            contents: prompt
        );

        var resultText = response.Candidates[0].Content.Parts[0].Text.Trim();
        
        if (int.TryParse(resultText, out int matchIndex) && matchIndex > 0 && matchIndex <= answerCandidates.Count)
        {
            return answerCandidates[matchIndex - 1];
        }

        return null;
    }
}