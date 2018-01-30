const Koa = require('koa');
const koaBody = require('koa-body');
const fs = require('fs');
const Router = require('koa-router');
const path = require('path');

const middleware = require('./webpack-middleware/');
const db = require('./db/mongo')
const routes = require('./routes/');

const app = new Koa();
db(app);

const PORT = process.env.PORT || 1616;

app.use(middleware())
app.use(koaBody())

routes(app);


if (require.main === module) {
  app.listen(PORT, function() {
    console.log(`Listening on ${PORT}`);
  });
}
