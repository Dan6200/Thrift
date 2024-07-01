import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'

let firebaseConfig = {}
if (process.env.NODE_ENV === 'testing') {
  firebaseConfig = {
    apiKey: 'AIzaSyCw_JRQCsUEJeNIywcwP8n6-9j3t5cMb6s',
    authDomain: 'thrift-app-fb.firebaseapp.com',
    projectId: 'thrift-app-fb',
    storageBucket: 'thrift-app-fb.appspot.com',
    messagingSenderId: '393857060713',
    appId: '1:393857060713:web:cddd0ee1013735d159b7f8',
  }
} else throw new Error('Not available during production or development')
console.log('firebase config: ', firebaseConfig)
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
