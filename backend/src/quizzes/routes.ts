import Router from "@koa/router";
import { Quiz, Question, Choice } from "./models";
import { Equation } from "../equations";
import _ from "lodash";

const router = new Router({ prefix: "/quizzes" });

function makeEquationResponse(equation: Equation) {
  return _.pick(equation, "markup");
}

function makeChoiceResponse(choice: Choice) {
  return {
    value: _.toString(choice.rank),
    label: choice.equation.name,
  };
}

async function makeQuestionResponse(question: Question) {
  const choices = await question
    .$relatedQuery("choices")
    .withGraphJoined("equation");
  const correctChoice = choices.find((choice) => choice.isCorrect);
  return {
    id: question.id,
    quizId: question.quizId,
    equation: correctChoice && makeEquationResponse(correctChoice.equation),
    choices: choices.map(makeChoiceResponse),
  };
}

router.post("quizzes", "/", async (ctx) => {
  const quiz = await Quiz.create();
  const question = await quiz.createQuestion();
  ctx.status = 201;
  ctx.set("Location", router.url("quiz_details", { id: quiz.id }));
  ctx.body = {
    ...quiz,
    currentQuestion: await makeQuestionResponse(question),
  };
});

router.get("quiz_details", "/:id", async (ctx) => {
  const quiz = await Quiz.query()
    .findById(ctx.params.id)
    .withGraphFetched("questions");
  ctx.body = quiz;
});

export default router;
