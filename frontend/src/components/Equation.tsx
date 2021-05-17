import React from "react";
import MathJax from "react-mathjax";

export type EquationProps = {
  name?: string;
  markup: string;
};

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
