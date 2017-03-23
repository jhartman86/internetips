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
  }
};

module.exports = [
  // node require-able
  // _.merge({}, defaults, {
  //   target: 'node',
  //   output: {
  //     library: 'internetips',
  //     libraryTarget: 'commonjs2',
  //     path: path.resolve(__dirname, 'dist/node'),
  //     filename: 'index.js'
  //   }
  // }),

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
