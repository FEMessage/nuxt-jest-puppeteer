const puppeteer = require('puppeteer')
const path = require('path')
const { transferData } = require('./utils')

const PORT = 3000
const BASE_URL = `http://localhost:${PORT}`
const NODE_MODULES = path.sep + 'node_modules' + path.sep

const initNuxt = async () => {
  const { Nuxt, Builder } = require('nuxt')
  const cwd = process.cwd()
  const rootDir = cwd.substring(0, cwd.indexOf(NODE_MODULES))
  let config = {}
  try { config = require(path.resolve(rootDir, 'nuxt.config.js')) } catch (e) {
    throw Error('Couldn\'t find nuxt.js config')
  }
  config.rootDir = rootDir
  config.dev = false
  const nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  nuxt.listen(PORT, 'localhost')
  return nuxt
}

module.exports = async function() {
  if (!process.env.SELF_START) {
    const nuxt = await initNuxt()
    global.__NUXT__ = nuxt
  }

  const browser = await puppeteer.launch({
   args: ['--no-sandbox', '--disable-setuid-sandbox']
 })
  global.__BROWSER__ = browser

  transferData({
    BASE_URL: process.env.SELF_START ? null : BASE_URL,
    wsEndpoint: browser.wsEndpoint()
  })
}
