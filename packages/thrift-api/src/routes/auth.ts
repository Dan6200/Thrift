import express from 'express'
import { validate } from '#src/request-validation.js'
import { RegisterRequestSchema } from '#src/app-schema/auth.js'
import { registerHandler } from '#src/context/identity/http/register.js'

const router = express.Router()

router.post('/register', validate(RegisterRequestSchema), registerHandler)

export default router
