import React from "react";
import { render } from "@testing-library/react";
import Equation from "./Equation";
import { expect } from "../test/helpers";

describe("Equation", () => {
  it("test", () => {
    const props = { name: "Test equation", markup: "a + b = c" };
    render(<Equation {...props} />);
    expect(document.querySelector(".equation")).to.contain.text(props.name);
  });
});
