//cspell:disable
import puppeteer  from 'puppeteer-extra'
import stealth from 'puppeteer-extra-plugin-stealth'
import { getSubLinks } from './supporting-funcs.js'
import fs from 'node:fs'
import { delay, visitSubLinks } from './supporting-funcs.js'
import chai from 'chai'

chai.should()

puppeteer.default.use(stealth())

export async function scrape() {
	let browser: any
	let fileStream: fs.WriteStream | undefined
	const baseUrl = 'https://www.amazon.com/s'

	try {
		browser = await puppeteer.default.launch({
			headless: 'new',
			// headless: false,
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				// '--window-size=1366,768',
				'--window-size=1920,1080',
			],
			ignoreHTTPSErrors: true,
			executablePath: '/usr/bin/google-chrome-stable',
		})

		const page = await browser.newPage()
		const subLinks = await getSubLinks(page, baseUrl)
		delay(5000)

		console.log(subLinks.length)

		// Create a filestream to write data to a file
		fileStream = fs.createWriteStream('data.json')

		fileStream.write('[\n')

		// Visits each sublink and scrapes data
		for await (const data of visitSubLinks(
			page,
			baseUrl,
			subLinks as string[]
		)) {
			console.log(data)
			fileStream.write(JSON.stringify(data) + ',\n')
		}
	} catch (err) {
		console.log('Operation failed', err)
	} finally {
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
