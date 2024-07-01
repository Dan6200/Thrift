import { initializeApp } from 'firebase-admin/app'
import fbAdmin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'

const { credential } = fbAdmin
let app = null
if (process.env.NODE_ENV.match(/(production|testing)/)) {
  app = initializeApp({
    credential: await import(process.env.FB_SERVICE_ACCOUNT).then(
      (serviceAccount) => credential.cert(serviceAccount)
    ),
  })
}

export const auth = getAuth(app)
