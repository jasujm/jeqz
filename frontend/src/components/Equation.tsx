import React from "react";
import MathJax from "react-mathjax";
import { Equation as ApiEquation } from "../api";
import "./Equation.scss";

export type EquationProps = {
  equation: ApiEquation;
};

function getCitation({
  name,
  wikipediaId,
  wikipediaTimestamp,
  retrievedAt,
}: Omit<ApiEquation, "markup">) {
  if (name && wikipediaId && wikipediaTimestamp && retrievedAt) {
    const formattedWikipediaTimestamp = new Date(
      wikipediaTimestamp
    ).toDateString();
    const formattedRetrievedAt = new Date(retrievedAt).toDateString();
    const url = new URL("https://en.wikipedia.org/w/index.php");
    url.searchParams.append("title", name.replace(/ /g, "_"));
    url.searchParams.append("oldid", wikipediaId);
    return (
      <cite>
        Wikipedia, The Free Encyclopedia: <a href={url.toString()}>{name}</a>,{" "}
        {formattedWikipediaTimestamp}. Retrieved: {formattedRetrievedAt}
      </cite>
    );
  }
}

export default function Equation({
  equation: { markup, ...citation },
}: EquationProps) {
  return (
    <div className="equation">
      <MathJax.Provider>
        <MathJax.Node formula={markup} />
      </MathJax.Provider>
      <div className="citation">{getCitation(citation)}</div>
    </div>
  );
}
