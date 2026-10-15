import { paystack, verifyPaystackSignature } from '#src/lib/paystack.js'
import { PaymentGateway } from '../ports/payment-gateway.js'

export const paystackPaymentGateway: PaymentGateway = {
  async initializeTransaction({
    email,
    amount,
    reference,
    metadata,
    callbackUrl,
  }) {
    const transaction = await paystack.transaction.initialize({
      email,
      amount,
      reference,
      metadata,
      callback_url:
        callbackUrl ||
        process.env.PAYSTACK_CALLBACK_URL ||
        'https://your-frontend.com/payment-success',
    })

    return {
      status: transaction.status,
      message: transaction.message,
      data: {
        reference: transaction.data.reference,
        authorization_url: transaction.data.authorization_url,
        access_code: transaction.data.access_code,
      },
    }
  },

  verifySignature(rawBody, signature) {
    return verifyPaystackSignature(rawBody, signature)
  },

  async verifyTransaction(reference) {
    return paystack.transaction.verify({ reference })
  },
}
