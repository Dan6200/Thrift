// cspell:disable
import { Pool, types } from 'pg'
import { retryConnection } from './utils/retry-connection.js'
import { knexOptions, pgOptions } from './postgres/options.js'
import pgQuery from './postgres/pg-query.js'
import pgGetClient from './postgres/pg-get-client.js'
import Knex from 'knex'

const pool = new Pool(pgOptions)

// handle error...
pool.on('error', retryConnection(pool))

types.setTypeParser(23, function (val) {
  return parseInt(val, 10)
})

types.setTypeParser(1700, function (val) {
  return parseFloat(val)
})

export const pg = {
  async end(): Promise<void> {
    await pool.end()
  },
  query: pgQuery.bind(this, pool),
  getClient: pgGetClient.bind(this, pool),
}

export const knex = Knex(knexOptions)
