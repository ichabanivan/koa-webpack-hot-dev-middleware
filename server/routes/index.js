const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectID;

const db = require('../db/db');

const router = new Router();

router
  .post('/signUp', db.signup)
  .post('/signIn', db.signin)
  .get('/listTodos', db.listTodos)
  .post('/addTodo', db.addTodo)
  .put('/updateTodo', db.updateTodo)
  .del('/:id', db.del)
  .get("*", async (ctx, next) => {
    ctx.set('Content-Type', 'text/html');
    ctx.body = fs.readFileSync(path.resolve(__dirname, '../../src/index.html'));
  })

module.exports = router
