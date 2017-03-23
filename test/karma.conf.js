// var webpack = require('webpack');
// -- Good resources:
// https://github.com/orizens/echoes/blob/master/karma.conf.js
// http://orizens.com/wp/topics/first-steps-in-setting-up-travis-ci-to-your-javascript-project/
// https://survivejs.com/webpack/techniques/testing/
// https://www.codementor.io/reactjs/tutorial/test-reactjs-components-karma-webpack
// https://x-team.com/blog/setting-up-javascript-testing-tools-for-es6/
// https://medium.com/@scbarrus/how-to-get-test-coverage-on-react-with-karma-babel-and-webpack-c9273d805063#.l96qr7dym

module.exports = function (config) {

  var _browsers = ['Chrome', 'Firefox'];

  if (process.env.TRAVIS) {
    _browsers = ['Chrome_travis_ci'];
  }

  config.set({

    browserNoActivityTimeout: 10000,

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    client: {
      captureConsole: true,
      mocha: {
        reporter: 'html',
        ui: 'bdd'
      }
    },

    // https://github.com/karma-runner/karma-mocha/issues/47
    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    },

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      'tests.webpack.js',
      '../dist/style.css'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'tests.webpack.js': ['webpack'],
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      type: 'text-summary'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome', 'Firefox', 'PhantomJS', 'IE'],
    // browsers: ['Chrome', 'Firefox'],
    browsers: _browsers,

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    webpack: {
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: [/node_modules/],
            use: [{
              loader: 'babel-loader',
              options: {presets:['es2015']}
            }]
          },
          {
            test: /\.js$/,
            exclude: [/(test|node_modules)/],
            enforce: 'post',
            use: [{
              loader: 'istanbul-instrumenter-loader'
            }]
          }
        ]
      }
    },

    webpackServer: {
      noInfo: true
    },

    plugins: [
      require('karma-webpack'),
      require('istanbul-instrumenter-loader'),
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-coverage'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher')
    ]
  });
};
