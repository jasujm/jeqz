import React, { useEffect } from "react";
import "./App.scss";
import Quiz from "./components/Quiz";
import { createQuiz, Quiz as ApiQuiz } from "./api";

export default function App() {
  const [quiz, setQuiz] = React.useState<ApiQuiz | null>(null);

  useEffect(() => {
    void createQuiz().then(setQuiz).catch(console.error);
  }, []);

  return (
    <div className="app">
      {quiz ? <Quiz quiz={quiz} /> : <span>Creating quiz...</span>}
    </div>
  );
}
