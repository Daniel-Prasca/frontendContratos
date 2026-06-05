const path = require('path');

// When Angular's @angular/build:karma sees a karmaConfig option, it does NOT inject
// its built-in frameworks/plugins (getBaseKarmaOptions returns {} instead of
// getBuiltInKarmaConfig). We must replicate that built-in config here and add
// the extra coverage reporters we need for Azure DevOps.
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
    ],
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageReporter: {
      dir: path.join(__dirname, 'coverage', 'frontend-contratos'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly',  file: 'lcov.info'      },
        { type: 'cobertura', file: 'cobertura.xml'  },
      ],
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage'],
      },
    },
    restartOnFileChange: true,
  });
};
