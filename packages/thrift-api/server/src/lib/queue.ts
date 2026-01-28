import { Client } from '@upstash/qstash'

export const client = new Client({
  token: process.env.QSTASH_TOKEN,
  retry: {
    retries: 5,
    backoff: (retry_count) => 100 * 2 ** retry_count,
  },
})
