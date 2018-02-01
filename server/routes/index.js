import fs from 'fs';
import path from 'path';
import Router from 'koa-router';

import routes from './routes';

const router = new Router();

router
  .post('/signUp', routes.signup)
  .post('/signIn', routes.signin)
  .post('/addTodo', routes.addTodo)
  .put('/updateTodo', routes.updateTodo)
  .del('/:id', routes.del)
  .get('/listTodos', routes.listTodos)
  .get("*", async (ctx, next) => {
    ctx.set('Content-Type', 'text/html');
    ctx.body = fs.readFileSync(path.resolve(__dirname, '../../src/index.html'));
  })

module.exports = router
