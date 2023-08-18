import { Router } from 'express'
import login from '../controllers/auth/login.js'
import logout from '../controllers/auth/logout.js'
import register from '../controllers/auth/register.js'
const handleAuth = Router()

handleAuth.post('/login', login)
handleAuth.post('/register', register)
handleAuth.delete('/logout', logout)

export default handleAuth
