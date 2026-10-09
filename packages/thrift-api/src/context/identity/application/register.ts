import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { AuthGateway } from '../ports/auth-gateway.js'

export type RegisterCommand = {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  dob?: string
  country?: string
  isVendor: boolean
}

export const registerUseCase =
  (gateway: AuthGateway) =>
  async (command: RegisterCommand): Promise<Result<unknown, DomainError>> => {
    const { data, error } = await gateway.signUp(command)
    if (error) {
      return err(domainError('INVALID_INPUT', error.message))
    }
    return ok(data)
  }
