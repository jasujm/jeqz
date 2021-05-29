import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import Router from "@koa/router";

import { router as equationsRouter } from "./equations";
import { router as quizzesRouter } from "./quizzes";
import { router as questionsRouter } from "./questions";

import "./db";

const isDevelopment = process.env.NODE_ENV === "development";

const router = new Router({ prefix: "/api/v1" });

router
  .use(equationsRouter.routes())
  .use(equationsRouter.allowedMethods())
  .use(quizzesRouter.routes())
  .use(quizzesRouter.allowedMethods())
  .use(questionsRouter.routes())
  .use(questionsRouter.allowedMethods());

const app = new Koa();

if (isDevelopment) {
  app.use(cors({ origin: "http://localhost:3000" }));
}

app.use(bodyParser()).use(router.routes()).use(router.allowedMethods());

export default app;
