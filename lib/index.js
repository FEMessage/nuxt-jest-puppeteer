const jest = require('jest')
const baseConfig = require('./config')

module.exports = function runTest (opts = {}) {
  const { config } = opts

  let argv = ['--config', JSON.stringify({ ...baseConfig, ...config })]

  if (opts.argv) argv = argv.concat(opts.argv)

  return jest.run(argv)
}
