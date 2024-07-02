import {
  UIDSchema,
  UserRequestSchema,
  UserResponseSchema,
  UserUpdateRequestSchema,
} from '../app-schema/users.js'

interface UserData {
  first_name: string
  last_name: string
  email?: string
  phone?: string
  password: string
  dob: Date
  country: string
}

export type UserRequestData = UserData & ({ email: string } | { phone: string })

export interface UID {
  uid: string
}

export const isValidUID = (data: unknown): data is UID =>
  !UIDSchema.validate(data).error

interface UserResponse extends UserData {
  is_customer: boolean
  is_vendor: boolean
}

export type UserResponseData = UserResponse & UserRequestData

export const isValidUserUpdateRequestData = (
  data: unknown
): data is UserRequestData => {
  const { error } = UserUpdateRequestSchema.validate(data)
  if (error) throw new Error(error.toString())
  return true
}

export const isValidUserRequestData = (
  data: unknown
): data is UserRequestData => {
  const { error } = UserRequestSchema.validate(data)
  if (error) throw new Error(error.toString())
  return true
}

export const isValidUserResponseData = (
  data: unknown
): data is UserResponseData => {
  const { error } = UserResponseSchema.validate(data)
  if (error) throw new Error(error.toString())
  return true
}
