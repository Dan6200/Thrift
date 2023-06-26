import 'dotenv'
import redis from 'redis'
import retryQuery from '../../controllers/helpers/retryQuery.js'

const client = redis.createClient({
	url: process.env.REDIS_URL,
})

export default {
	async connect() {
		client.on('error', err => {
			console.log('Redis Server Error...')
			console.error(err)
		})
		if (client.isOpen) return
		await client.connect()
	},
	async disconnect() {
		if (client.isOpen) client.disconnect()
	},
	async getClient() {
		this.connect()
		return client
	},
	async sAdd(key: string, value: string) {
		this.connect()
		const retVal = client.sAdd(key, value)
		this.disconnect()
		return retVal
	},
	async sIsMember(key: string, value: string) {
		this.connect()
		const retVal = client.sIsMember(key, value)
		this.disconnect()
		return retVal
	},
}
