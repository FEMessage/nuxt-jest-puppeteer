const path = require('path')

module.exports = {
  verbose: true,
  'moduleFileExtensions': [
    'json',
    'js',
    'vue'
  ],
  'transform': {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  'globalSetup': path.join(__dirname, 'setup.js'),
  'globalTeardown': path.join(__dirname, 'teardown.js'),
  'testEnvironment': path.join(__dirname, 'environment.js')
}
