const puppeteer = require('puppeteer')
const NodeEnvironment = require('jest-environment-node')
const { visitPage } = require('./helpers')
const { receiveData } = require('./utils')

class TestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
  }

  async setup() {
    await super.setup()

    const data = receiveData()

    this.global.BASE_URL = data.BASE_URL || process.env.BASE_URL

    this.global.browser = await puppeteer.connect({
      browserWSEndpoint: data.wsEndpoint,
    })

    this.global.browser.visitPage = async (route = '') => {
      return visitPage(this.global.browser, this.global.BASE_URL + route)
    }
  }

  async teardown() {
    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = TestEnvironment
