import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Quiz from "../components/Quiz";
import { getQuiz, Quiz as ApiQuiz } from "../api";
import _ from "lodash";
import { AxiosError } from "axios";
import { Alert } from "react-bootstrap";

class NotFound {}

export default function QuizView() {
  const { id } = _.pick(useParams(), "id") as Record<"id", string>;
  const [quiz, setQuiz] = useState<null | ApiQuiz | NotFound>(null);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const quiz = await getQuiz(id);
        setQuiz(quiz);
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.isAxiosError && axiosError.response?.status === 404) {
          setQuiz(new NotFound());
        } else {
          console.error(err);
        }
      }
    }
    void fetchQuiz();
  }, [id]);

  if (quiz instanceof NotFound) {
    return <Alert variant="warning">Quiz not found</Alert>;
  } else if (quiz !== null) {
    return (
      <article>
        <Quiz quiz={quiz} />
      </article>
    );
  }

  return <span>Loading quiz...</span>;
}
