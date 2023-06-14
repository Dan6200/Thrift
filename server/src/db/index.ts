import util from 'util'
// cspell:disable
import nodePostgres, { QueryResult } from 'pg'
const { Pool } = nodePostgres
import retryQuery from '../controllers/helpers/retryQuery.js'
import dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({
  // user: process.env.LPGUSER,
  // host: process.env.LPGHOST,
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT as string),
  ssl: true,
})

export default {
  async end(): Promise<void> {
    await pool.end()
  },

  lastQuery: null,

  // Copied from official docs, slightly modified
  async query(text: string, params?: Array<any>): Promise<QueryResult<any>> {
    // const start = Date.now()
    setTimeout(function () {
      this.lastQuery = arguments
    })
    // console.log('\nexecuted query:\n', text, params)
    // allow a retry if DB fails to connect
    let res: any
    const retryCount = 7
    const delay = 500
    res = await retryQuery(
      pool.query.bind(pool),
      [text, params],
      retryCount,
      delay
    )
    // const duration = Date.now() - start
    // add await for this to work

    // console.log(
    //   '\nquery result',
    //   util.inspect(
    //     {
    //       duration: `${duration}ms`,
    //       result: res.rows,
    //       rows: res.rowCount,
    //     },
    //     false,
    //     null,
    //     true,
    //   ),
    // )

    return res
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
