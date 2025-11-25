using Microsoft.AspNetCore.Mvc;
using NinetyFourApis.Data;
using NinetyFourApis.Models;

namespace NinetyFourApis.Controllers;

[ApiController]
[Route("questions")]
public class QuestionsController : ControllerBase
{
    private readonly AppDbContext _db;

    public QuestionsController(AppDbContect db)
    {
        _db = db;
    }

    
}