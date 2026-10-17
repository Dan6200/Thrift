import dotenv from 'dotenv'

/**
 * Mirror the server's environment loading (src/server.ts) so the test process
 * shares the same Paystack secret, Supabase credentials, and Cloudinary config
 * as the running test server. Without this the webhook tests sign with a mock
 * secret that the server rejects.
 *
 * `dotenv.config` does not override variables already set by the command (e.g.
 * SERVER=localhost:1037), so the harness target stays intact.
 */
let path = `.env.${process.env.NODE_ENV}`

if (process.env.NODE_ENV === 'testing') {
  path += process.env.CI ? '.ci' : '.local'
}

dotenv.config({ path })
