import { initializeApp } from 'firebase-admin/app'
import { credential } from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'

const app = initializeApp({
  credential: await import('/etc/secrets/fb-secret-key.json').then(
    (serviceAccount) => credential.cert(serviceAccount)
  ),
})

export const auth = getAuth(app)
