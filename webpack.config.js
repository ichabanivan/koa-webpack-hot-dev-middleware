const webpack = require('webpack');
const path = require('path');

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
