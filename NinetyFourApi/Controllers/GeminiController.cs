using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.AspNetCore.Mvc;

namespace NinetyFourApi.Controllers;

[Route("api/gemini")]
[ApiController]
public class GeminiController : ControllerBase
{
    private readonly Client _client;

    public GeminiController(Client client)
    {
        _client = client;
    }

    [HttpGet("test")]
    public async Task<IActionResult> Test()
    {
        var response = await _client.Models.GenerateContentAsync(
            model: "gemini-2.5-flash",
            contents: "say hi in one sentence"
        );

        var text = response.Candidates[0].Content.Parts[0].Text;

        return Ok(new { text });
    }
}
