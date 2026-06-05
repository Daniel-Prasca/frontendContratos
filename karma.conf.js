module.exports = function (config) {
  const cr = config.coverageReporter || {};

  // Extiende los reporters sin reemplazar el resto de la config de karma
  config.coverageReporter = {
    dir: cr.dir || require('path').join(__dirname, 'coverage'),
    reporters: [
      ...(cr.reporters || [{ type: 'html' }, { type: 'text-summary' }]),
      { type: 'lcovonly',  subdir: '.', file: 'lcov.info'       },
      { type: 'cobertura', subdir: '.', file: 'cobertura.xml'   }
    ]
  };
};
