const Koa = require('koa');
const koaBody = require('koa-body');
const fs = require('fs');
const Router = require('koa-router');
const path = require('path');

const middleware = require('./webpack-middleware/');
const mongo = require('./db/mongo')
const router = require('./routes/');

const app = new Koa();

const PORT = process.env.PORT || 3000;

app.use(mongo(app))
app.use(middleware())
app.use(koaBody())
app.use(router.routes())

app.listen(PORT, function() {
  console.log(`Listening on ${PORT}`);
});
