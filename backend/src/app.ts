import Koa from "koa";
import cors from "@koa/cors";

import equationsRouter from "./equations/routes";
import "./db";

const isDevelopment = process.env.NODE_ENV === "development";

const app = new Koa();

if (isDevelopment) {
  app.use(cors({ origin: "http://localhost:3000" }));
}

app.use(equationsRouter.routes()).use(equationsRouter.allowedMethods());

export default app;
