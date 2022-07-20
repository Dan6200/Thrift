const { Client } = require('pg')
const createUserTable					= require('../tables/user.js')
const createCustomerTable				= require('../tables/customer.js')
const createShipAddrTable				= require('../tables/shipping_address.js')
const createVendorTable					= require('../tables/vendor.js')
const createShopTable					= require('../tables/shop.js')
const createShopContactTable			= require('../tables/shop_contact.js')
const createProductTable				= require('../tables/product.js')
const createShopCartTable				= require('../tables/shopping_cart.js')
const createCartItemTable				= require('../tables/shopping_cart_item.js')
const createTransactionTable			= require('../tables/transaction.js')
const createProductRevTable				= require('../tables/product_review.js')
const createVendorRevTable				= require('../tables/vendor_review.js')
const createProductMediaTable			= require('../tables/product_media.js')
const createReversedTransactionTable	= require('../tables/reversed_transaction.js')

const client = new Client({
    user: process.env.user,
    host: process.env.host,
    password: process.env.pgpassword,
    port: process.env.pgport
})

const connectdb = async () => {
	try {
		await client.connect()
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
	} catch (err) {
		console.error(error.stack)
	} finally {
		await client.end()
	}
}

