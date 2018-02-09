const puppeteer = require('puppeteer')
const { removeTempDir } = require('./utils')

module.exports = async function() {
  await global.__NUXT__.close()
  await global.__BROWSER__.close()

  removeTempDir()
}
