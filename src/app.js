require('dotenv').config()
require('express-async-errors')
const express = require('express')
const application = express()

// security
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')


// Middlewares

// routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const userAccountsRouter = require('./routes/user-account')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// authentication
const authenticateUser = require('./middleware/authentication')

application.set('trust proxy', 1)
application.use(rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))
application.use(express.json())
application.use(helmet())
application.use(cors())
application.use(xss())

// routes
application.use('/api/v1/auth', authRouter)
application.use('/api/v1/user-account', authenticateUser, userAccountsRouter)

application.get('/', (...[,response]) => {
	response.send('</h1>ecommerce application</h1>')
})

application.use(notFoundMiddleware)
application.use(errorHandlerMiddleware)

const port = process.env.PORT

const start = async () => {
	console.clear() // TODO: Remove at build
	try {
		if (require.main === module)
			application.listen(port, () =>
				console.log(`Server is listening on port ${port}...`)) 
	} catch (error) { 
		console.log(error) 
	}
}

start()

module.exports = application
