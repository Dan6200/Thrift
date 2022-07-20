const { Client } = require('pg')

const client = new Client({
    user: process.env.user,
    host: process.env.host,
    password: process.env.pgpassword,
    port: process.env.pgport
})

const connect = async () => {
	try {
		await client.connect()
		await client.query(`drop schema ecommerce_app cascade`)
		await client.query(`create schema if not exists ecommerce_app`)
		await client.query(`set search_path to ecommerce_app`)
		await client.end()
	} catch (err) {
		console.error(error.stack)
	} finally {
		await client.end()
	}
}

module.export = connect
