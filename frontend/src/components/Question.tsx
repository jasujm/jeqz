import React from "react";
import Equation, { EquationProps } from "./Equation";
import { Form } from "react-bootstrap";
import "./Question.scss";

export type ChoiceProps = {
  value: string;
  label: string;
};

export type QuestionProps = {
  id: string;
  equation: EquationProps;
  choices: readonly ChoiceProps[];
};

export default function Question({ id, equation, choices }: QuestionProps) {
  return (
    <div className="question">
      <Form>
        <h2>What is this equation?</h2>
        <Equation {...equation} />
        <div className="choices">
          {choices.map((choice) => {
            const key = `question-${id}-choice-${choice.value}`;
            return (
              <Form.Check
                key={key}
                id={key}
                className="choice"
                name="choice"
                type="radio"
                {...choice}
              />
            );
          })}
        </div>
      </Form>
    </div>
  );
}
