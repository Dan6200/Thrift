const { StatusCodes } = require('http-status-codes')
const db = require('../db')

const errorHandlerMiddleware = async (err, req, res, next) => {
    let customError = {
        // set default
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong try again later',
    }
    return res.status(customError.statusCode).json({
		msg: customError.msg,
	})
}

module.exports = errorHandlerMiddleware
