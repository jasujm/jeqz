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
import { Button } from "react-bootstrap";
import _ from "lodash";

export type QuizProps = {
  quiz: ApiQuiz;
};

export default function Quiz({ quiz }: QuizProps) {
  const [questions, setQuestions] = React.useState<ApiQuestion[]>([]);

  async function postAnswer(choiceId: string) {
    const question = _.last(questions);
    if (question) {
      try {
        await answerQuestion(question.id, choiceId);
        const currentQuestion = await getQuestion(question.id);
        setQuestions([..._.dropRight(questions), currentQuestion]);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function nextQuestion() {
    try {
      const question = await createQuestion(quiz.id);
      setQuestions([...questions, question]);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    async function refresh() {
      try {
        const questions = await getQuizQuestions(quiz.id);
        setQuestions(
          _.isEmpty(questions) ? [await createQuestion(quiz.id)] : questions
        );
      } catch (err) {
        console.error(err);
      }
    }
    void refresh();
  }, [quiz.id]);

  const question = _.last(questions);
  if (question) {
    const answersByCorrectness = _.countBy(
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
        <span className="question-counter">Question {questions.length}</span>
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
