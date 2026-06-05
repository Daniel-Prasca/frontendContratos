/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  testRunner: 'karma',
  karma: {
    projectType: 'angular-cli',
    config: {
      browsers: ['ChromeHeadlessNoSandbox'],
      reporters: ['progress'],
      customLaunchers: {
        ChromeHeadlessNoSandbox: {
          base: 'ChromeHeadless',
          flags: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage'],
        },
      },
    },
  },
  checkers: ['typescript'],
  tsconfigFile: 'tsconfig.spec.json',
  mutate: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.routes.ts',
    '!src/main.ts',
    '!src/app/app.config.ts',
    '!src/environments/**',
    '!src/app/core/interfaces/**',
  ],
  reporters: ['html', 'clear-text', 'progress'],
  htmlReporter: {
    fileName: 'reports/mutation/mutation.html',
  },
  thresholds: {
    high: 70,
    low: 50,
    break: null,
  },
  coverageAnalysis: 'off',
  timeoutMS: 10000,
  concurrency: 1,
  logLevel: 'info',
  tempDirName: 'stryker-tmp',
  cleanTempDir: true,
};

export default config;
