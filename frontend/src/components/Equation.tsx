import React from "react";
import MathJax from "react-mathjax";
import { Equation as ApiEquation } from "../api";

export type EquationProps = ApiEquation;

export default function Equation({ name, markup }: EquationProps) {
  return (
    <div className="equation">
      <MathJax.Provider>
        <MathJax.Node formula={markup} />
        {name && <cite>{name}</cite>}
      </MathJax.Provider>
    </div>
  );
}
