"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddQuesion from "../app/add_questions/page";

export default function Home() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Load theme preference from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("vprep-theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark-theme");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark-theme");
    }
  }, []);

  // Function to toggle theme and persist choice
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark-theme");
      localStorage.setItem("vprep-theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark-theme");
      localStorage.setItem("vprep-theme", "dark");
      setDarkMode(true);
    }
  };

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
    router.push(`/question?text=${encodeURIComponent(question)}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>, question: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleQuestionClick(question);
    }
  };

  return (
    <div className="landing-page" role="main">
      <header>
        <h1 tabIndex={0}>AI-Based Interview Platform</h1>
        <p tabIndex={0}>Choose between HR and Technical questions to prepare for your next interview.</p>
        <button
          onClick={toggleDarkMode}
          aria-pressed={darkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          type="button"
          className="theme-toggle-btn"
        >
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      {/* ...rest of your UI remains the same... */}

      <header>
        <h1 tabIndex={0}>AI-Based Interview Platform</h1>
        <p tabIndex={0}>Choose between HR and Technical questions to prepare for your next interview.</p>
      </header>

      <main>
        <section className="category-selection" aria-label="Question Categories">
          <h2>Select a Question Category</h2>
          <div className="button-group" role="group" aria-label="Question category selection buttons">
            <button
              onClick={() => fetchQuestions("HR")}
              aria-pressed="false"
              aria-label="Load HR questions"
              type="button"
            >
              HR Questions
            </button>
            <button
              onClick={() => fetchQuestions("Technical")}
              aria-pressed="false"
              aria-label="Load Technical questions"
              type="button"
            >
              Technical Questions
            </button>
          </div>
        </section>

        <section className="add-question" aria-label="Add a new interview question">
          <h3>Add a New Question</h3>
          <AddQuesion />
        </section>

        <section className="questions-display" aria-live="polite" aria-atomic="true">
          {loading ? (
            <p>Loading questions...</p>
          ) : questions.length > 0 ? (
            <ul>
              {questions.map((question, index) => (
                <li
                  key={index}
                  tabIndex={0}
                  role="button"
                  aria-label={`Interview question: ${question}`}
                  onClick={() => handleQuestionClick(question)}
                  onKeyDown={(e) => handleKeyDown(e, question)}
                >
                  {question}
                </li>
              ))}
            </ul>
          ) : (
            <p>No questions available. Please choose a category.</p>
          )}
        </section>
      </main>

      <style jsx>{`
        .landing-page {
          text-align: center;
          padding: 20px 15px;
          font-family: Arial, sans-serif;
          color: var(--foreground);
          max-width: 900px;
          margin: 0 auto;
        }
        header h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 8px;
          animation: fadeInDown 0.8s ease forwards;
        }
        header p {
          font-size: 1.1rem;
          color: #555;
          margin-bottom: 25px;
          animation: fadeInDown 1s ease forwards;
        }
        .category-selection {
          margin-top: 20px;
        }
        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
          margin-top: 20px;
        }
        button {
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 8px;
          color: white;
          background-color: var(--primary-color);
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
          box-shadow: 0px 4px 10px var(--button-shadow);
        }
        button:hover,
        button:focus-visible {
          background-color: var(--primary-color-hover);
          transform: scale(1.05);
          outline-offset: 4px;
          outline: 3px solid var(--focus-outline);
        }
        .add-question {
          margin: 40px auto 20px auto;
          padding: 20px;
          max-width: 600px;
          background: #f4f4f4;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          text-align: center;
          animation: fadeIn 1.2s ease forwards;
        }
        .add-question h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 12px;
        }
        .add-question form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .add-question input,
        .add-question textarea {
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          transition: border-color 0.3s ease;
        }
        .add-question input:focus,
        .add-question textarea:focus {
          border-color: var(--primary-color);
          outline: none;
          box-shadow: 0 0 5px var(--primary-color);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .add-question textarea {
          resize: vertical;
          min-height: 80px;
        }
        .add-question button {
          align-self: center;
          padding: 10px 20px;
          font-size: 16px;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }
        .add-question button:hover,
        .add-question button:focus-visible {
          background-color: var(--primary-color-hover);
          transform: scale(1.05);
          outline-offset: 4px;
          outline: 3px solid var(--focus-outline);
        }
        .questions-display {
          margin-top: 40px;
          min-height: 150px;
          animation: fadeIn 1.4s ease forwards;
        }
        ul {
          list-style-type: none;
          padding: 0;
          max-width: 800px;
          margin: 0 auto;
        }
        li {
          margin: 12px auto;
          padding: 14px 20px;
          font-size: 18px;
          cursor: pointer;
          border: 1.5px solid var(--foreground);
          border-radius: 6px;
          transition: background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
          text-align: left;
          max-width: 90%;
          overflow-wrap: break-word;
          user-select: none;
        }
        li:hover,
        li:focus-visible {
          background-color: #f9f9f9;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          color: var(--primary-color);
          outline-offset: 4px;
          outline: 3px solid var(--focus-outline);
        }
        p {
          color: var(--foreground);
          font-size: 1.1rem;
        }
        /* Animations */
        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Responsive styles */
        @media only screen and (max-width: 768px) {
          .landing-page {
            padding: 15px 10px;
          }
          header h1 {
            font-size: 1.8rem;
          }
          header p {
            font-size: 1.0rem;
            margin-bottom: 20px;
          }
          .button-group {
            flex-direction: column;
          }
          button {
            width: 100%;
            max-width: 280px;
            margin: 0 auto;
          }
          .add-question {
            width: 90%;
            padding: 15px;
          }
          li {
            font-size: 16px;
            max-width: 100%;
            padding: 12px 15px;
          }
        }

        @media only screen and (max-width: 400px) {
          header h1 {
            font-size: 1.5rem;
          }
          .add-question h3 {
            font-size: 1.3rem;
          }
          button {
            font-size: 14px;
            padding: 10px 18px;
          }
          li {
            font-size: 15px;
            padding: 10px 12px;
          }
        }
      `}</style>
    </div>
  );
}
