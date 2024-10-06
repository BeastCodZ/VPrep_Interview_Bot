"use client"; // Enables client-side functionality like state and hooks

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [transcript, setTranscript] = useState(""); // Store the transcript for later use
  const [analysis, setAnalysis] = useState(""); // Store the analysis result
  const router = useRouter();

  const question = new URLSearchParams(window.location.search).get("text");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!githubLink) {
      setMessage("Please provide a valid GitHub link.");
      return;
    }

    // Modify the GitHub link to use the raw format
    const modifiedLink = githubLink.replace("/blob/", "/raw/");
    console.log("Modified GitHub link:", modifiedLink); // Debugging

    try {
      // Call backend to process modified GitHub link and get transcript
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ githubLink: modifiedLink }), // Send modified link
      });

      const data = await response.json();
      if (response.ok) {
        setTranscript(data.transcript); // Store the transcript for analysis later
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

  // Handle analyze button click
  const handleAnalyze = async () => {
    if (!transcript || !question) {
      setMessage("No transcript or question available for analysis.");
      return;
    }

    // Create the prompt using the transcript and question
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
      const result = await model.generateContent(prompt); // Call the model with the prompt
      const responseText = result.response.text(); // Assuming this returns the raw text
      setAnalysis(responseText); // Store the analysis result
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

      {message && <p>{message}</p>}

      {/* Show the "Analyze" button only if transcript is available */}
      {transcript && (
        <button onClick={handleAnalyze} className="analyze-button">
          Analyze Transcript
        </button>
      )}

      {/* Show analysis result after analyzing */}
      {analysis && (
        <div className="analysis-result">
          <h2>Analysis Result:</h2>
          {/* Split the analysis into sections based on headings */}
          {analysis
            .split(/^#\s.+$/gm) // Split on headings (e.g., # Section)
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
        }

        h1 {
          font-size: 2rem;
          margin-bottom: 20px;
        }

        p {
          font-size: 1.2rem;
          margin-bottom: 20px;
        }

        form {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        label {
          margin-bottom: 10px;
          font-size: 1.1rem;
        }

        input {
          width: 100%;
          padding: 10px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }

        button {
          padding: 10px 20px;
          font-size: 1rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }

        button:hover {
          background-color: #005bb5;
        }

        .analyze-button {
          background-color: #28a745;
        }

        .analyze-button:hover {
          background-color: #1e7e34;
        }

        .analysis-result {
          text-align: left;
          margin-top: 30px;
        }

        .analysis-result h2 {
          font-size: 1.5rem;
          margin-bottom: 20px;
        }

        .analysis-result p {
          margin-bottom: 10px;
        }

        .analysis-result ul {
          list-style-type: disc;
          margin-left: 20px;
        }

        .analysis-result li {
          margin-bottom: 5px;
        }

        p {
          margin-top: 20px;
          color: green;
        }
      `}</style>
    </div>
  );
}
