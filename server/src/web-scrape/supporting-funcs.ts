import { Page } from 'puppeteer'
import UA from 'user-agents'
import chai from 'chai'

chai.should()

export async function delay(time: number) {
	return new Promise(resolve => setTimeout(resolve, time))
}

export function removeResizing(str: string | null) {
	return str!.slice(0, str!.indexOf('._')) + '.jpg'
}

export async function getData(page: Page) {
	let title: string | undefined,
		image: string | undefined,
		price: number | undefined,
		description: string[] | undefined

	try {
		await page.waitForSelector('#productTitle')
		title = await page.$eval('#productTitle', el => el.textContent!.trim())
	} catch (e) {
		console.error(e)
	}

	try {
		image = await page.$eval('#landingImage', el =>
			el.getAttribute('src')!.trim()
		)
		image = removeResizing(image)
		console.log(image)
	} catch (e) {
		console.error(e)
	}

	try {
		price = parseFloat(
			await page.$eval('.a-price .a-offscreen', el =>
				el.textContent!.trim().slice(1)
			)
		)
		price.should.be.a('number')
		price.should.not.be.NaN
	} catch (e) {
		console.error(e)
	}

	try {
		description = await page.$$eval('#feature-bullets li span', el =>
			el.map(e => e.textContent!.trim())
		)
	} catch (e) {
		console.error(e)
	}

	return { title, image, price, description }
}

async function clickImage(page: Page, i: number, url: string) {
	try {
		await page.waitForSelector('img.s-image')
		const endIdx = await page.evaluate(idx => {
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
		}, i)
		if (i >= endIdx!) return false
	} catch (e) {
		console.error(e)
		await delay(5_000)
		await page.goto(url!, { timeout: 100_000 })
		await page.waitForSelector('img-s-image')

		const endIdx = await page.evaluate(idx => {
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
		}, i)
		if (i >= endIdx!) return true
	}
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
		let i = 0
		while (true) {
			try {
				console.log('item: ', i)
				await delay(4000)
				const endLoop = await clickImage(page, i, url!)
				if (endLoop === false) break
				await delay(5_000)
			} catch (e) {
				console.error(e)
			} finally {
				const data = await getData(page)
				yield data
				await delay(5_000)
			}
			await page.goto(url!, { timeout: 100_000 })
			i++
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
	return await page.$$eval('a[href*="s?bbn"]', links =>
		links.map(link => link.getAttribute('href')).slice(0, 50)
	)
}
