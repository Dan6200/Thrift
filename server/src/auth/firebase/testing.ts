import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'

let firebaseConfig = {}
if (process.env.NODE_ENV === 'testing') {
  firebaseConfig = JSON.parse(process.env.FB_CONFIG)
} else throw new Error('Not available during production or development')
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
