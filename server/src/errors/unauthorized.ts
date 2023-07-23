import { StatusCodes } from 'http-status-codes'
import CustomAPIError from './custom-api.js'

class UnauthorizedError extends CustomAPIError {
  statusCode: number
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
    this.name = 'UnauthorizedError'
  }
}

export default UnauthorizedError
