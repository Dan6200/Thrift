import { StatusCodes } from 'http-status-codes'

export type DomainErrorCode =
  | 'INVALID_INPUT'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'UNAUTHENTICATED'
  | 'CONFLICT'
  | 'INTERNAL'

export type DomainError = {
  code: DomainErrorCode
  message: string
}

export const domainError = (
  code: DomainErrorCode,
  message: string,
): DomainError => ({ code, message })

const codeToStatus: Record<DomainErrorCode, StatusCodes> = {
  INVALID_INPUT: StatusCodes.BAD_REQUEST,
  NOT_FOUND: StatusCodes.NOT_FOUND,
  UNAUTHORIZED: StatusCodes.FORBIDDEN,
  UNAUTHENTICATED: StatusCodes.UNAUTHORIZED,
  CONFLICT: StatusCodes.CONFLICT,
  INTERNAL: StatusCodes.INTERNAL_SERVER_ERROR,
}

export const domainErrorStatusCode = (error: DomainError): number =>
  codeToStatus[error.code]
