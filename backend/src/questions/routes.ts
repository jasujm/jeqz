import Router from "@koa/router";
import { Question, Choice } from "./models";
import { Equation } from "../equations";
import _ from "lodash";

const router = new Router({ prefix: "/questions" });

function makeEquationResponse(equation: Equation, isAnswered: boolean) {
  const keys = ["markup", ...(isAnswered ? ["name"] : [])];
  return _.pick(equation, keys);
}

function makeChoiceResponse(choice: Choice, isAnswered: boolean) {
  return {
    value: _.toString(choice.rank),
    label: choice.equation.name,
    ...(isAnswered
      ? { isSelected: !!choice.isSelected, isCorrect: !!choice.isCorrect }
      : {}),
  };
}

async function makeQuestionResponse(question: Question) {
  const choices = await question
    .$relatedQuery("choices")
    .orderBy("rank")
    .withGraphJoined("equation");
  const correctChoice = choices.find((choice) => choice.isCorrect);
  const isAnswered = choices.some((choice) => choice.isSelected);
  return {
    id: question.id,
    quizId: question.quizId,
    equation:
      correctChoice && makeEquationResponse(correctChoice.equation, isAnswered),
    choices: choices.map((choice) => makeChoiceResponse(choice, isAnswered)),
  };
}

router.get("question_details", "/:id", async (ctx) => {
  const question = await Question.query().findById(ctx.params.id);
  if (question) {
    ctx.body = await makeQuestionResponse(question);
  }
});

router.post("question_answer", "/:id/answer", async (ctx) => {
  const question = await Question.query().findById(ctx.params.id);
  if (!question) {
    return;
  }
  const answer = ctx.request.query.answer;
  if (typeof answer !== "string") {
    ctx.body = "Missing or invalid choice";
    ctx.status = 422;
    return;
  }
  try {
    await question.answer(answer);
    ctx.status = 204;
  } catch (err) {
    ctx.body = err.message;
    ctx.status = 409;
  }
});

export default router;
