import React, { useEffect } from "react";
import Question from "./Question";
import {
  createQuestion,
  answerQuestion,
  Question as ApiQuestion,
  Quiz as ApiQuiz,
  getQuizQuestions,
  getQuestion,
} from "../api";
import Button from "react-bootstrap/Button";
import isEmpty from "lodash/isEmpty";
import last from "lodash/last";
import dropRight from "lodash/dropRight";
import countBy from "lodash/countBy";
import "./Quiz.scss";
import { AxiosError } from "axios";

export type QuizProps = {
  quiz: ApiQuiz;
};

export default function Quiz({ quiz }: QuizProps) {
  const [questions, setQuestions] = React.useState<ApiQuestion[]>([]);

  async function refresh() {
    try {
      const questions = await getQuizQuestions(quiz.id);
      setQuestions(
        isEmpty(questions) ? [await createQuestion(quiz.id)] : questions
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function handleError(err: Error) {
    const axiosError = err as AxiosError;
    if (axiosError.isAxiosError && axiosError.response?.status === 409) {
      refresh();
    } else {
      console.error(err);
    }
  }

  async function postAnswer(choiceId: string) {
    const question = last(questions);
    if (question) {
      try {
        await answerQuestion(question.id, choiceId);
        const currentQuestion = await getQuestion(question.id);
        setQuestions([...dropRight(questions), currentQuestion]);
      } catch (err) {
        handleError(err);
      }
    }
  }

  async function nextQuestion() {
    try {
      const question = await createQuestion(quiz.id);
      setQuestions([...questions, question]);
    } catch (err) {
      handleError(err);
    }
  }

  useEffect(() => {
    void refresh();
  }, [quiz.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const question = last(questions);
  if (question) {
    const answersByCorrectness = countBy(
      questions,
      (question) =>
        question.answer &&
        question.correctAnswer &&
        question.answer.choiceId === question.correctAnswer.choiceId
    );
    const nCorrectAnswers = answersByCorrectness.true || 0;
    const nIncorrectAnswers = answersByCorrectness.false || 0;
    const nAnswers = nCorrectAnswers + nIncorrectAnswers;

    return (
      <div className="quiz">
        <h2>Question {questions.length}</h2>
        <Question onAnswer={postAnswer} question={question} />
        <Button
          variant="primary"
          block
          disabled={!question.answer}
          onClick={nextQuestion}
        >
          Next question
        </Button>
        <span className="score">
          Score {nCorrectAnswers} / {nAnswers}
        </span>
      </div>
    );
  }
  return <span>Loading question...</span>;
}
