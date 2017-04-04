// var webpack = require('webpack');
// -- Good resources:
// https://github.com/orizens/echoes/blob/master/karma.conf.js
// http://orizens.com/wp/topics/first-steps-in-setting-up-travis-ci-to-your-javascript-project/
// https://survivejs.com/webpack/techniques/testing/
// https://www.codementor.io/reactjs/tutorial/test-reactjs-components-karma-webpack
// https://x-team.com/blog/setting-up-javascript-testing-tools-for-es6/
// https://medium.com/@scbarrus/how-to-get-test-coverage-on-react-with-karma-babel-and-webpack-c9273d805063#.l96qr7dym

// if BS_USERNAME or BS_ACCESS_KEY env variables aren't set, look locally
if (!process.env.BS_USERNAME || !process.env.BS_ACCESS_KEY) {
  const bsCredentials = require('../.browserstack.json');
  process.env.BS_USERNAME = bsCredentials.username;
  process.env.BS_ACCESS_KEY = bsCredentials.accessKey;
}

module.exports = function (config) {

  var _browsers = [
    'Chrome',
    'Firefox',
    'BS_IE_10',
    'BS_IE_11',
    'BS_Edge'
  ];

  if (process.env.TRAVIS) {
    _browsers = [
      'Chrome_travis_ci',
      'Firefox',
      'BS_IE_10',
      'BS_IE_11',
      'BS_Edge'
    ];
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

    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage', 'BrowserStack'],

    // BrowserStack configuration (for IE testing)
    browserStack: {
      name: 'internetips',
      username: process.env.BS_USERNAME,
      accessKey: process.env.BS_ACCESS_KEY
    },
    captureTimeout: 20000,

    coverageReporter: {
      type: 'text-summary'
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: process.env.TRAVIS ? config.LOG_DEBUG : config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: _browsers,

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      },
      BS_IE_10: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '10',
        os: 'Windows',
        os_version: '7'
      },
      BS_IE_11: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '11',
        os: 'Windows',
        os_version: '7'
      },
      BS_Edge: {
        base: 'BrowserStack',
        browser: 'edge',
        browser_version: '14',
        os: 'Windows',
        os_version: '10'
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // webpack configs
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
    }
  });
};
