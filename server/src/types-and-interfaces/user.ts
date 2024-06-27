import { UserRequestSchema } from '../app-schema/users.js'

export interface UserRequestData {
  first_name: string
  last_name: string
  email: string
  phone: string
  dob: Date
  country: string
}

export const isValidUserRequestData = (
  data: unknown
): data is UserRequestData => !UserRequestSchema.validate(data).error
