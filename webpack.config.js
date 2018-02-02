const webpack = require('webpack');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  context: __dirname,
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    path.resolve(__dirname, './src/index.js')
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  devtool: '#source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(css)/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
    ],
    
  },
  devServer: {
    hot: true
  },
};
