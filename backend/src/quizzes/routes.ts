import Router from "@koa/router";
import { Quiz } from "./models";
import { router as questionRouter, makeQuestionResponse } from "../questions";

const router = new Router({ prefix: "/quizzes" });

router.post("quizzes", "/", async (ctx) => {
  const quiz = await Quiz.create();
  ctx.status = 201;
  ctx.set("Location", router.url("quiz_details", { id: quiz.id }));
  ctx.body = quiz;
});

router.get("quiz_details", "/:id", async (ctx) => {
  const quiz = await Quiz.query().findById(ctx.params.id);
  if (quiz) {
    ctx.body = quiz;
  }
});

router.get("quiz_questions", "/:id/questions", async (ctx) => {
  const questions = await Quiz.relatedQuery("questions")
    .for(ctx.params.id)
    .modify("defaultOrder")
    .withGraphFetched("choices(defaultOrder).[equation]");
  ctx.body = questions.map(makeQuestionResponse);
});

router.post("quiz_questions_create", "/:id/questions", async (ctx) => {
  const quiz = await Quiz.query().findById(ctx.params.id);
  if (!quiz) {
    return;
  }
  try {
    const question = await quiz.createQuestion();
    ctx.status = 201;
    ctx.set(
      "Location",
      questionRouter.url("question_details", { id: question.id })
    );
    ctx.body = makeQuestionResponse(question);
  } catch (err) {
    ctx.body = err.message;
    ctx.status = 409;
  }
});

export default router;
