import React, { useEffect } from "react";
import Question from "./Question";
import {
  getQuestion,
  answerQuestion,
  Question as ApiQuestion,
  Quiz as ApiQuiz,
} from "../api";

export type QuizProps = ApiQuiz;

export default function Quiz({ questionId }: QuizProps) {
  const [question, setQuestion] = React.useState<ApiQuestion | null>(null);

  function refresh() {
    void getQuestion(questionId)
      .then(setQuestion)
      .catch(console.error);
  }

  function postAnswer(answer: string) {
    void answerQuestion(questionId, answer)
      .then(refresh)
      .catch(console.error);
  }

  useEffect(refresh, [questionId]);

  if (question) {
    return <Question onAnswer={postAnswer} {...question} />;
  }
  return <span>Loading question...</span>;
}
