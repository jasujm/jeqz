import React, { useEffect } from "react";
import "./App.scss";
import axios from "axios";
import Equation, { EquationProps } from "./components/Equation";
import _ from "lodash";

const client = axios.create({
  baseURL: "http://localhost:3030",
  timeout: 1000,
});

export default function App() {
  const [equation, setEquation] = React.useState<EquationProps | null>(null);

  useEffect(() => {
    void client
      .get("/equations")
      .then((response) => {
        setEquation(_.head(response.data) || null);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const equationTag = equation ? (
    <Equation {...equation} />
  ) : (
    <span>Loading equation</span>
  );
  return <div className="app">{equationTag}</div>;
}
