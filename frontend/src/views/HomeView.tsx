import React from "react";
import { useHistory } from "react-router-dom";
import { createQuiz } from "../api";
import sheldon from "../assets/img/sheldon.jpg";
import { Image, Button } from "react-bootstrap";

export default function HomeView() {
  const history = useHistory();

  async function startQuiz() {
    try {
      const quiz = await createQuiz();
      history.push(`/quizzes/${quiz.id}`);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="home">
      <Image
        className="mb-2"
        src={sheldon}
        alt="Sheldon Cooper: Ready to start an equation quiz? It's going to be fun!"
      />
      <Button variant="primary" block onClick={startQuiz}>
        Start quiz
      </Button>
    </div>
  );
}
