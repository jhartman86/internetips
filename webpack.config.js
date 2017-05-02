const webpack = require('webpack');
const path = require('path');
const _ = require('lodash');
const defaults = {
  context: path.resolve('./lib'),
  resolve: {
    extensions: ['.js']
  },
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {presets:['es2015']}
        }]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    host: '0.0.0.0'
  }
};

module.exports = [
  // web (attached to window as 'internetips')
  _.merge({
    target: 'web',
    output: {
      library: 'internetips',
      libraryTarget: 'window',
      filename: 'bundled.js'
    }
  }, defaults),

  // web minified
  _.merge({
    target: 'web',
    output: {
      library: 'internetips',
      libraryTarget: 'window',
      filename: 'bundled.min.js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin()
    ]
  }, defaults)
];
