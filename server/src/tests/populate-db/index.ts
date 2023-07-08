// cspell:disable
import _package from 'stream-json'
const { parser } = _package
import pkg from 'stream-json/streamers/StreamArray.js'
const { streamArray } = pkg
import db from '../../db/pg/index.js'
import fs from 'node:fs'
import { removeResizing } from '../../web-scrape/supporting-funcs.js'
import { assert } from 'chai'

async function populateDB() {
	const jsonStream = fs
		.createReadStream('server/src/data-bckup1.json')
		.pipe(parser())
		.pipe(streamArray())

	try {
		await db.query({
			text: `DELETE FROM user_accounts where 
	email=$1`,
			values: ['populatingdb@gmail.com'],
		})
	} catch (e) {
		throw new Error(e.message)
	}

	let userId: number
	try {
		userId = (
			await db.query({
				text: `INSERT INTO user_accounts (
			first_name,
			last_name,
			email,
			password,
			dob,
			country
			) values ($1, $2, $3, $4, $5, $6) RETURNING user_id`,
				values: [
					'Test',
					'Vendor',
					'populatingdb@gmail.com',
					'password',
					'1990-01-01',
					'Nigeria',
				],
			})
		).rows[0].user_id
	} catch (e) {
		throw new Error(e.message)
	}

	let vendorId: number
	try {
		vendorId = (
			await db.query({
				text: `INSERT INTO vendors values ($1) RETURNING vendor_id`,
				values: [userId],
			})
		).rows[0].vendor_id
	} catch (e) {
		throw new Error(e.message)
	}

	let storeId: number
	try {
		storeId = (
			await db.query({
				text: `INSERT INTO stores (store_name, vendor_id) values ($1, $2) RETURNING store_id`,
				values: ['Test Store', vendorId],
			})
		).rows[0].store_id
	} catch (e) {
		throw new Error(e.message)
	}
	let title: string, description: string, price: number, image: string

	for await ({
		value: { title, description, price, image },
	} of jsonStream) {
		let productId: number = 0
		try {
			if (title && description) {
				const upper = 10_000
				const lower = 500_000
				let priceVal = Number(price ?? Math.random() * (upper - lower) + lower)
				priceVal = priceVal
				priceVal *= 750 // Converts USD to Naira
				assert(!isNaN(priceVal))
				productId = (
					await db.query({
						text: `INSERT INTO products (store_id, title, vendor_id, description, net_price, list_price, quantity_available) values ($1, $2, $3, $4, $5, $6, $7) RETURNING product_id`,
						values: [
							storeId,
							title,
							vendorId,
							JSON.stringify(description),
							priceVal,
							priceVal + Math.random() * 1001,
							Math.floor(Math.random() * 51),
						],
					})
				).rows[0].product_id
			}
		} catch (e) {
			throw new Error(e.message)
		}

		try {
			if (productId && image) {
				const imgUrl = removeResizing(image)
				const basename = imgUrl.slice(imgUrl.lastIndexOf('/'))
				const filename =
					basename.slice(1, basename.indexOf('.')) + Math.random() * 1e7
				await db.query({
					text: `INSERT INTO product_media (product_id, filename, filepath) values ($1, $2, $3)`,
					values: [productId, filename, imgUrl],
				})
				await db.query({
					text: `INSERT INTO product_display_image values ($1)`,
					values: [filename],
				})
			}
		} catch (e) {
			throw new Error(e.message)
		}
	}
}

populateDB()
