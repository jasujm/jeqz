import React, { useEffect } from "react";
import "./App.scss";
import Quiz, { QuizProps } from "./components/Quiz";
import { createQuiz } from "./api";

export default function App() {
  const [quiz, setQuiz] = React.useState<QuizProps | null>(null);

  useEffect(() => {
    void createQuiz().then(setQuiz).catch(console.error);
  }, []);

  return (
    <div className="app">
      {quiz ? <Quiz {...quiz} /> : <span>Creating quiz...</span>}
    </div>
  );
}
