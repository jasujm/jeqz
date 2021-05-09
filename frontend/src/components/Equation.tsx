import React from "react";
import MathJax from "react-mathjax";

export type EquationProps = {
  name: string;
  markup: string;
};

export default function Equation({ name, markup }: EquationProps) {
  return (
    <div className="equation">
      <MathJax.Provider>
        <h2>{name}</h2>
        <MathJax.Node formula={markup} />
      </MathJax.Provider>
    </div>
  );
}
