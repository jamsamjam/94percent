using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NinetyFourApi.Models;

namespace NinetyFourApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class QuestionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public QuestionsController(AppDbContext context)
    {
        _context = context;
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
        if (question == null)
            return NotFound();

        var answers = await _context.Answers
            .Where(a => a.QuestionId == id)
            .ToListAsync();

        if (!answers.Any())
            return NotFound();

        var input = Normalize(request.Input);

        var match = answers.FirstOrDefault(a =>
            Normalize(a.AnswerText) == input
        );

        if (match != null)
        {
            return Ok(new {
                correct = true,
                percentage = match.Percentage
            });
        }

        return Ok(new {
            correct = false
        });
    }

    private string Normalize(string s)
    {
        return s.Trim().ToLower();
    }
}