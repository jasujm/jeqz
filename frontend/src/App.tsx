import React, { useEffect } from "react";
import "./App.scss";
import axios from "axios";
import Question, { QuestionProps } from "./components/Question";

const client = axios.create({
  baseURL: "http://localhost:3030",
  timeout: 1000,
});

export default function App() {
  const [question, setQuestion] = React.useState<QuestionProps | null>(null);

  useEffect(() => {
    void client
      .post("/quizzes")
      .then((response) => {
        setQuestion(response.data.currentQuestion || null);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="app">
      {question ? <Question {...question} /> : <span>Loading question...</span>}
    </div>
  );
}
