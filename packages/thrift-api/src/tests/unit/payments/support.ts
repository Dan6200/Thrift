import { PaymentRepository } from '#src/context/payments/ports/payment-repository.js'
import { PaymentGateway } from '#src/context/payments/ports/payment-gateway.js'
import { EventPublisher } from '#src/shared/event.js'

/** A plain-object fake of the PaymentRepository port. */
export const makePaymentRepo = (
  overrides: Partial<PaymentRepository> = {},
): PaymentRepository => ({
  async getOrderForPayment(): Promise<any> {
    return null
  },
  async getProfileEmail(): Promise<string | null> {
    return null
  },
  async updatePaymentReference(): Promise<void> {
    return undefined
  },
  async recordWebhook(): Promise<'recorded' | 'duplicate'> {
    return 'recorded'
  },
  async markOrderProcessing(): Promise<number> {
    return 0
  },
  async markOrderProcessingByReference(): Promise<unknown | null> {
    return null
  },
  async getOrderByIdAndReference(): Promise<unknown | null> {
    return null
  },
  async getOrderByReference(): Promise<{
    order_id: number
    status: string
  } | null> {
    return null
  },
  async markOrderFailed(): Promise<number> {
    return 0
  },
  async markOrderProcessingByOrderId(): Promise<number> {
    return 0
  },
  async saveCard(): Promise<void> {
    return undefined
  },
  ...overrides,
})

/** A plain-object fake of the PaymentGateway port (mocks Paystack entirely). */
export const makePaymentGateway = (
  overrides: Partial<PaymentGateway> = {},
): PaymentGateway => ({
  async initializeTransaction(): Promise<any> {
    return {
      status: true,
      data: {
        reference: 'ref',
        authorization_url: 'https://checkout.paystack.com/fake',
        access_code: 'code',
      },
    }
  },
  verifySignature(): boolean {
    return true
  },
  async verifyTransaction(): Promise<any> {
    return { status: true, data: { status: 'success' } }
  },
  ...overrides,
})

/** A plain-object fake of the EventPublisher port. */
export const makePublisher = (
  overrides: Partial<EventPublisher> = {},
): EventPublisher => ({
  async publish(): Promise<void> {
    return undefined
  },
  ...overrides,
})
