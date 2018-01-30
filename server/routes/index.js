const Router = require('koa-router');
const fs = require('fs');
const path = require('path');

const db = require('../db/db');

function routes(app) {
  var router = new Router();

  router
    .get("/", async (ctx, next) => {
      ctx.set('Content-Type', 'text/html');
      ctx.body = fs.readFileSync(path.resolve(__dirname, '../../src/index.html'));
    })
    .get('/listTodos', db.listTodos)
    .post('/addTodo', db.addTodo)
    .put('/updateTodo', db.updateTodo)
    .del('/:id', db.del)

  app.use(router.routes());
}

module.exports = routes
