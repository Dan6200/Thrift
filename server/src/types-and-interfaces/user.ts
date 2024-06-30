import {
  UIDSchema,
  UserRequestSchema,
  UserResponseSchema,
} from '../app-schema/users.js'

interface UserData {
  first_name: string
  last_name: string
  email?: string
  phone?: string
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

export const isValidUserRequestData = (
  data: unknown
): data is UserRequestData => !UserRequestSchema.validate(data).error

export const isValidUserResponseData = (
  data: unknown
): data is UserResponseData => !UserResponseSchema.validate(data).error
