// vim mark
// cspell:ignore middlewares
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, Router } from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import morgan from 'morgan'
import xss from 'xss-clean'
import rateLimiter from 'express-rate-limit'
import cookieParser from 'cookie-parser'
// routers
import authRouter from './routes/auth.js'
import userAccountRouter from './routes/user-account/index.js'
// middlewares
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/authentication.js'
import notFound from './middleware/not-found.js'
import swaggerUi from 'swagger-ui-express'
import yaml from 'js-yaml'
import { readFile } from 'fs/promises'
import path from 'path'

const swaggerDocument = await readFile(
	path.resolve('./server/api-docs/openapi.yaml'),
	'utf8'
).then(doc => yaml.load(doc))

dotenv.config()

////////////// Middlewares //////////////
let app: Express = express()
app.set('trust proxy', 1)
app.use(cookieParser())
// /** For Production only
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000,
		max: 100,
		standardHeaders: true,
		legacyHeaders: false,
	})
)
// **/
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(<JSON>swaggerDocument))
app.get('/swagger.json', (_req, res) => res.json(swaggerDocument))

app.use(helmet())
app.use(cors())
app.use(xss())
app.use(morgan('dev'))
// application routes
const v1Router = Router()
v1Router.use('/auth', authRouter)
v1Router.use('/users', authenticateUser, userAccountRouter)

app.use('/v1', v1Router)
// helper middlewares
app.use(notFound)
app.use(errorHandlerMiddleware)
export default app
