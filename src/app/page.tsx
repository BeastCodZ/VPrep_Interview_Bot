"use client"; // This makes the component a client-side component

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use the new `next/navigation` module
import AddQuesion from "../app/add_questions/page";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();  // Now use the correct `useRouter` from `next/navigation`

  const fetchQuestions = async (category: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/questions?category=${category}`);
      const data = await res.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    // Navigates to the question page with the selected question in the query params
    router.push(`/question?text=${encodeURIComponent(question)}`);
  };

  return (
    <div className="landing-page">
      <header>
        <h1>AI-Based Interview Platform</h1>
        <p>Choose between HR and Technical questions to prepare for your next interview.</p>
      </header>

      <main>
        <section className="category-selection">
          <h2>Select a Question Category</h2>
          <div className="button-group">
            <button onClick={() => fetchQuestions("HR")}>HR Questions</button>
            <button onClick={() => fetchQuestions("Technical")}>
              Technical Questions
            </button>
          </div>
        </section>

        <AddQuesion />

        <section className="questions-display">
          {loading ? (
            <p>Loading questions...</p>
          ) : (
            <ul>
              {questions.length > 0 ? (
                questions.map((question, index) => (
                  <li key={index} onClick={() => handleQuestionClick(question)}>
                    {question}
                  </li>
                ))
              ) : (
                <p>No questions available. Please choose a category.</p>
              )}
            </ul>
          )}
        </section>
      </main>

      <style jsx>{`
        .landing-page {
          text-align: center;
          padding: 50px;
        }
        .category-selection {
          margin-top: 20px;
        }
        button {
          margin: 10px;
          padding: 10px 20px;
          font-size: 16px;
        }
        .questions-display {
          margin-top: 30px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          margin: 10px 0;
          font-size: 18px;
          cursor: pointer;
          text-decoration: underline;
        }
        li:hover {
          color: blue;
        }
      `}</style>
    </div>
  );
}
