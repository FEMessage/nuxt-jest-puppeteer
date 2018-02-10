# Nuxt Jest Puppeteer

*This plugin was made with love with the team at [studbits.com](https://studbits.com/).*

# Installation

```bash
npm install nuxt-jest-puppeteer --save-dev

```

# Setup

Add the following script to your `package.json`.

```json
"scripts": {
  "test": "nuxt-jest-puppeteer",
}

```

That's it, now you all you need to do is run `npm run test` to start
nuxt and have your complete testing environment setup with jest and puppeteer.


# Usage

Along with Jest's [global variables](https://facebook.github.io/jest/docs/en/api.html), we expose puppeteer's `browser` object and nuxt's `BASE_URL` to facilitate testing.

Example usage:

```js
describe('Index page', () => {
    let page
    beforeAll(async () => {
      const page = await browser.newPage()
      await page.goto(BASE_URL)
    })
    afterAll(async () => {
      await page.close()
    })

    it('renders index page', async () => {
      const el = await page.$('.index-page')
      expect(el).toBeTruthy()
    })
  })
```

We also add extra methods to the browser object to make it easy to test Nuxt pages:

- `visitPage`, a Function, receives the route as a paramter and returns puppeteer's designated browser [page object](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-page), powered up with the following nuxt-related methods:
  - `html`, a Function, returns a promise that resolves to the page's outer HTML.
  - `nuxt`, Object with the following helpers:
    - `navigate`, a Function, accepts a path so that you can change pages.
    - `loadingData`, a Function, that resolves to an object with the current Loading data.
    - `routeData`, a Function, that resolves to an object with the current Route data.
    - `errorData`, a Function, that resolves to an object containing any Nuxt errors.
    - `storeState`, a Function, that resolves to an object with the current Store state.

Example usage:

```js
describe('Index page', () => {
    let page
    beforeAll(async () => {
      page = await browser.visitPage('/home')
    })
    afterAll(async () => {
      await page.close()
    })

    it('renders index page', async () => {
      const elStr = await page.html()
      expect(elStr).toBeTruthy()
    })
  })
```

For a complete look at testing, see Jest's [assertion API](https://facebook.github.io/jest/docs/en/expect.html)
and puppeteer's [browser API](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md).

### Advanced Usage

If you'd like to run Nuxt yourself, set the environment variable `SELF_START` to true.

In order for Nuxt test helpers to still work, you must set the `BASE_URL` as well.

Here's an example of how to run `nuxt-jest-puppeteer` programmatically:

```js
const runTest = require('nuxt-jest-puppeteer')

process.env.SELF_START = true
process.env.BASE_URL = `http:localhost:3000`

Promise.all([runNuxtClient(), runAdonisApi()])
  .then(([client, api]) => {
    let runner
    try {
      runner = runTest()
    } finally {
      Promise.resolve(runner)
        .then(() => {
          client.close()
          api.close()
        })
        .catch(() => process.exit())
    }
  })
```
### License

[MIT](./LICENSE)

Copyright (c) 2017 Studbits
