import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-client';

import webpack from 'webpack';
import webpackConfig from '../../webpack.config';

function koaDevMiddleware(devMiddleware, compiler) {
  return (ctx, next) => Promise.all([
    new Promise((resolve, reject) => {
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
          ctx.body = content;
          resolve();
        },
        setHeader: ctx.set.bind(ctx),
        locals: ctx.state
      }, () => resolve(next()));
    })
  ]);
}

export default function middleware() {
  const compiler = webpack(webpackConfig);
  const options = {
    dev: {
      publicPath: compiler.options.output.publicPath
    },
    hot: {}
  };

  const hotMiddleware = webpackHotMiddleware(compiler, options.hot);
  const devMiddleware = webpackDevMiddleware(compiler, options.dev);

  return Object.assign(koaDevMiddleware(devMiddleware, compiler), {
    devMiddleware,
    hotMiddleware,
    close(callback) {
      devMiddleware.close(() => {
        hotMiddleware.close(callback);
      });
    }
  });
};