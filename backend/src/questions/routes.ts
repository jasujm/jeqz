import Router from "@koa/router";
import { Question, Choice } from "./models";
import { Equation } from "../equations";
import _ from "lodash";

const router = new Router({ prefix: "/questions" });

function makeEquationResponse(equation: Equation, isAnswered: boolean) {
  const keys = ["markup", ...(isAnswered ? ["name"] : [])];
  return _.pick(equation, keys);
}

function makeChoiceResponse(choice: Choice) {
  return {
    id: choice.id,
    label: choice.equation.name,
  };
}

async function makeQuestionResponse(question: Question) {
  const choices = await question
    .$relatedQuery("choices")
    .withGraphJoined("equation");
  const correctChoice = choices.find((choice) => choice.isCorrect);
  const isAnswered = choices.some((choice) => choice.isSelected);
  return {
    id: question.id,
    quizId: question.quizId,
    equation:
      correctChoice && makeEquationResponse(correctChoice.equation, isAnswered),
    choices: choices.map((choice) => makeChoiceResponse(choice)),
    ...(isAnswered
      ? {
          answer: {
            choiceId: choices.find((choice) => choice.isSelected)?.id,
          },
          correctAnswer: {
            choiceId: choices.find((choice) => choice.isCorrect)?.id,
          },
        }
      : {}),
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

router.put("question_answer_update", "/:id/answer", async (ctx) => {
  const question = await Question.query().findById(ctx.params.id);
  if (!question) {
    return;
  }
  const choiceId = ctx.request.body?.choiceId;
  if (typeof choiceId !== "string") {
    ctx.body = "Invalid answer";
    ctx.status = 422;
    return;
  }
  try {
    await question.answer(choiceId);
    ctx.status = 204;
  } catch (err) {
    ctx.body = err.message;
    ctx.status = 409;
  }
});

export default router;
