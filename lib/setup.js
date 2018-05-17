const puppeteer = require('puppeteer')
const path = require('path')
const readPkg = require('read-pkg')
const { transferData } = require('./utils')

const PORT = 3000
const BASE_URL = `http://localhost:${PORT}`
const NODE_MODULES = path.sep + 'node_modules' + path.sep

const initNuxt = async () => {
  //fix new nuxt cannot use this test tools
  let Nuxt, Builder
  let nuxtLib
  try {
    nuxtLib = require('nuxt-edge')
  } catch(e) {
    nuxtLib = require("nuxt")
  }
  Nuxt = nuxtLib.Nuxt
  Builder = nuxtLib.Builder
  
  const cwd = process.cwd()
  const rootDir = cwd.substring(0, cwd.indexOf(NODE_MODULES))
  let config = {}
  try { config = require(path.resolve(rootDir, 'nuxt.config.js')) } catch (e) {
    throw Error('Couldn\'t find nuxt.js config')
  }
  config.rootDir = rootDir
  if (config.build && config.build.analyze) {
    delete config.build.analyze;
  }
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
  //外置puppeteer配置
  let config = {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
  if(global.__PKG__.puppeteer){
    config = global.__PKG__.puppeteer.args? 
                global.__PKG__.puppeteer: 
                Object.assign({}, global.__PKG__.puppeteer, config);
  }

  const browser = await puppeteer.launch(config)
  global.__BROWSER__ = browser

  transferData({
    BASE_URL: process.env.SELF_START ? null : BASE_URL,
    wsEndpoint: browser.wsEndpoint()
  })
}
