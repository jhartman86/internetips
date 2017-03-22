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
  // unminified
  // _.merge({
  //   // target: 'web',
  //   output: {
  //     filename: 'bundled.js'
  //   }
  // }, defaults),

  // minified
  _.merge({
    // target: 'web',
    output: {
      library: 'internetips',
      libraryTarget: 'window',
      filename: 'bundled.min.js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin()
    ]
  }, defaults),

  // minified with inline source map
  // _.merge({
  //   output: {
  //     library: 'internetips',
  //     libraryTarget: 'window',
  //     filename: 'bundled.min.mapped.js'
  //   },
  //   devtool: 'eval-source-map',
  //   plugins: [
  //     new webpack.optimize.UglifyJsPlugin()
  //   ]
  // }, defaults)
];
