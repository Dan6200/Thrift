// packages/thrift-api/src/tests/integrated/payments/index.ts
import { expect } from 'chai'
import { StatusCodes } from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'
import * as crypto from 'crypto' // Use standard import for crypto
import { createUserForTesting } from '../helpers/create-user.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import { createStoreForTesting } from '../helpers/create-store.js'
import { createOrderForTesting } from '../helpers/create-order.js' // Import existing helper
import { createProductsForTesting } from '../helpers/create-product.js'
import { userFactory, vendorFactory } from '../factories/index.js'
import { knex } from '#src/db/index.js'
import {
  testInitializePayment,
  testPaystackWebhook,
} from './definitions/index.js'
import { paystack } from '#src/lib/paystack.js'

const {
  OK,
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} = StatusCodes

// Load test data
const customerData = userFactory({ isCustomer: true })
const vendorData = vendorFactory()

describe('Payments', () => {
  let customerToken: string
  let vendorToken: string

  let customerUserId: string
  let vendorUserId: string

  let testOrderId: number
  let testStoreId: string
  let testVariantId: number
  let testPaystackSecret: string

  before(async () => {
    // 1. Create Users
    customerUserId = await createUserForTesting(customerData.userInfo)
    vendorUserId = await createUserForTesting(vendorData.userInfo)

    // 2. Sign In to get tokens
    customerToken = await signInForTesting({
      email: customerData.userInfo.email,
      password: customerData.userInfo.password,
    })
    vendorToken = await signInForTesting({
      email: vendorData.userInfo.email,
      password: vendorData.userInfo.password,
    })

    // 3. Create Store for Vendor
    // createStoreForTesting uses predefined data from helpers/create-store.ts (user-aliyu/stores.yml)
    const storeRes = await createStoreForTesting(vendorToken)
    testStoreId = storeRes.body.store_id

    // 4. Create a product + variant so we have a real, current variant id
    const productRequests = []
    for await (const req of createProductsForTesting(
      vendorToken,
      Number(testStoreId),
      1,
    )) {
      productRequests.push(req)
    }
    const [productRes] = await Promise.all(productRequests)
    testVariantId = productRes.body.variants[0].variant_id

    // 5. Create Order using helper
    const createOrderPayload = {
      items: [{ variant_id: testVariantId, quantity: 1 }],
    }
    const createOrderQuery = { store_id: testStoreId }
    const orderRes = await createOrderForTesting(
      customerToken,
      createOrderQuery,
      createOrderPayload,
    )
    testOrderId = orderRes.body.order_id

    // Store Paystack secret for webhook signature generation
    testPaystackSecret = process.env.PAYSTACK_SECRET_KEY || 'test_secret'
  })

  after(async () => {
    // Cleanup
    if (testOrderId) await knex('orders').where({ order_id: testOrderId }).del()
    // Store cleanup: Assuming store creation helper returns something that allows deletion
    // For now, if stores table has store_id as primary, direct delete is fine
    await knex('stores').where({ store_id: testStoreId }).del()

    if (customerUserId) await deleteUserForTesting(customerUserId)
    if (vendorUserId) await deleteUserForTesting(vendorUserId)
  })

  describe('POST /payments/initialize', () => {
    it('should initialize a payment and return Paystack authorization URL', async () => {
      const response = await testInitializePayment({
        token: customerToken,
        body: { order_id: testOrderId },
      })

      // Verify payment_reference is updated in the database
      const updatedOrder = await knex('orders')
        .where({ order_id: testOrderId })
        .first()
      expect(updatedOrder)
        .to.have.property('payment_reference')
        .that.equals(response.reference)
    })

    it('should return 400 if order_id is missing', async () => {
      await testInitializePayment({
        token: customerToken,
        // Pass in undefined as order_id
        body: { order_id: undefined as any },
        expectedStatusCode: BAD_REQUEST,
      })
    })

    it('should return 404 if order does not exist', async () => {
      await testInitializePayment({
        token: customerToken,
        body: { order_id: 99999999 },
        expectedStatusCode: NOT_FOUND,
      })
    })

    it('should return 400 if order is not in pending status', async () => {
      // Create a new order and set its status to something else
      const createOrderPayload = {
        items: [{ variant_id: testVariantId, quantity: 1 }],
      }
      const createOrderQuery = { store_id: testStoreId }
      const orderRes = await createOrderForTesting(
        customerToken,
        createOrderQuery,
        createOrderPayload,
      )
      const nonPendingOrderId = orderRes.body.order_id

      await knex('orders')
        .where({ order_id: nonPendingOrderId })
        .update({ status: 'delivered' })

      await testInitializePayment({
        token: customerToken,
        body: { order_id: nonPendingOrderId },
        expectedStatusCode: BAD_REQUEST,
      })

      await knex('orders').where({ order_id: nonPendingOrderId }).del()
    })

    it('should return 401 if user is unauthenticated', async () => {
      await testInitializePayment({
        token: 'invalid_token',
        body: { order_id: testOrderId },
        expectedStatusCode: UNAUTHORIZED,
      })
    })

    it('should return 404 (or 403) if order does not belong to authenticated user', async () => {
      await testInitializePayment({
        token: vendorToken,
        body: { order_id: testOrderId },
        expectedStatusCode: NOT_FOUND,
      })
    })
  })

  describe('POST /payments/webhook', () => {
    let mockWebhookSecret: string

    before(() => {
      mockWebhookSecret = testPaystackSecret
    })

    const generatePaystackSignature = (payload: any, secret: string) => {
      const hmac = crypto.createHmac('sha512', secret)
      return hmac.update(JSON.stringify(payload)).digest('hex')
    }

    const createPendingOrder = async () => {
      const orderRes = await createOrderForTesting(
        customerToken,
        { store_id: testStoreId },
        { items: [{ variant_id: testVariantId, quantity: 1 }] },
      )
      const orderId = orderRes.body.order_id
      const paymentRef = `TEST_REF_${uuidv4()}`
      await knex('orders')
        .where({ order_id: orderId })
        .update({ payment_reference: paymentRef })
      return { orderId, paymentRef }
    }

    const postWebhook = (payload: any, signature: string, expected?: number) =>
      testPaystackWebhook({
        body: payload,
        headers: {
          'x-paystack-signature': signature,
          'Content-Type': 'application/json',
        },
        ...(expected !== undefined ? { expectedStatusCode: expected } : {}),
      })

    it('should return 400 for invalid Paystack signature', async () => {
      const payload = {
        id: uuidv4(),
        event: 'charge.success',
        data: { reference: 'fake_ref' },
      }
      const body = await postWebhook(payload, 'invalid_signature', BAD_REQUEST)
      expect(body)
        .to.have.property('message')
        .that.includes('Invalid Paystack webhook signature')
    })

    it('should return 200 but not update order for unhandled event type', async () => {
      const { orderId, paymentRef } = await createPendingOrder()
      const payload = {
        id: uuidv4(),
        event: 'transfer.success', // Unhandled event
        data: { reference: paymentRef, status: 'success' },
      }
      const signature = generatePaystackSignature(payload, mockWebhookSecret)

      const body = await postWebhook(payload, signature, OK)
      expect(body).to.have.property('message').that.includes('not handled')

      const originalOrder = await knex('orders')
        .where({ order_id: orderId })
        .first()
      expect(originalOrder).to.have.property('status').that.equals('pending')

      await knex('orders').where({ order_id: orderId }).del()
    })

    // The charge.success path publishes an event via QStash. Run the local
    // QStash dev server (`qstash dev` on :8080) and start the API with
    // QSTASH_URL=http://localhost:8080 (see .github/workflows/run-tests.yml).
    // The processing + publish logic is also unit-tested against a fake
    // EventPublisher (unit/payments/handle-webhook-use-case.ts).
    it('should update order status on successful charge webhook', async () => {
      const { orderId, paymentRef } = await createPendingOrder()
      const payload = {
        id: uuidv4(),
        event: 'charge.success',
        data: {
          reference: paymentRef,
          status: 'success',
          amount: 1200 * 100,
          metadata: { order_id: orderId },
        },
      }
      const signature = generatePaystackSignature(payload, mockWebhookSecret)

      const body = await postWebhook(payload, signature)
      expect(body).to.have.property('message').that.includes('processing')

      const updatedOrder = await knex('orders')
        .where({ order_id: orderId })
        .first()
      expect(updatedOrder).to.have.property('status').that.equals('processing')

      await knex('orders').where({ order_id: orderId }).del()
    })

    it('should process the same event id only once (replay protection)', async () => {
      const { orderId, paymentRef } = await createPendingOrder()
      const payload = {
        id: uuidv4(),
        event: 'charge.success',
        data: {
          reference: paymentRef,
          status: 'success',
          metadata: { order_id: orderId },
        },
      }
      const signature = generatePaystackSignature(payload, mockWebhookSecret)

      const first = await postWebhook(payload, signature)
      expect(first).to.have.property('message').that.includes('processing')

      const second = await postWebhook(payload, signature)
      expect(second)
        .to.have.property('message')
        .that.includes('already processed')

      await knex('orders').where({ order_id: orderId }).del()
    })
  })
})
