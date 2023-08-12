// cspell:disable
import nodePostgres from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const retryConHlper = (pool: nodePostgres.Pool, delay: number) => {
  setTimeout(() => {
    pool.connect((err, _, release) => {
      if (err) {
        console.error('Error acquiring client', err.stack)
        // retry after
        delay <<= 1
        retryConHlper(pool, delay)
      } else {
        console.log('Successfully reconnected')
        // release the client back to the pool
        release()
      }
    })
  }, delay) // retry after a delay
}

export const retryConnection = (pool: nodePostgres.Pool) => (err: Error) => {
  console.error('Unexpected error on the client', err.stack)
  const delay = 1000
  retryConHlper(pool, delay)
}
