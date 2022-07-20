const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
	database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
})

module.exports = {
	async query(text, params) {
		const result = await pool.query(text, params)
		return result
	},
	async getClient() {
		const client = await pool.connect()
		const query = client.query
		const release = client.release
		return client
	}
}
