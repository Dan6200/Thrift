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
	async getClient() {
		this.connect()
		return client
	},
	async sAdd(key: string, value: string) {
		this.connect()
		return client.sAdd(key, value)
	},
	async sIsMember(key: string, value: string) {
		this.connect()
		return client.sIsMember(key, value)
	},
}
