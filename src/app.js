require('dotenv').config()
require('express-async-errors')

const express = require('express'),
	application = express(),
// security
	helmet = require('helmet'),
	cors = require('cors'),
	xss = require('xss-clean'),
	rateLimiter = require('express-rate-limit'),
// 	database
	db = require('./db'),

////////////// Middlewares //////////////

// routers
	authRouter = require('./routes/auth'),
	userAccountRouter = require('./routes/user-account'),
	customerAccountRouter = require('./routes/customer-account'),
	vendorAccountRouter = require('./routes/vendor-account'),

// error handler
	notFoundMiddleware = require('./middleware/not-found'),
	errorHandlerMiddleware = require('./middleware/error-handler'),

// authentication
	authenticateUser = require('./middleware/authentication')

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

application.use('/api/v1/user-account', 
	authenticateUser, 
	userAccountRouter
)

application.use('/api/v1/user-account/vendor', 
	authenticateUser, 
	vendorAccountRouter
)

application.use('/api/v1/user-account/customer', 
	authenticateUser, 
	customerAccountRouter
)


application.get('/', (request, response) => {
	response.send('</h1>ecommerce application</h1>')
})

application.use(notFoundMiddleware)
application.use(errorHandlerMiddleware)

const port = process.env.PORT

const start = async () => {
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
