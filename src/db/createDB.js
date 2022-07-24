require('dotenv').config()
const { Client } = require('pg')
const fileName = require('path').basename(__filename)

const createUserTable					= require('./tables/user.js')
const createCustomerTable				= require('./tables/customer.js')
const createShipAddrTable				= require('./tables/shipping_address.js')
const createVendorTable					= require('./tables/vendor.js')
const createShopTable					= require('./tables/shop.js')
const createShopContactTable			= require('./tables/shop_contact.js')
const createProductTable				= require('./tables/product.js')
const createShopCartTable				= require('./tables/shopping_cart.js')
const createCartItemTable				= require('./tables/shopping_cart_item.js')
const createTransactionTable			= require('./tables/transaction.js')
const createProductRevTable				= require('./tables/product_review.js')
const createVendorRevTable				= require('./tables/vendor_review.js')
const createProductMediaTable			= require('./tables/product_media.js')
const createReversedTransactionTable	= require('./tables/reversed_transaction.js')

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
	database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
})

const create = async () => {
	try {
		await client.connect()
		await client.query(`drop schema ecommerce_app cascade;`)
		await client.query(`create schema if not exists ecommerce_app;`)
		await client.query(createUserTable)
		await client.query(createCustomerTable)
		await client.query(createUserTable)
		await client.query(createCustomerTable)
		await client.query(createShipAddrTable)
		await client.query(createVendorTable)
		await client.query(createShopTable)
		await client.query(createShopContactTable)
		await client.query(createProductTable)
		await client.query(createShopCartTable)
		await client.query(createCartItemTable)
		await client.query(createTransactionTable)
		await client.query(createProductRevTable)
		await client.query(createVendorRevTable)
		await client.query(createProductMediaTable)
		await client.query(createReversedTransactionTable)
		await client.end()
	} catch (error) {
		console.error(error.stack)
	} finally {
		await client.end()
	}
}

create()
