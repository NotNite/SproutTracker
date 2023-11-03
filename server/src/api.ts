import Koa from "koa";
import Router from "@koa/router";
import { bodyParser } from "@koa/bodyparser";
import { AdminCreateSchema, ProgressSubmitSchema } from "./schema";
import {
  createUser,
  getCharacter,
  getUserFromToken,
  submitProgress
} from "./db";
import { getBearerToken, isAdmin } from "./util";

const app = new Koa();
const router = new Router();

router.post("/progress/submit", async (ctx) => {
  const body = ProgressSubmitSchema.parse(ctx.request.body);

  const user = await getUserFromToken(ctx.request.header.authorization);
  if (user === null) {
    ctx.response.status = 401;
    return;
  }

  const character = await getCharacter(user, body.character);
  await submitProgress(character, body);
  ctx.response.status = 204;
});

router.post("/admin/create", async (ctx) => {
  if (!isAdmin(ctx.request.header.authorization)) {
    ctx.response.status = 401;
    return;
  }

  const { username } = AdminCreateSchema.parse(ctx.request.body);
  const user = await createUser(username);

  ctx.response.status = 201;
  ctx.response.body = {
    username: user.username,
    key: user.key
  };
});

app.use(bodyParser()).use(router.routes()).use(router.allowedMethods());

export default app;
