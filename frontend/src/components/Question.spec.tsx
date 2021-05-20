import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Question from "./Question";
import { expect } from "../test/helpers";
import sinon, { SinonFake } from "sinon";

export const props = {
  id: "4374bc8e-97ad-4ec7-a2c2-e219a1d10748",
  equation: { markup: "a + b = c" },
  choices: [
    { value: "1", label: "Awesome equation" },
    { value: "2", label: "Terrific equation" },
    { value: "3", label: "Just another equation" },
  ],
};

const answeredChoices = props.choices.map((choice) => ({
  ...choice,
  isSelected: choice.value === "1",
  isCorrect: choice.value === "2",
}));

describe("Question", () => {
  describe("unanswered", () => {
    let onAnswer!: SinonFake;

    beforeEach(() => {
      onAnswer = sinon.fake();
      render(<Question {...props} onAnswer={onAnswer} />);
    });

    it("should contain equation", () => {
      expect(document.querySelectorAll(".equation")).to.exist;
    });

    props.choices.forEach((choice) => {
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
      const choice = props.choices[0];
      const input = screen.getByLabelText(choice.label);
      fireEvent.click(input);
      expect(onAnswer).to.have.been.calledWith(choice.value);
    });
  });

  describe("answered", () => {
    beforeEach(() => {
      const answeredProps = { ...props, choices: answeredChoices };
      render(<Question {...answeredProps} />);
    });

    it("should have choices disabled", async () => {
      const inputs = screen.getAllByRole("radio");
      inputs.forEach((input) => {
        expect(input).to.have.attribute("disabled");
      });
    });
  });
});
