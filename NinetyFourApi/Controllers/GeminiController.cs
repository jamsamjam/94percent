using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.AspNetCore.Mvc;

namespace NinetyFourApi.Controllers;

[Route("api/gemini")]
[ApiController]
public class GeminiController : ControllerBase
{
    [HttpGet("test")]
    public async Task<IActionResult> Test()
    {
        var client = new Client();

        var response = await client.Models.GenerateContentAsync(
            model: "gemini-2.5-flash",
            contents: "say hi in one sentence"
        );

        var text = response.Candidates[0].Content.Parts[0].Text;

        return Ok(new { text });
    }
}
