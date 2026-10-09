export type SignUpInput = {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  dob?: string
  country?: string
  isVendor: boolean
}

export type SignUpResult = {
  data: unknown
  error: { message: string } | null
}

export type AuthGateway = {
  signUp(input: SignUpInput): Promise<SignUpResult>
}
