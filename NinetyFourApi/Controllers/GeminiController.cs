using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace NinetyFourApi.Controllers;

[Route("api/gemini")]
[ApiController]
public class GeminiController : ControllerBase
{
    private readonly IServiceProvider _serviceProvider;

    public GeminiController(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    [HttpGet("test")]
    public async Task<IActionResult> Test()
    {
        var client = _serviceProvider.GetService<Client>();
        
        if (client == null)
        {
            return StatusCode(503, new { error = "Gemini API is not configured" });
        }

        var response = await client.Models.GenerateContentAsync(
            model: "gemini-2.5-flash",
            contents: "say hi in one sentence"
        );

        var text = response.Candidates[0].Content.Parts[0].Text;

        return Ok(new { text });
    }
}
