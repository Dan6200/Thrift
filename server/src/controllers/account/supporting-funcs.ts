import BadRequestError from '../../errors/bad-request.js'
import UnauthorizedError from '../../errors/unauthorized.js'
import { QueryParams } from '../../types-and-interfaces/process-routes.js'
import validateUserPassword from '../helpers/validate-user-password.js'
import Joi from 'joi'

/**
 * @description Checks to see if password is valid
 * If the body is empty, it throws an error
 * If the password is invalid, it throws an error
 **/

export const validatePasswordData = async <T>({
  userId,
  body,
}: QueryParams<T>) => {
  if (typeof body == 'undefined' || Object.keys(body).length === 0)
    throw new BadRequestError('request data cannot be empty')
  // check if password exists in request body
  // throw a bad request error if it does not
  if (!Object.hasOwn(body, 'password'))
    throw new BadRequestError('Provide current password')
  if (!Object.hasOwn(body, 'new_password'))
    throw new BadRequestError('Provide new password')
  let { password: oldPassword } = body
  if (userId == null)
    throw new UnauthorizedError('Cannot update password, user not logged in')
  if (typeof oldPassword !== 'string')
    throw new BadRequestError('Invalid password format')
  let pwdIsValid = await validateUserPassword(userId, oldPassword)
  if (!pwdIsValid)
    throw new UnauthorizedError(`Invalid Credentials,
				cannot update password`)
}

export function userIdIsNotNull(
  userId: string | null | undefined
): userId is string {
  return userId != null
}

export function passwdDataIsValid(
  body: any | null | undefined
): body is { password: string; new_password: string } {
  return (
    body != null &&
    Object.hasOwn(body, 'password') &&
    Object.hasOwn(body, 'new_password')
  )
}
