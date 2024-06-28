import { Pool, QueryResult, QueryResultRow } from 'pg'
import retryQuery from '../utils/retry-query.js'

export default async function (
  this: any,
  pool: Pool,
  text?: string,
  values?: Array<any>,
  name?: string
): Promise<QueryResult<QueryResultRow | QueryResultRow[]>> {
  const start = Date.now()
  setTimeout(() => {
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
}
