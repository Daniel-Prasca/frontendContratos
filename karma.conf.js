const path = require('path');

module.exports = function (config) {
  config.set({
    coverageReporter: {
      dir: path.join(__dirname, 'coverage'),
      reporters: [
        { type: 'html',      subdir: 'html' },
        { type: 'lcovonly',  subdir: '.', file: 'lcov.info' },
        { type: 'cobertura', subdir: '.', file: 'cobertura-coverage.xml' },
        { type: 'text-summary' }
      ]
    }
  });
};
