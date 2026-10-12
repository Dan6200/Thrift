import { StatusCodes } from 'http-status-codes'
import InternalServerError from './internal-server.js'

class ConflictError extends InternalServerError {
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.CONFLICT
    this.name = 'ConflictError'
  }
}

export default ConflictError
