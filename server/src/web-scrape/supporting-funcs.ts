import { Page } from 'puppeteer'
import UA from 'user-agents'
import chai from 'chai'

chai.should()

export async function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export function removeResizing(str: string | null) {
  return { img: str!.slice(0, str!.indexOf('._')) + '.jpg', original: str }
}

export async function getData(page: Page) {
  let title: string | undefined,
    imageData: { img: string; original: string | null } | undefined,
    price: number | undefined,
    category: string | undefined,
    description: string[] | undefined

  {
    const [_, error] = await errHandler(async () => {
      await page.waitForSelector('#searchDropdownBox > option[selected]', {
        timeout: 10_000,
      })
      category = await page.$eval(
        '#searchDropdownBox > option[selected]',
        (el: any) => el.textContent!.trim()
      )
    })
    if (error) console.error(error)
  }

  {
    const [_, error] = await errHandler(async () => {
      await page.waitForSelector('#productTitle', { timeout: 10_000 })
      title = await page.$eval('#productTitle', (el: any) =>
        el.textContent!.trim()
      )
    })
    if (error) console.error(error)
  }

  {
    const [_, error] = await errHandler(async () => {
      const image = await page.$eval('#landingImage', (el) =>
        el.getAttribute('src')!.trim()
      )
      imageData = removeResizing(image as string)!
      if (error) console.error(error)
    })
  }

  {
    const [_, error] = await errHandler(async () => {
      price = parseFloat(
        await page.$eval('.a-price .a-offscreen', (el) =>
          el.textContent!.trim().slice(1)
        )
      )
      price.should.be.a('number')
      price.should.not.be.NaN
      if (error) console.error(error)
    })
  }

  {
    const [_, error] = await errHandler(async () => {
      description = await page.$$eval('#feature-bullets li span', (el) =>
        el.map((e) => e.textContent!.trim())
      )
      if (error) console.error(error)
    })
  }

  return { title, category, imageData, price, description }
}

async function clickImage(page: Page, item_num: number, url: string) {
  return retryHandler(
    async () => {
      await page.waitForSelector('img.s-image')
      const endIdx = await page.evaluate((idx: number) => {
        const elements = document.querySelectorAll('img.s-image')
        if (elements[idx]) {
          const element = elements[idx]
          const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
          })
          element.dispatchEvent(event)
        }
        return elements.length
      }, item_num)
      if (item_num >= endIdx!) return true
    },
    async () => {
      // console.error(e)
      // On error, go back to the previous page and try again
      await delay(5_000)
      await page.goto(url!, { timeout: 100_000 })
      await page.waitForSelector('img-s-image')
    },
    item_num
  )
}

export async function* visitSubLinks(
  page: Page,
  baseUrl: string,
  subLinks: string[]
) {
  let count = 0
  while (subLinks.length > 0) {
    // Navigate to the next URL in the subLink array
    const url = baseUrl.slice(0, baseUrl.indexOf('/s')) + subLinks.shift()
    console.log('page: ', count++)
    await page.goto(url!, { timeout: 100_000 })

    await delay(1000)
    let item_num = 0
    while (true) {
      try {
        // print item number
        console.log('item: ', item_num)

        await delay(4000)

        // click on the image link to go to the next page
        const [endOfPage, err] = await clickImage(page, item_num, url!)

        if (endOfPage === true) {
          // next page: $('a.s-pagination-button').click()
          await page.$eval('a.s-pagination-button', (el) => el.click())
        }
        if (err) console.error(err)

        await delay(5_000)
      } catch (e) {
        console.error(e)
      } finally {
        const data = await getData(page)
        yield data
        await delay(5_000)
      }
      await page.goto(url!, { timeout: 100_000 })
      item_num++
    }
  }
}

export async function getSubLinks(page: Page, baseUrl: string) {
  await page.setUserAgent(UA.toString())
  await page.evaluate(() => {
    window.onbeforeunload = null
  })

  await page.goto(baseUrl, { timeout: 100_000 })

  await page.waitForSelector('#nav-hamburger-menu', { timeout: 100_000 })
  await delay(2000)
  await page.hover('#nav-hamburger-menu')
  await delay(500)
  await page.click('#nav-hamburger-menu')
  await delay(5_000)
  await page.waitForSelector('a[href*="s?bbn"]', { timeout: 100_000 })
  return await page.$$eval(
    'a[href*="s?bbn"]',
    (links: Array<HTMLAnchorElement>) =>
      links.map((link) => link.getAttribute('href')).slice(0, 50)
  )
}

export async function errHandler(
  promiseFunction: (args: any[]) => Promise<any>,
  ...args: any[]
) {
  try {
    const data = await promiseFunction(args)
    return [data, null]
  } catch (e) {
    return [null, e]
  }
}

export async function retryHandler(
  action: (args: any[]) => Promise<any>,
  intermediateAction?: (args: any[]) => Promise<any>,
  ...args: any[]
) {
  try {
    const data = await action(args)
    return [data, null]
  } catch (e) {
    if (intermediateAction) await intermediateAction(args)
    try {
      const data = await action(args)
      return [data, null]
    } catch (e) {
      return [null, e]
    }
  }
}
