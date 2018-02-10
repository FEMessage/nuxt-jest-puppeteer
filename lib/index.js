const jest = require('jest')
const baseConfig = require('./config')

module.exports = function runTest (opts = {}) {
  const { root, extraArgv, config } = opts

  let argv = ['--config', JSON.stringify({ ...baseConfig, ...config })]

  if (extraArgv) argv = argv.concat(extraArgv)

  return jest.run(argv, root)
}
