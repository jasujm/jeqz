import Koa from "koa";
import cors from "@koa/cors";

import { router as equationsRouter } from "./equations";
import { router as quizzesRouter } from "./quizzes";

import "./db";

const isDevelopment = process.env.NODE_ENV === "development";

const app = new Koa();

if (isDevelopment) {
  app.use(cors({ origin: "http://localhost:3000" }));
}

app
  .use(equationsRouter.routes())
  .use(equationsRouter.allowedMethods())
  .use(quizzesRouter.routes())
  .use(quizzesRouter.allowedMethods());

export default app;
