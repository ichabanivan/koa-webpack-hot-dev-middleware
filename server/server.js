const Koa = require('koa');
const koaBody = require('koa-body');
const fs = require('fs');
const Router = require('koa-router');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config')

const middleware = require('./webpack-middleware/');
const router = require('./routes/');

const app = new Koa();

const PORT = process.env.PORT || 3000;

MongoClient.connect(config.url, function (err, db) {
  app.database = db.db('todos')
})

app.use(middleware())
app.use(koaBody())
app.use(router.routes())

app.listen(PORT, function() {
  console.log(`Listening on ${PORT}`);
});
