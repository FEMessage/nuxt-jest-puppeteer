const puppeteer = require('puppeteer')
const NodeEnvironment = require('jest-environment-node')
const { receiveData } = require('./utils')

class TestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
  }

  async setup() {
    await super.setup()

    const data = receiveData()

    this.global.BASE_URL = data.BASE_URL
    this.global.browser = await puppeteer.connect({
      browserWSEndpoint: data.wsEndpoint,
    })

    this.global.browser.visitPage = async (route = '') => {
      const page = await this.global.browser.newPage()
      await page.goto(this.global.BASE_URL + route)
      return page
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
