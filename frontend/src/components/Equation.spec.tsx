import React from "react";
import { render, screen } from "@testing-library/react";
import Equation from "./Equation";
import { expect } from "../test/helpers";
import pick from "lodash/pick";

const equation = {
  name: "Test equation",
  markup: "a + b = c",
  wikipediaId: "12345",
  wikipediaTimestamp: "2021-01-01",
  retrievedAt: "2021-02-01",
};

describe("Equation", () => {
  it("should contain citation with all parameters present", () => {
    render(<Equation equation={equation} />);
    expect(screen.getByRole("link"))
      .to.have.text(equation.name)
      .and.to.have.attr("href")
      .that.contains(equation.wikipediaId);
  });
  it("should not contain citation with citation parameters not present", () => {
    render(<Equation equation={pick(equation, "markup")} />);
    expect(screen.queryByText(equation.name)).not.to.exist;
  });
});
