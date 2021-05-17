import React from "react";
import { render } from "@testing-library/react";
import Equation from "./Equation";
import { expect } from "../test/helpers";

const name = "Test equation";
const props = { markup: "a + b = c" };

describe("Equation", () => {
  it("should contain name if provided", () => {
    render(<Equation name={name} {...props} />);
    expect(document.querySelector(".equation")).to.contain.text(name);
  });
  it("should not contain name if not provided", () => {
    render(<Equation {...props} />);
    expect(document.querySelector(".equation")).to.not.contain.text(name);
  });
});
