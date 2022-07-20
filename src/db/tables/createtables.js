const { Pool } = require('pg')
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

const pool = new Pool({
    user: process.env.pguser,
    host: process.env.host,
    password: process.env.pgpassword,
	database: process.env.pgdatabase,
    port: process.env.pgport
})

module.exports = async () => {
	try {
		await pool.connect()
		await pool.query(createUserTable)
		await pool.query(createCustomerTable)
		await pool.query(createUserTable)
		await pool.query(createCustomerTable)
		await pool.query(createShipAddrTable)
		await pool.query(createVendorTable)
		await pool.query(createShopTable)
		await pool.query(createShopContactTable)
		await pool.query(createProductTable)
		await pool.query(createShopCartTable)
		await pool.query(createCartItemTable)
		await pool.query(createTransactionTable)
		await pool.query(createProductRevTable)
		await pool.query(createVendorRevTable)
		await pool.query(createProductMediaTable)
		await pool.query(createReversedTransactionTable)
		await pool.end()
	} catch (error) {
		console.error(error.stack)
	} finally {
		await pool.end()
	}
}
