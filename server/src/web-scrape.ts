//cspell:disable
import { Browser } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import stealth from 'puppeteer-extra-plugin-stealth'
// import randomUA from 'random-useragent'
import UA from 'user-agents'
// import db from './db/pg/index.js'
import fs from 'node:fs/promises'
const data: { title?: string; image?: string; price?: string }[] = []

puppeteer.default.use(stealth())

export async function scrape() {
	let browser: Browser | undefined
	try {
		browser = await puppeteer.default.launch({
			// headless: 'new',
			headless: false,
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--window-size=1340,780',
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

		// <a href='https://www.amazon.com/s?bbn=16225009011&rh=i%3Aspecialty-aps%2Cn%3A%2116221009011%2Cn%3A281407&ref_=nav_em__nav_desktop_sa_intl_accessories_and_supplies_0_2_5_2'>Link</a>

		const baseUrl = 'https://www.amazon.com/s'
		await page.goto(baseUrl, { timeout: 100_000 })

		await page.waitForSelector('#nav-hamburger-menu', { timeout: 100_000 })
		await delay(2000)
		await page.hover('#nav-hamburger-menu')
		await delay(500)
		await page.click('#nav-hamburger-menu')
		await delay(5_000)
		await page.waitForSelector('a[href*="s?bbn"]', { timeout: 100_000 })
		const subLink = await page.$$eval('a[href*="s?bbn"]', links =>
			links.map(link => link.getAttribute('href')).slice(0, 50)
		)
		await delay(5_000)

		console.log(subLink.length)
		while (subLink.length > 0) {
			// Navigate to the next URL in the subLink array
			const url = baseUrl.slice(0, baseUrl.indexOf('/s')) + subLink.shift()
			console.log(url)
			await page.goto(url!, { timeout: 100_000 })

			// Wait for the #hmenu-content element to be visible
			// Extract data from the #hmenu-content element
			await delay(1000)
			let i = 0
			while (true) {
				let obj: { title?: string; image?: string; price?: string } = {}
				try {
					console.log('cycle', i)
					await delay(4000)
					await page.waitForSelector('img.s-image')
					const link = await page.$$('img.s-image')
					if (i >= link.length) break
					await link[i].click()
					try {
						await page.waitForSelector('#productTitle')

						// await page.evaluate(() => {
						// 	const elements = document.querySelectorAll('#my-element')
						// 	if (elements.length >= i+1) {
						// 		const element = elements[3]
						// 		const event = new MouseEvent('click', {
						// 			view: window,
						// 			bubbles: true,
						// 			cancelable: true,
						// 		})
						// 		element.dispatchEvent(event)
						// 	}
						// })
					} catch (e) {
						console.error(e)
						await delay(5_000)
						await page.goto(url!, { timeout: 100_000 })
						await page.waitForSelector('img-s-image')
						const retryLink = await page.$$('img.s-image')
						if (i >= retryLink.length) break
						await retryLink[i].click()
						await page.waitForSelector('#productTitle')
					}
					await delay(5_000)
					try {
						const title = await page.$eval(
							'#productTitle',
							el => el.textContent
						)
						obj.title = title!.trim()
						const image = await page.$eval('#landingImage', el =>
							el.getAttribute('src')
						)
						obj.image = image!.slice(0, image!.indexOf('SX')) + '_.jpg'
						const price = await page.$eval(
							'.a-price .a-offscreen',
							el => el.textContent
						)
						obj.price = price!.trim()
					} catch (e) {
						console.error(e) // My code fails after getting here
					} finally {
						data.push(obj)
						await fs.writeFile('data.json', JSON.stringify(data))
						await delay(5_000)
					}
					console.log(data.length)
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
