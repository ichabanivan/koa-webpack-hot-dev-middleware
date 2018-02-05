import fs from 'fs';
import path from 'path';
import Router from 'koa-router';

import controller from './controller';

const router = new Router();

router
  .post("/signUp", controller.signup)
  .post("/signIn", controller.signin)
  .post("/app/addTodo", controller.verify, controller.addTodo)
  .post("/app/access", controller.verify, controller.access)
  .put("/app/updateTodo", controller.verify, controller.updateTodo)
  .put("/app/shareTodo", controller.verify, controller.shareTodo)
  .del("/app/:id", controller.verify, controller.del)
  .get("/app/listTodos", controller.verify, controller.listTodos)
  .get("/app/findOneUser", controller.verify, controller.findOneUserById)
  .get("/app/findAllUsers", controller.verify, controller.findAllUsers)
  .get("*", async (ctx, next) => {
    ctx.set("Content-Type", "text/html");
    ctx.body = fs.readFileSync(path.resolve(__dirname, "../../src/index.html"));
  });

export default router
