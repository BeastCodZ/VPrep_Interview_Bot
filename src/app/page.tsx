"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddQuesion from "../app/add_questions/page";

export default function Home() {
  const [questions, setQuestions] = useState([]);
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
    <div className="landing-page">
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
        <section className="category-selection">
          <h2>Select a Question Category</h2>
          <div className="button-group">
            <button onClick={() => fetchQuestions("HR")}>HR Questions</button>
            <button onClick={() => fetchQuestions("Technical")}>Technical Questions</button>
          </div>
        </section>

        <section className="add-question">
          <h3>Add a New Question</h3>
          <AddQuesion />
        </section>

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
          font-family: Arial, sans-serif;
          color: #333;
        }
        header h1 {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 10px;
        }
        header p {
          font-size: 1.2rem;
          color: #555;
        }
        .category-selection {
          margin-top: 20px;
        }
        .button-group {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 20px;
        }
        button {
          padding: 12px 24px;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          color: #fff;
          background-color: #0070f3;
          cursor: pointer;
          transition: background-color 0.3s ease;
          box-shadow: 0px 4px 10px rgba(0, 112, 243, 0.3);
        }
        button:hover {
          background-color: #005bb5;
        }
        .add-question {
          margin-top: 40px;
          padding: 20px;
          width: 60%;  /* Decrease the width to reduce coverage */
          background: #f4f4f4;
          border-radius: 8px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          text-align: center; /* Center align text inside */
          margin-left: auto;
          margin-right: auto;
        }
        .add-question h3 {
          font-size: 1.5rem;
          font-weight: bold;
          color: #0070f3;
          margin-bottom: 10px;
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
        }
        .add-question textarea {
          resize: vertical;
        }
        .add-question button {
          align-self: center;
          padding: 10px 20px;
          font-size: 16px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .add-question button:hover {
          background-color: #005bb5;
        }
        .questions-display {
          margin-top: 40px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          margin: 15px 0;
          padding: 12px 18px;
          font-size: 18px;
          cursor: pointer;
          border: 1px solid #000;
          border-radius: 6px;
          transition: background-color 0.2s ease, box-shadow 0.2s ease;
          text-align: left;
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
        }
        li:hover {
          background-color: #f9f9f9;
          box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
          color: #0070f3;
        }
        p {
          color: #333;
        }
      `}</style>
    </div>
  );
}
