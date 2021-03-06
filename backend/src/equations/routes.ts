import Router from "@koa/router";
import { Equation } from "./models";

const router = new Router({ prefix: "/equations" });

router.get("/", async (ctx) => {
  ctx.body = await Equation.query().modify("defaultSelect");
});

router.get("/:id", async (ctx) => {
  ctx.body = await Equation.query()
    .findById(ctx.params.id)
    .modify("defaultSelect");
});

export default router;
