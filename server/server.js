import Koa from 'koa'
import koaBody from 'koa-body';
import fs from 'fs';
import Router from 'koa-router';
import path from 'path';

import middleware from './webpack-middleware/';
import router from './routes/';

const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(middleware())
app.use(koaBody())
app.use(router.routes())

app.listen(PORT, function() {
  console.log(`Listening on ${PORT}`);
});
