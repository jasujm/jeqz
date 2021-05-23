import React, { useEffect } from "react";
import Question from "./Question";
import {
  createQuestion,
  getQuestion,
  answerQuestion,
  Question as ApiQuestion,
  Quiz as ApiQuiz,
} from "../api";
import { Button } from "react-bootstrap";

export type QuizProps = {
  quiz: ApiQuiz;
};

export default function Quiz({ quiz }: QuizProps) {
  const [question, setQuestion] = React.useState<ApiQuestion | null>(null);

  async function postAnswer(choiceId: string) {
    if (question) {
      try {
        await answerQuestion(question.id, choiceId);
        const refreshedQuestion = await getQuestion(question.id);
        setQuestion(refreshedQuestion);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function nextQuestion() {
    try {
      const question = await createQuestion(quiz.id);
      setQuestion(question);
    } catch (err) {
      console.error(err);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    void nextQuestion();
  }, [quiz.id]);

  if (question) {
    return (
      <div className="quiz">
        <Question onAnswer={postAnswer} question={question} />
        <Button
          variant="primary"
          block
          disabled={!question.answer}
          onClick={nextQuestion}
        >
          Next question
        </Button>
      </div>
    );
  }
  return <span>Loading question...</span>;
}
