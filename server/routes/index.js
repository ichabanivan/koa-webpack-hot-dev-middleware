import fs from 'fs';
import path from 'path';
import Router from 'koa-router';

import routes from './routes';

const router = new Router();

router
  .post('/signUp', routes.signup)
  .post('/signIn', routes.signin)
  .post('/app/addTodo', routes.verify, routes.addTodo)
  .put('/app/updateTodo', routes.verify, routes.updateTodo)
  .del('/app/:id', routes.verify, routes.del)
  .get('/app/listTodos', routes.verify, routes.listTodos)
  .get("*", async (ctx, next) => {
    ctx.set('Content-Type', 'text/html');
    ctx.body = fs.readFileSync(path.resolve(__dirname, '../../src/index.html'));
  })

export default router
