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

const PORT = process.env.PORT || 3000;

app.use(middleware())
app.use(koaBody())

routes(app);

app.use(async function pageNotFound(ctx) {
  // we need to explicitly set 404 here
  // so that koa doesn't assign 200 on body=
  ctx.status = 404;

  switch (ctx.accepts('html', 'json')) {
    case 'html':
      ctx.type = 'html';
      ctx.body = '<p>Page Not Found</p>';
      break;
    case 'json':
      ctx.body = {
        message: 'Page Not Found'
      };
      break;
    default:
      ctx.type = 'text';
      ctx.body = 'Page Not Found';
  }
});

if (require.main === module) {
  app.listen(PORT, function() {
    console.log(`Listening on ${PORT}`);
  });
}
