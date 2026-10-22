// server/src/lib/paystack.ts
import PaystackSDK from '@paystack/paystack-sdk'

const secretKey = process.env.PAYSTACK_SECRET_KEY

if (!secretKey) {
  throw new Error(
    'PAYSTACK_SECRET_KEY is missing from environment variables. Please check your .env file.',
  )
}

// `@paystack/paystack-sdk` is CommonJS and assigns the class to both
// `module.exports` and `module.exports.default`. ESM interop for that shape
// differs across runtimes (e.g. Vercel's nodejs launcher), so resolve the
// constructor defensively instead of relying on the default import.
type PaystackConstructor = typeof PaystackSDK

const Paystack = ((PaystackSDK as unknown as { default?: unknown }).default ??
  (PaystackSDK as unknown as { Paystack?: unknown }).Paystack ??
  PaystackSDK) as PaystackConstructor

/**
 * Singleton instance of the Paystack SDK client.
 */
export const paystack = new Paystack(secretKey)

/**
 * Helper to verify Paystack Webhook Signatures using HMAC SHA512.
 */
import crypto from 'node:crypto'

export const verifyPaystackSignature = (
  rawBody: string | Buffer,
  signature: string,
): boolean => {
  const hash = crypto
    .createHmac('sha512', secretKey)
    .update(rawBody)
    .digest('hex')

  return hash === signature
}
