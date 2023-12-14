// cspell:disable
import nodePostgres, { QueryResult, QueryResultRow } from 'pg'
const { Pool } = nodePostgres
import retryQuery from '../controllers/helpers/retryQuery.js'
import { retryConnection } from '../controllers/helpers/retry-connection.js'
import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
import util from 'node:util'

const connectionString = process.env.PG_URL

// print url
console.log('connection string', connectionString)

const pgOptions = {
  connectionString,
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : false,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
}
const pool = new Pool(pgOptions)

// handle error...
pool.on('error', retryConnection(pool))

const { types } = nodePostgres
types.setTypeParser(23, function (val) {
  return parseInt(val, 10)
})

types.setTypeParser(1700, function (val) {
  return parseFloat(val)
})

export default {
  async end(): Promise<void> {
    await pool.end()
  },

  lastQuery: null,

  // Copied from official docs, slightly modified
  async query({
    text,
    values,
    name,
  }: {
    text: string
    values?: Array<any>
    name?: string
  }): Promise<QueryResult<QueryResultRow | QueryResultRow[]>> {
    const start = Date.now()
    setTimeout(function () {
      this.lastQuery = arguments
    })

    // console.log('\nexecuted query:\n', text, values, name)

    // allow a retry if DB fails to connect
    let res: unknown
    const retryCount = 7
    const delay = 500
    // for prod
    // res = retryQuery(pool.query.bind(pool), [text, values, name], retryCount, delay)

    // for debugging

    res = await retryQuery(
      pool.query.bind(pool),
      { text, values, name },
      retryCount,
      delay
    )

    const duration = Date.now() - start
    // add await for this to work

    // console.log(
    //   '\nquery result',
    //   util.inspect(
    //     {
    //       duration: `${duration}ms`,
    //       result: (res as any).rows,
    //     },
    //     false,
    //     null,
    //     true
    //   )
    // )

    return res as QueryResult<QueryResultRow | QueryResultRow[]>
  },

  async getClient(): Promise<any> {
    const client: any = await pool.connect()
    const query = client.query
    const release = client.release
    // set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
      console.error('A client has been checked out for more than 5 seconds!')
      console.error(
        `The last executed query on this client was: ${client.lastQuery}`
      )
    }, 5000)
    // monkey patch the query method to keep track of the last query executed
    client.query = (...args) => {
      client.lastQuery = args
      return query.apply(client, args)
    }
    client.release = () => {
      // clear our timeout
      clearTimeout(timeout)
      // set the methods back to their old un-monkey-patched version
      client.query = query
      client.release = release
      return release.apply(client)
    }
    return client
  },
}
