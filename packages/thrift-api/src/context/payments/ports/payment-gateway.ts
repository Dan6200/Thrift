export type InitializeTransactionInput = {
  email: string
  amount: number
  reference: string
  metadata: string
  callbackUrl?: string
}

export type InitializeTransactionResult = {
  status: boolean
  message?: string
  data: { reference: string; authorization_url: string; access_code: string }
}

export type VerifyTransactionResult = {
  status: boolean
  message?: string
  data: { status: string }
}

export type PaymentGateway = {
  initializeTransaction(
    input: InitializeTransactionInput,
  ): Promise<InitializeTransactionResult>
  verifySignature(rawBody: string | Buffer, signature: string): boolean
  verifyTransaction(reference: string): Promise<VerifyTransactionResult>
}
