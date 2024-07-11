import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

let firebaseConfig = {}
if (process.env.NODE_ENV === 'testing') {
  firebaseConfig = JSON.parse(process.env.FB_CONFIG)
} else throw new Error('Not available during production or development')
const app = initializeApp(firebaseConfig, 'testing')
export const auth = getAuth(app)
