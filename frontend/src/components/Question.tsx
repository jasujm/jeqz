import React from "react";
import Equation from "./Equation";
import { Form } from "react-bootstrap";
import "./Question.scss";
import classnames from "classnames";
import { Question as ApiQuestion, Choice } from "../api";

export type QuestionProps = ApiQuestion & {
  onAnswer: (choiceId: string) => void;
};

function getChoiceClasses(choice: Choice) {
  return classnames("choice", {
    correct: choice.isCorrect === true,
    incorrect: choice.isCorrect === false,
    selected: choice.isSelected,
  });
}

export default function Question({
  id,
  equation,
  choices,
  onAnswer,
}: QuestionProps) {
  const isAnswered = choices.some((choice) => choice.isSelected);
  return (
    <div className="question">
      <h2>What is this equation?</h2>
      {equation ? <Equation {...equation} /> : <span>Loading equation</span>}
      <div className="choices">
        {choices.map((choice) => {
          const key = `question-${id}-choice-${choice.value}`;
          return (
            <Form.Check
              key={key}
              id={key}
              className={getChoiceClasses(choice)}
              type="radio"
              label={choice.label}
              value={choice.value}
              disabled={isAnswered}
              checked={choice.isSelected}
              onChange={(event) => onAnswer(event.target.value)}
            />
          );
        })}
      </div>
    </div>
  );
}
