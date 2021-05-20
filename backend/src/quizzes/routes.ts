import Router from "@koa/router";
import { Quiz } from "./models";

const router = new Router({ prefix: "/quizzes" });

router.post("quizzes", "/", async (ctx) => {
  const quiz = await Quiz.create();
  const question = await quiz.createQuestion();
  ctx.status = 201;
  ctx.set("Location", router.url("quiz_details", { id: quiz.id }));
  ctx.body = {
    ...quiz,
    questionId: question.id,
  };
});

router.get("quiz_details", "/:id", async (ctx) => {
  const quiz = await Quiz.query().findById(ctx.params.id);
  if (quiz) {
    const question = await quiz.$relatedQuery("questions").first();
    ctx.body = {
      ...quiz,
      questionId: question?.id,
    };
  }
});

export default router;
