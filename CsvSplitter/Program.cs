using System;
using System.IO;
using System.Linq;

class Program
{
    static void Main()
    {
        var inputPath = "../data/raw.csv";
        var questionsPath = "../data/questions.csv";
        var answersPath = "../data/answers.csv";

        using var reader = new StreamReader(inputPath);
        using var qWriter = new StreamWriter(questionsPath);
        using var aWriter = new StreamWriter(answersPath);

        qWriter.WriteLine("id,question");
        aWriter.WriteLine("question_id,answer,percentage");

        int questionId = 1;

        string header = reader.ReadLine();

        while (!reader.EndOfStream)
        {
            string line = reader.ReadLine();
            if (string.IsNullOrWhiteSpace(line)) continue;

            var cells = line.Split(",");

            string question = cells[0].Trim();

            qWriter.WriteLine($"{questionId},\"{question.Replace("\"","\"\"")}\"");

            for (int i = 1; i < cells.Length; i += 2)
            {
                if (i + 1 >= cells.Length) break;

                string answer = cells[i].Trim();
                string percent = cells[i + 1].Trim();

                if (string.IsNullOrWhiteSpace(answer)) continue;
                if (string.IsNullOrWhiteSpace(percent)) continue;

                aWriter.WriteLine($"{questionId},\"{answer.Replace("\"","\"\"")}\",{percent}");
            }

            questionId++;
        }
    }
}
