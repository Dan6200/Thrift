//cspell:disable
import { Browser } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import stealth from 'puppeteer-extra-plugin-stealth'
import randomUA from 'random-useragent'
import UA from 'user-agents'
import db from './db/pg/index.js'
import fs from 'node:fs/promises'
const data: { title: string; image: string; price: string }[] = []

puppeteer.default.use(stealth())
export async function scrape() {
	let browser: Browser | undefined
	try {
		browser = await puppeteer.default.launch({
			headless: false,
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--window-size=1920,1080',
			],
			ignoreHTTPSErrors: true,
			executablePath:
				'/home/darealestniqqa/chrome/linux-114.0.5735.133/chrome-linux64/chrome',
		})
		const page = await browser.newPage()
		// await page.setUserAgent(randomUA.getRandom())
		await page.setUserAgent(UA.toString())
		await page.evaluate(() => {
			window.onbeforeunload = null
		})
		// 'https://www.amazon.com/s?bbn=16225009011&rh=i%3Aspecialty-aps%2Cn%3A%2116221009011%2Cn%3A281407&ref_=nav_em__nav_desktop_sa_intl_accessories_and_supplies_0_2_5_2',
		const baselink = 'https://www.amazon.com/'
		await page.goto(baselink, { timeout: 100_000 })

		await page.waitForSelector('#nav-hamburger-menu', { timeout: 100_000 })
		delay(2000)
		await page.hover('#nav-hamburger-menu')
		delay(500)
		await page.click('#nav-hamburger-menu')
		const nextLink = await page.$$eval('a[href*="s?bbn"]', links =>
			links.map(link => link.getAttribute('href'))
		)
		delay(2000)

		while (nextLink.length > 0) {
			// Navigate to the next URL in the nextLink array
			const url = nextLink.shift()

			await page.goto(url!, { timeout: 100_000 })

			// Wait for the #hmenu-content element to be visible
			// Extract data from the #hmenu-content element
			await delay(1000)
			let i = 0
			while (true) {
				try {
					console.log('cycle', i)
					await delay(4000)
					await page.waitForSelector('img.s-image')
					const link = await page.$$('img.s-image')
					if (i >= link.length) break
					link[i].click()
					await page.waitForSelector('#productTitle', { timeout: 100_000 })
					await delay(20000)
					const title = await page.$eval('#productTitle', el => el.textContent)
					const image = await page.$eval('#landingImage', el =>
						el.getAttribute('src')
					)
					const price = await page.$eval(
						'.a-price .a-offscreen',
						el => el.textContent
					)
					data.push({
						title: title!.trim(),
						image: image!.trim(),
						price: price!.trim(),
					})
					console.log(data)
					await page.goto(url!, { timeout: 100_000 })
				} catch (error) {
					console.log(error)
				}
				i++
			}
		}
	} catch (err) {
		console.log('Operation failed', err)
	} finally {
		await browser?.close()
		await fs.writeFile('data.json', JSON.stringify(data))
	}
}

try {
	scrape()
} catch (error) {
	console.log(error)
	delay(10_000)
	scrape()
}

async function delay(time: number) {
	return new Promise(resolve => setTimeout(resolve, time))
}
