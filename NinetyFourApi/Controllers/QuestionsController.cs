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

    public QuestionsController(AppDbContext context, IServiceProvider serviceProvider)
    {
        _context = context;
        _serviceProvider = serviceProvider;
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
            a.AnswerText.Trim().ToLower() == userAnswer.ToLower()
        );

        if (exact != null)
        {
            return Ok(new {
                correct = true,
                percentage = exact.Percentage
            });
        }

        var client = _serviceProvider.GetService<Client>();
        
        if (client == null)
        {
            return StatusCode(503, new { error = "Gemini API is not configured" });
        }

        foreach (var answer in answers)
        {
            bool isSimilar = await CheckSimilarity(
                client,
                question.Text,
                answer.AnswerText,
                userAnswer
            );

            if (isSimilar)
            {
                return Ok(new {
                    correct = true,
                    percentage = answer.Percentage
                });
            }
        }

        return Ok(new {
            correct = false
        });
    }

    private async Task<bool> CheckSimilarity(
        Client client,
        string questionText,
        string correctAnswer,
        string userAnswer)    
    {
        var prompt = $"""
You are checking if the user's answer should be accepted as correct for a 94% quiz question.

Question:
"{questionText}"

Correct answer candidate:
"{correctAnswer}"

User answer:
"{userAnswer}"

Decide if the user's answer means the same thing as the correct answer *in the context of the question*.
Respond with exactly one word: "true" or "false".
Do not include anything else.
""";

        var response = await client.Models.GenerateContentAsync(
            model: "gemini-2.5-flash",
            contents: prompt
        );

        var resultText = response.Candidates[0].Content.Parts[0].Text.Trim().ToLower();

        return resultText == "true";
    }
}