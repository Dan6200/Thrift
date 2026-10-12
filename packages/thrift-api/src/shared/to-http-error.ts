import BadRequestError from '#src/errors/bad-request.js'
import NotFoundError from '#src/errors/not-found.js'
import UnauthorizedError from '#src/errors/unauthorized.js'
import UnauthenticatedError from '#src/errors/unauthenticated.js'
import InternalServerError from '#src/errors/internal-server.js'
import ConflictError from '#src/errors/conflict.js'
import { DomainError } from './domain-error.js'

export const toHttpError = (error: DomainError): Error => {
  switch (error.code) {
    case 'INVALID_INPUT':
      return new BadRequestError(error.message)
    case 'NOT_FOUND':
      return new NotFoundError(error.message)
    case 'UNAUTHORIZED':
      return new UnauthorizedError(error.message)
    case 'UNAUTHENTICATED':
      return new UnauthenticatedError(error.message)
    case 'INTERNAL':
      return new InternalServerError(error.message)
    case 'CONFLICT':
      return new ConflictError(error.message)
  }
}
