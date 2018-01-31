const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectID;

const db = require('../db/db');

function routes(app) {
  const router = new Router();

  router
    .post('/signup', db.signup)
    .get('/listTodos', db.listTodos)
    .post('/addTodo', db.addTodo)
    .put('/updateTodo', db.updateTodo)
    .del('/:id', db.del)
    .get("*", async (ctx, next) => {
      ctx.set('Content-Type', 'text/html');
      ctx.body = fs.readFileSync(path.resolve(__dirname, '../../src/index.html'));
    })

  app.use(router.routes());
}

module.exports = routes
