// vim mark
// cspell:disable
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
import accountRouter from './routes/account/index.js'
import shippingRouter from './routes/shipping/index.js'
import productsRouter from './routes/products/index.js'
import storesRouter from './routes/stores/index.js'
import mediaRouter from './routes/media/index.js'

// middlewares
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/authentication.js'
import notFound from './middleware/not-found.js'
import swaggerUi from 'swagger-ui-express'
import yaml from 'js-yaml'
import { readFile } from 'fs/promises'
import path from 'path'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const swaggerDocument = await readFile(
  path.resolve('./server/api-docs/dist.yaml'),
  'utf8'
).then((doc) => yaml.load(doc))

////////////// Middlewares //////////////
let app: Express = express()
app.set('trust proxy', 1)
app.use(cookieParser())
// /** Comment out below to run tests
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
app.use(
  '/.well-known/acme-challenge',
  express.static('public/.well-known/acme-challenge')
)
app.get('/api.json', (_, res) => res.json(swaggerDocument))

app.use(helmet())
app.use(cors())
app.use(xss())
app.use(morgan('dev'))
// app.use(morgan('combined'))
// application routes
const v1Router = Router()
v1Router.use('/auth', authRouter)
v1Router.use('/account', authenticateUser, accountRouter)
v1Router.use('/shipping-info', authenticateUser, shippingRouter)
v1Router.use('/stores', authenticateUser, storesRouter)
v1Router.use('/products', authenticateUser, productsRouter)
v1Router.use('/media', authenticateUser, mediaRouter)

app.use('/v1', v1Router)
// helper middlewares
app.use(notFound)
app.use(errorHandlerMiddleware)
export default app
