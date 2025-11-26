namespace NinetyFourApi.Models;

public class Answer
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public string AnswerText { get; set; }
    public int Percentage { get; set; }
}