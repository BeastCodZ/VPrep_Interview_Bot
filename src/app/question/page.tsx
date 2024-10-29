"use client"; // Enables client-side functionality like state and hooks

import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the Google Generative AI
import ReactMarkdown from "react-markdown"; // Import react-markdown

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function QuestionPage() {
  const [githubLink, setGithubLink] = useState("");
  const [message, setMessage] = useState("");
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const query = new URLSearchParams(window.location.search).get("text");
      setQuestion(query || "");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!githubLink) {
      setMessage("Please provide a valid GitHub link.");
      return;
    }

    const modifiedLink = githubLink.replace("/blob/", "/raw/");
    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ githubLink: modifiedLink }),
      });

      const data = await response.json();
      if (response.ok) {
        setTranscript(data.transcript);
        setMessage("Audio recording submitted successfully!");
      } else {
        setMessage("Error transcribing audio.");
      }
      setGithubLink("");
    } catch (error) {
      console.error("Error during transcription:", error);
      setMessage("An unexpected error occurred during transcription.");
    }
  };

  const handleAnalyze = async () => {
    if (!transcript || !question) {
      setMessage("No transcript or question available for analysis.");
      return;
    }

    const prompt = `
      Assume that you are an experienced Campus Recruiter with over 20 years of experience in hiring fresher candidates in Technical and Non-Technical Domains.
      You will be given a transcript or response of a candidate to a question asked.
      Provide a detailed report on:
      1. How well the candidate answered the question.
      2. Areas for improvement.
      3. The ideal answer to the question.
      
      Analyze the following transcript based on the question: "${question}"
      Transcript: "${transcript}"
      
      Please format your response using clear section headings for each of the above points.
    `;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      setAnalysis(responseText);
      setMessage("Analysis completed successfully!");
    } catch (error) {
      console.error("Error analyzing transcript:", error);
      setMessage("Error analyzing transcript.");
    }
  };

  return (
    <div className="question-page">
      <h1>{decodeURIComponent(question || "")}</h1>
      <p>Provide the GitHub link to your audio recording below:</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="githubLink">GitHub Link</label>
        <input
          type="url"
          id="githubLink"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          placeholder="Enter your GitHub link"
          required
        />

        <button type="submit">Submit</button>
      </form>

      {message && <p className="message">{message}</p>}

      {transcript && (
        <button onClick={handleAnalyze} className="analyze-button">
          Analyze Transcript
        </button>
      )}

      {analysis && (
        <div className="analysis-result">
          <h2>Analysis Result:</h2>
          {analysis
            .split(/^#\s.+$/gm)
            .filter((section) => section.trim() !== "")
            .map((section, index) => (
              <ReactMarkdown key={index}>{section}</ReactMarkdown>
            ))}
        </div>
      )}

      <style jsx>{`
        .question-page {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px;
          text-align: center;
          color: #000;
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 20px;
          color: #006400; /* Dark green */
          font-weight: bold;
          text-transform: capitalize;
        }

        p {
          font-size: 1.1rem;
          margin-bottom: 20px;
          color: #333;
        }

        form {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 4px 10px rgba(0, 100, 0, 0.15); /* Subtle green shadow */
          margin-bottom: 20px;
        }

        label {
          margin-bottom: 10px;
          font-size: 1.2rem;
          color: #006400;
        }

        input {
          width: 100%;
          padding: 10px;
          margin-bottom: 20px;
          border: 1px solid #006400;
          border-radius: 4px;
          font-size: 1rem;
          color: #333;
        }

        button {
          padding: 10px 20px;
          font-size: 1rem;
          background-color: #006400;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
          box-shadow: 0px 2px 6px rgba(0, 100, 0, 0.2);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        button:hover {
          background-color: #004d00;
          box-shadow: 0px 4px 10px rgba(0, 77, 0, 0.3);
        }

        .analyze-button {
          background-color: #228b22;
          margin-top: 20px;
        }

        .analyze-button:hover {
          background-color: #196619;
        }

        .message {
          color: #228b22;
          font-weight: bold;
          margin-top: 15px;
          font-size: 1rem;
        }

        .analysis-result {
          text-align: left;
          margin-top: 30px;
          padding: 20px;
          background: #f2fff2; /* Light green background */
          border: 1px solid #006400;
          border-radius: 8px;
        }

        .analysis-result h2 {
          font-size: 1.8rem;
          color: #006400;
          margin-bottom: 20px;
        }

        .analysis-result p,
        .analysis-result li {
          color: #333;
          margin-bottom: 10px;
          line-height: 1.6;
        }

        ul {
          list-style-type: disc;
          margin-left: 20px;
          color: #333;
        }
      `}</style>
    </div>
  );
}
