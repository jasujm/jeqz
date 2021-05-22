import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Question from "./Question";
import { expect } from "../test/helpers";
import sinon, { SinonFake } from "sinon";

export const question = {
  id: "4374bc8e-97ad-4ec7-a2c2-e219a1d10748",
  equation: { markup: "a + b = c" },
  choices: [
    { id: "2c68d592-6c9d-4400-b84a-45499288d90e", label: "Awesome equation" },
    { id: "c01b89c6-a35d-4bc7-bc9b-96b744013bc9", label: "Terrific equation" },
    {
      id: "3b2b3599-36f6-4d89-a032-c420adf08527",
      label: "Just another equation",
    },
  ],
};

describe("Question", () => {
  describe("unanswered", () => {
    let onAnswer!: SinonFake;

    beforeEach(() => {
      onAnswer = sinon.fake();
      render(<Question question={question} onAnswer={onAnswer} />);
    });

    it("should contain equation", () => {
      expect(document.querySelectorAll(".equation")).to.exist;
    });

    question.choices.forEach((choice) => {
      it(`should contain choice: ${choice.label}`, () => {
        const input = screen.getByLabelText(choice.label);
        expect(input).to.exist;
      });
    });

    it("should have choices enabled", async () => {
      const inputs = screen.getAllByRole("radio");
      inputs.forEach((input) => {
        expect(input).not.to.have.attribute("disabled");
      });
    });

    it("should trigger answered event", async () => {
      const choice = question.choices[0];
      const input = screen.getByLabelText(choice.label);
      fireEvent.click(input);
      expect(onAnswer).to.have.been.calledWith(choice.id);
    });
  });

  describe("answered", () => {
    beforeEach(() => {
      const answeredQuestion = {
        ...question,
        answer: {
          choiceId: question.choices[0].id,
        },
        correctAnswer: {
          choiceId: question.choices[1].id,
        },
      };
      render(<Question question={answeredQuestion} />);
    });

    it("should have choices disabled", async () => {
      const inputs = screen.getAllByRole("radio");
      inputs.forEach((input) => {
        expect(input).to.have.attribute("disabled");
      });
    });
  });
});
