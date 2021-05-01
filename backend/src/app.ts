import Koa from 'koa';
import cors from '@koa/cors';

const app = new Koa();

// FIXME: Only in dev
app.use(cors({ origin: "http://localhost:3000" }));

app.use(async ctx => {
  ctx.body = "Hello, world!\n";
});

app.listen(3030);
