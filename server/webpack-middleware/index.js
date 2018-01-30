const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-client');

const webpack = require('webpack');
const webpackConfig = require('../../webpack.config');

function koaDevMiddleware(dev, compiler) {
  function waitMiddleware() {
    return new Promise((resolve, reject) => {
      dev.waitUntilValid(() => {
        resolve(true);
      });

      compiler.plugin('failed', (error) => {
        reject(error);
      });
    });
  }

  return (context, next) => Promise.all([
    waitMiddleware(),
    new Promise((resolve) => {
      dev(context.req, {
        end: (content) => {
          context.body = content;
          resolve();
        },
        setHeader: context.set.bind(context),
        locals: context.state
      }, () => resolve(next()));
    })
  ]);
}

module.exports = function middleware() {
  const compiler = webpack(webpackConfig);
  const options = {
    dev: {
      publicPath: compiler.options.output.publicPath
    },
    hot: {}
  };

  const client = webpackHotMiddleware(compiler, options.hot);
  const dev = webpackDevMiddleware(compiler, options.dev);

  return Object.assign(koaDevMiddleware(dev, compiler), {
    dev,
    client,
    close(callback) {
      dev.close(() => {
        client.close(callback);
      });
    }
  });
};