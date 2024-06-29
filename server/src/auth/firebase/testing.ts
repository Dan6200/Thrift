import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'

let firebaseConfig = {}
if (process.env.NODE_ENV === 'testing') {
  firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    appId: process.env.FIREBASE_APP_ID,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  }
} else throw new Error('Not available during production or development')
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
