import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-client';

import webpack from 'webpack';
import webpackConfig from '../../webpack.config';

function koaDevMiddleware(devMiddleware, compiler) {
  return (ctx, next) => Promise.all([
    new Promise((resolve, reject) => {
      // waitUntilValid - Executes a callback function when the compiler bundle is valid
      devMiddleware.waitUntilValid(() => {
        resolve(true);
      });

      compiler.plugin('failed', (error) => {
        reject(error);
      });
    }),
    new Promise((resolve) => {
      devMiddleware(ctx.req, {
        end: (content) => {
          ctx.body = content; // buffer - bundle.js 
          resolve();
        },
        setHeader: ctx.set.bind(ctx)
      }, () => resolve(next()));
    })
  ])
}

export default function middleware() {
  const compiler = webpack(webpackConfig);
  const hotMiddleware = webpackHotMiddleware(compiler, {});
  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: compiler.options.output.publicPath
  });

  return Object.assign(koaDevMiddleware(devMiddleware, compiler), {
    devMiddleware,
    hotMiddleware,
    close(callback) {
      devMiddleware.close(() => {
        hotMiddleware.close(callback);
      })
    }
  })
}
