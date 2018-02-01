import fs from 'fs';
import path from 'path';
import Router from 'koa-router';

import routes from './routes';

const router = new Router();

router
  .post('/signUp', routes.signup)
  .post('/signIn', routes.signin)
  .post('/addTodo', routes.verify, routes.addTodo)
  .put('/updateTodo', routes.verify, routes.updateTodo)
  .del('/:id', routes.verify, routes.del)
  .get('/listTodos', routes.verify, routes.listTodos)
  .get("*", async (ctx, next) => {
    ctx.set('Content-Type', 'text/html');
    ctx.body = fs.readFileSync(path.resolve(__dirname, '../../src/index.html'));
  })

module.exports = router
