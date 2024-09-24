"use client"; // Enables client-side interactivity

import { useState } from "react";

export default function AddQuestion() {
  const [category, setCategory] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Data to send to the API
    const questionData = {
      category,
      text: questionText,
    };

    try {
      const res = await fetch("/api/add_question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Question added successfully!");
        setCategory("");
        setQuestionText("");
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Add a New Question</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="HR">HR</option>
          <option value="Technical">Technical</option>
        </select>

        <label htmlFor="question">Question</label>
        <textarea
          id="question"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Add Question"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <style jsx>{`
        .form-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        label,
        select,
        textarea,
        p {
          color: black; /* Set text color to black */
        }
        label {
          margin: 10px 0 5px;
        }
        select,
        textarea {
          padding: 8px;
          margin-bottom: 20px;
          font-size: 16px;
        }
        button {
          padding: 10px;
          background-color: #0070f3;
          color: black;
          border: none;
          cursor: pointer;
        }
        button:disabled {
          background-color: gray;
        }
      `}</style>
    </div>
  );
}
