// packages/thrift-api/server/src/tests/integrated/payments/index.ts
import { expect } from 'chai'
import { StatusCodes } from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'
import * as crypto from 'crypto' // Use standard import for crypto
import { createUserForTesting } from '../helpers/create-user.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import { createStoreForTesting } from '../helpers/create-store.js'
import { createOrderForTesting } from '../helpers/create-order.js' // Import existing helper
import { loadUserData } from '../helpers/load-data.js'
import { knex } from '#src/db/index.js'
import {
  testInitializePayment,
  testPaystackWebhook,
} from './definitions/index.js'

// Use static import for Paystack SDK (default import)
import Paystack from '@paystack/paystack-sdk'

const {
  OK,
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} = StatusCodes

// Load test data
const customerData = loadUserData(
  'server/src/tests/integrated/data/users/customers/user-aisha',
)
const vendorData = loadUserData(
  'server/src/tests/integrated/data/users/vendors/user-aliyu',
)

describe('Payments', () => {
  let customerToken: string
  let vendorToken: string

  let customerUserId: string
  let vendorUserId: string

  let testOrderId: number
  let testStoreId: string
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

    // 4. Create Order using helper
    const createOrderPayload = {
      items: [
        { variant_id: 1, quantity: 1 }, // Assuming variant_id 1 exists or is created elsewhere
      ],
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
        .that.equals(response.body.reference)
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
        items: [{ variant_id: 1, quantity: 1 }],
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
        .update({ status: 'completed' })

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

    it('should update order status on successful charge webhook', async () => {
      // Create a fresh order
      const createOrderPayload = {
        items: [{ variant_id: 1, quantity: 1 }],
      }
      const createOrderQuery = { store_id: testStoreId }
      const orderRes = await createOrderForTesting(
        customerToken,
        createOrderQuery,
        createOrderPayload,
      )
      const newOrderId = orderRes.body.order_id

      // Update the newly created order with a payment_reference to simulate initialization
      const paymentRef = `TEST_REF_${uuidv4()}`
      await knex('orders')
        .where({ order_id: newOrderId })
        .update({ payment_reference: paymentRef })

      const webhookPayload = {
        event: 'charge.success',
        data: {
          reference: paymentRef,
          status: 'success',
          amount: 1200 * 100,
          metadata: { order_id: newOrderId },
        },
      }
      const signature = generatePaystackSignature(
        webhookPayload,
        mockWebhookSecret,
      )

      // Mock Paystack verification
      const originalVerify = Paystack.prototype.transaction.verify
      Paystack.prototype.transaction.verify = () =>
        Promise.resolve({
          status: true,
          data: { status: 'success' },
          message: 'Verification successful',
        })

      const response = await testPaystackWebhook({
        body: webhookPayload,
        headers: {
          'x-paystack-signature': signature,
          'Content-Type': 'application/json',
        },
      })

      console.log('Paystack Webhook Response', response)

      expect(response.status).to.equal(OK)
      expect(response.body).to.have.property(
        'message',
        'Webhook processed successfully',
      )

      const updatedOrder = await knex('orders')
        .where({ order_id: newOrderId })
        .first()
      expect(updatedOrder).to.have.property('status').that.equals('processing')

      Paystack.prototype.transaction.verify = originalVerify
      await knex('orders').where({ order_id: newOrderId }).del()
    })

    it('should return 400 for invalid Paystack signature', async () => {
      const webhookPayload = {
        event: 'charge.success',
        data: { reference: 'fake_ref' },
      }
      const invalidSignature = 'invalid_signature'

      const response = await testPaystackWebhook({
        body: webhookPayload,
        headers: {
          'x-paystack-signature': invalidSignature,
          'Content-Type': 'application/json',
        },
        expectedStatusCode: BAD_REQUEST,
      })
      expect(response.status).to.equal(BAD_REQUEST)
      expect(response.body).to.have.property(
        'message',
        'Invalid Paystack webhook signature.',
      )
    })

    it('should return 200 but not update order for unhandled event type', async () => {
      // Create a fresh order
      const createOrderPayload = {
        items: [{ variant_id: 1, quantity: 1 }],
      }
      const createOrderQuery = { store_id: testStoreId }
      const orderRes = await createOrderForTesting(
        customerToken,
        createOrderQuery,
        createOrderPayload,
      )
      const newOrderId = orderRes.body.order_id

      const paymentRef = `TEST_REF_UNHANDLED_${uuidv4()}`
      await knex('orders')
        .where({ order_id: newOrderId })
        .update({ payment_reference: paymentRef })

      const webhookPayload = {
        event: 'transfer.success', // Unhandled event
        data: { reference: newOrderId.payment_reference, status: 'success' },
      }
      const signature = generatePaystackSignature(
        webhookPayload,
        mockWebhookSecret,
      )

      const response = await testPaystackWebhook({
        body: webhookPayload,
        headers: {
          'x-paystack-signature': signature,
          'Content-Type': 'application/json',
        },
        expectedStatusCode: OK,
      })

      expect(response.status).to.equal(OK)
      expect(response.body)
        .to.have.property('message')
        .that.includes('not handled')

      const originalOrder = await knex('orders')
        .where({ order_id: newOrderId })
        .first()
      expect(originalOrder).to.have.property('status').that.equals('pending')

      await knex('orders').where({ order_id: newOrderId }).del()
    })

    it('should return 500 if Paystack verification fails', async () => {
      // Create a fresh order
      const createOrderPayload = {
        items: [{ variant_id: 1, quantity: 1 }],
      }
      const createOrderQuery = { store_id: testStoreId }
      const orderRes = await createOrderForTesting(
        customerToken,
        createOrderQuery,
        createOrderPayload,
      )
      const newOrderId = orderRes.body.order_id

      const paymentRef = `TEST_REF_FAIL_VERIFY_${uuidv4()}`
      await knex('orders')
        .where({ order_id: newOrderId })
        .update({ payment_reference: paymentRef })

      const webhookPayload = {
        event: 'charge.success',
        data: {
          reference: paymentRef,
          status: 'success',
          amount: 1300 * 100,
          metadata: { order_id: newOrderId },
        },
      }
      const signature = generatePaystackSignature(
        webhookPayload,
        mockWebhookSecret,
      )

      // Mock Paystack verification to fail
      const originalVerify = Paystack.prototype.transaction.verify
      Paystack.prototype.transaction.verify = () =>
        Promise.resolve({
          status: false,
          data: { status: 'failed', gateway_response: 'Invalid transaction' },
          message: 'Verification failed',
        })

      const response = await testPaystackWebhook({
        body: webhookPayload,
        headers: {
          'x-paystack-signature': signature,
          'Content-Type': 'application/json',
        },
        expectedStatusCode: INTERNAL_SERVER_ERROR,
      })
      expect(response.status).to.equal(INTERNAL_SERVER_ERROR)
      expect(response.body)
        .to.have.property('message')
        .that.includes('verification failed')

      const originalOrder = await knex('orders')
        .where({ order_id: newOrderId })
        .first()
      expect(originalOrder).to.have.property('status').that.equals('pending')

      Paystack.prototype.transaction.verify = originalVerify // Restore
      await knex('orders').where({ order_id: newOrderId }).del()
    })
  })
})
