import { initializeApp } from 'firebase-admin/app'
import fbAdmin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'

const { credential } = fbAdmin
let app = null
let serviceAccount: any = null
if (process.env.NODE_ENV === 'production')
  serviceAccount = await import(process.env.FB_SERVICE_ACCOUNT).then(
    (serviceAccount) => serviceAccount
  )
if (process.env.NODE_ENV === 'testing')
  serviceAccount = JSON.parse(process.env.FB_SERVICE_ACCOUNT)

app = initializeApp({
  credential: credential.cert(serviceAccount),
})

export const auth = getAuth(app)
