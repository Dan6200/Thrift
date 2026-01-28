import { Redis } from '@upstash/redis'

export const client = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

/* We may need to switch back to node-redis...
 *
export default {
  async connect() {
    if (client.isOpen) return
    await client.connect()
  },
  async quit() {
    if (client.isOpen) client.quit()
  },
  async getClient() {
    this.connect()
    return client
  },
  async sAdd(key: string, value: string) {
    this.connect()
    const retVal = await client.sAdd(key, value)
    // this.quit()
    return retVal
  },
  async sIsMember(key: string, value: string) {
    this.connect()
    const retVal = await client.sIsMember(key, value)
    // this.quit()
    return retVal
  },
}
*/
