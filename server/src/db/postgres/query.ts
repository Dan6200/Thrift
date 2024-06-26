// cspell:disable
import nodePostgres, { QueryResult, QueryResultRow } from 'pg'
const { Pool } = nodePostgres
import { pgOptions } from './index.js'
import retryQuery from '../utils/retry-query.js'
import { retryConnection } from '../utils/retry-connection.js'

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
    const retryCount = 7
    const delay = 500

    return retryQuery(
      pool.query.bind(pool),
      { text, values, name },
      retryCount,
      delay
    )

    // const duration = Date.now() - start
    //
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
    //
    // return res
  },

  async getClient(): Promise<any> {
    const client: any = await pool.connect()
    const query = client.query
    const release = client.release

    const timeout = setTimeout(() => {
      console.error('A client has been checked out for more than 5 seconds!')
      console.error(
        `The last executed query on this client was: ${client.lastQuery}`
      )
    }, 5000)

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
