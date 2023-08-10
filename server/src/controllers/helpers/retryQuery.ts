import { log } from 'console'

const networkErrors = new Set([
  'ENOENT',
  'ETIMEDOUT',
  'ECONNRESET',
  'ENOTFOUND',
  'ECONNREFUSED',
  'ECONNABORTED',
  'EAI_AGAIN',
])

let runOnce: boolean = true
export default async function retryQuery(
  query: (params: object) => Promise<any>,
  params: object,
  retries: number,
  ms: number
): Promise<any> {
  let res: any
  try {
    if (!retries) {
      log(`db connection failed...quitting`)
      return
    }
    res = await query(params)
    runOnce = true
    return res
  } catch (err) {
    log('caught error', err, err.code)
    if (networkErrors.has(err.code))
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      }).then(() => {
        if (retries > 1) {
          if (runOnce) runOnce = false
          else ms <<= 1
          log(`db connection failed...retrying after ${ms}ms`)
          res = retryQuery(query, params, retries - 1, ms)
        }
        return res
      })
    else throw err
  }
}
