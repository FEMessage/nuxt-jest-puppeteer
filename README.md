# Nuxt Puppeteer Jest

*该组件基于Nuxt-Jest-Puppeteer进行改造, 进行了对Nuxt2兼容, 以及添加Puppeteer自定义配置特性.*

*This plugin was made while some error come up using Nuxt-Jest-Puppeteer within Nuxt2 proj, I made it compatible to Nuxt2, and made puppeteer custom configuration possible*
thanks for Studbits :)

[English Edition Doc](https://github.com/studbits/nuxt-jest-puppeteer)

# 安装

```bash
npm install nuxt-puppeteer-jest --save-dev

```

# 配置

可以添加以下配置到 `package.json`.

版本默认配置支持async/await语法, 不支持import, 如果想要自定义es6/7特性, 请添加babel6配置, 并安装相应依赖

```js
//babel选填
"babel": {  
  "presets": ["env"]
},
"scripts": {
  "test:e2e": "nuxt-puppeteer-jest",
},
"puppeteer": {
  //如Nuxt不是使用3000端口启动,填入该参数可以修改对Nuxt测试端口
  "BASE_URL": "http://localhost:3001", 

  //填入任意puppeteer创建browser的配置, 参考 https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
  //例如
  "headless": false
}

```

现在已经完成基础配置了, 你可以使用 `npm run test:e2e` 来跑起 nuxt 以及 你的jest与puppeteer测试环境.

# 使用方法

我们基于Jest的全局变量 [global variables](https://facebook.github.io/jest/docs/en/api.html), 
我们在Jest测试域暴露 puppeteer的 `browser` 对象以及Nuxt的 `BASE_URL` 来提供测试便利

例子:

```js
describe('Index page', () => {
    let page
    beforeAll(async () => {
      page = await browser.newPage()
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

该测试套件在`browser`对象上增加了一些方法, 方便测试Nuxt页面:
- `visitPage`,[Function] 把route作为参数传入该方法, 并返回一个puppeteer的 browser对象, 该对象添加了以下增强方法:
  - `html`, [Function] 返回一个promise, resolve后是页面的 outer HTML
  - `nuxt`, [Object] 包含以下helpers:
    - `navigate`, [Function] 传入一个路径, 跳转到另一个pages
    - `loadingData`, [Function] 取得一个对象, 包含当前正在加载的data($nuxt.$loading.$data)
    - `routeData`, [Function] 返回一个当前的Route data( $nuxt.$route.query &&$nuxt.$route.path)
    - `errorData`, [Function] 获得Nuxt error对象
    - `storeState`, [Function] 获得当前store状态对象

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

了解更多 Jest 的用法请到文档查看 [assertion API](https://facebook.github.io/jest/docs/en/expect.html)
和 puppeteer [browser API](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md).


### 高端用法

如果你喜欢自己跑 Nuxt, 你可以把enviroment变量`SELF_START`设置成true.

为了让Nuxt测试工具工作, 你必须设置 `BASE_URL` 

以下是一个例子, 如何自己跑 `nuxt-puppeteer-jest`:

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
### 协议

[MIT](./LICENSE)

Copyright (c) 2017 hibad
