//cspell:disable
import puppeteer from 'puppeteer-extra'
import stealth from 'puppeteer-extra-plugin-stealth'
import { getSubLinks } from './supporting-funcs.js'
import fs from 'node:fs'
import { delay, visitSubLinks } from './supporting-funcs.js'
import chai from 'chai'

chai.should()

// Use Stealth plugin to avoid Captcha
puppeteer.default.use(stealth())

export async function scrape() {
  let browser: any
  let fileStream: fs.WriteStream | undefined

  // Adding 's' to the end of the url somehow avoids Captcha
  const baseUrl = 'https://www.amazon.com/s'

  try {
    browser = await puppeteer.default.launch({
      headless: 'new',
      // headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1920,1080',
      ],
      ignoreHTTPSErrors: true,
      executablePath: '/usr/bin/google-chrome-stable',
    })

    const page = await browser.newPage()

    // Get sublink from hamburger menu
    const subLinks = await getSubLinks(page, baseUrl)

    // wait
    delay(5000)

    // prints the number of sublinks
    console.log(subLinks.length)

    // Create a filestream to write data to a file
    fileStream = fs.createWriteStream('data.json')

    // Store data in an array
    fileStream.write('[\n')

    // Visits each sublink and scrapes data
    for await (const data of visitSubLinks(
      page,
      baseUrl,
      subLinks as string[]
    )) {
      // print data to console
      console.log(data)
      // write data to file
      fileStream.write(JSON.stringify(data) + ',\n')
    }
  } catch (err) {
    console.log('Operation failed', err)
  } finally {
    // Clean up
    fileStream?.write(']\n')
    fileStream?.end()
    await browser?.close()
  }
}

async function callScrape() {
  try {
    await scrape()
  } catch (error) {
    console.log(error)
    delay(10_000)
    await scrape()
  }
}

callScrape()
