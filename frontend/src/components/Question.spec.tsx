import React from "react";
import { render } from "@testing-library/react";
import Question from "./Question";
import { expect } from "../test/helpers";

const props = {
  equation: { markup: "a + b = c" },
  choices: [
    { value: "1", label: "Awesome equation" },
    { value: "2", label: "Terrific equation" },
    { value: "3", label: "Just another equation" },
  ],
};

describe("Question", () => {
  beforeEach(() => {
    render(<Question {...props} />);
  });
  it("should contain equation", () => {
    expect(document.querySelectorAll(".equation")).to.exist;
  });
  it("should contain choices", () => {
    const choices = document.querySelectorAll(".choices .choice");
    expect(choices).to.have.length(props.choices.length);
    choices.forEach((choice, i) =>
      expect(choice)
        .to.have.text(props.choices[i].label)
        .and.to.have.descendant("input[type=radio]")
    );
  });
});
