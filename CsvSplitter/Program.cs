using System;
using System.IO;
using System.Globalization;
using System.Linq;
using CsvHelper;
using CsvHelper.Configuration;
using CsvHelper.Configuration.Attributes;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var inputPath = "../data/raw.csv";
        var questionsPath = "../data/Questions.csv";
        var answersPath = "../data/Answers.csv";

        using var reader = new StreamReader(inputPath);

        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            TrimOptions = TrimOptions.Trim,
            BadDataFound = null
        };

        using var csv = new CsvReader(reader, config);

        var records = csv.GetRecords<RawRow>().ToList();

        using var qWriter = new StreamWriter(questionsPath);
        using var aWriter = new StreamWriter(answersPath);

        qWriter.WriteLine("Id,Text");
        aWriter.WriteLine("QuestionId,AnswerText,Percentage");

        int questionId = 1;

        foreach (var row in records)
        {
            var question = row.Question ?? "";
            qWriter.WriteLine($"{questionId},\"{Escape(question)}\"");

            WriteAnswer(aWriter, questionId, row.Answer1, row.Pct1);
            WriteAnswer(aWriter, questionId, row.Answer2, row.Pct2);
            WriteAnswer(aWriter, questionId, row.Answer3, row.Pct3);
            WriteAnswer(aWriter, questionId, row.Answer4, row.Pct4);
            WriteAnswer(aWriter, questionId, row.Answer5, row.Pct5);
            WriteAnswer(aWriter, questionId, row.Answer6, row.Pct6);

            questionId++;
        }
    }

    static void WriteAnswer(StreamWriter writer, int qId, string answer, int? pct)
    {
        if (string.IsNullOrWhiteSpace(answer)) return;
        if (pct == null) return;

        writer.WriteLine($"{qId},\"{Escape(answer)}\",{pct}");
    }

    static string Escape(string s)
    {
        return s.Replace("\"", "\"\"");
    }
}


public class RawRow
{
    public string Question { get; set; }

    [Name("Answer 1")]
    public string Answer1 { get; set; }
    [Name("#1")]
    public int? Pct1 { get; set; }

    [Name("Answer 2")]
    public string Answer2 { get; set; }
    [Name("#2")]
    public int? Pct2 { get; set; }

    [Name("Answer 3")]
    public string Answer3 { get; set; }
    [Name("#3")]
    public int? Pct3 { get; set; }

    [Name("Answer 4")]
    public string Answer4 { get; set; }
    [Name("#4")]
    public int? Pct4 { get; set; }

    [Name("Answer 5")]
    public string Answer5 { get; set; }
    [Name("#5")]
    public int? Pct5 { get; set; }

    [Name("Answer 6")]
    public string Answer6 { get; set; }
    [Name("#6")]
    public int? Pct6 { get; set; }
}
