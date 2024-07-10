import { initializeApp } from 'firebase-admin/app'
import fbAdmin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const { credential } = fbAdmin
let app = null
let serviceAccount: any = null
serviceAccount = await import(process.env.FB_SERVICE_ACCOUNT, {
  assert: { type: 'json' },
}).then((module) => {
  serviceAccount = module.default
  return serviceAccount
})

app = initializeApp({
  credential: credential.cert(serviceAccount),
})

export const auth = getAuth(app)
