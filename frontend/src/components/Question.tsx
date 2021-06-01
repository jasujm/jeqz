import React from "react";
import Equation from "./Equation";
import { Form } from "react-bootstrap";
import "./Question.scss";
import classnames from "classnames";
import { Question as ApiQuestion, Choice, Answer } from "../api";

export type QuestionProps = {
  question: ApiQuestion;
  onAnswer: (choiceId: string) => void;
};

function getChoiceClasses(
  choice: Choice,
  answer?: Answer,
  correctAnswer?: Answer
) {
  return classnames("choice", {
    correct: correctAnswer && correctAnswer.choiceId === choice.id,
    incorrect: correctAnswer && correctAnswer.choiceId !== choice.id,
    selected: answer?.choiceId === choice.id,
  });
}

export default function Question({
  question: { id, equation, choices, answer, correctAnswer },
  onAnswer,
}: QuestionProps) {
  return (
    <div className="question">
      <p>What is this equation?</p>
      {equation ? (
        <Equation equation={equation} />
      ) : (
        <span>Loading equation</span>
      )}
      <div className="choices">
        {choices.map((choice) => {
          const key = `question-${id}-choice-${choice.id}`;
          return (
            <Form.Check
              key={key}
              id={key}
              className={getChoiceClasses(choice, answer, correctAnswer)}
              type="radio"
              label={choice.label}
              disabled={!!answer}
              checked={answer?.choiceId === choice.id}
              onChange={(event) => onAnswer(choice.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
