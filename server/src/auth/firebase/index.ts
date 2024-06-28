import admin from 'firebase-admin'
var serviceAccount = require('/etc/secrets/fb-secret-key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})
