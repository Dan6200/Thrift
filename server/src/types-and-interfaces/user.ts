export interface UserData {
  first_name: string
  last_name: string
  email: string
  phone: string
  dob: Date
  country: string
}

export const isValidUser = (data: unknown): data is UserData =>
  typeof data === 'object' &&
  data !== null &&
  'first_name' in data &&
  'last_name' in data &&
  'email' in data &&
  'phone' in data &&
  'dob' in data &&
  'country' in data
