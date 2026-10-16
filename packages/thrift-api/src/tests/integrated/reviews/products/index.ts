import chai from 'chai'
import chaiHttp from 'chai-http'
import { ProfileRequestData } from '#src/types/profile/index.js'
import {
  testCreateProductReview,
  testGetProductReview,
  testUpdateProductReview,
  testDeleteProductReview,
  testGetNonExistentProductReview,
  testDeleteProductReviewUnauthorized,
  testUpdateProductReviewUnauthorized,
  testCreateProductReviewUnauthorized,
  testGetProductReviewsByProductId,
} from './definitions/index.js'
import { createUserForTesting } from '../../helpers/create-user.js'
import { deleteUserForTesting } from '../../helpers/delete-user.js'
import { signInForTesting } from '../../helpers/signin-user.js'
import { createStoreForTesting } from '../../helpers/create-store.js'
import { createProductsForTesting } from '../../helpers/create-product.js'
import { vendorFactory, userFactory } from '../../factories/index.js'
import { createOrderForTesting } from '../../helpers/create-order.js'

chai.use(chaiHttp).should()

type ReviewContext = {
  customerToken: string
  nonPurchasingCustomerToken: string
  productId: number
  orderItemId: number
}

export default function (customer: { userInfo: ProfileRequestData }) {
  // Each test seeds its own vendor, product, purchased order and non-purchasing
  // customer, so no test depends on state left behind by another.
  const withReview = async (
    fn: (ctx: ReviewContext) => Promise<void>,
  ): Promise<void> => {
    const customerId = await createUserForTesting(customer.userInfo)
    const customerToken = await signInForTesting(customer.userInfo)
    const { userInfo: vendorInfo } = vendorFactory()
    const vendorId = await createUserForTesting(vendorInfo)
    const vendorToken = await signInForTesting(vendorInfo)

    const nonPurchasingInfo = userFactory({ isCustomer: true }).userInfo
    const nonPurchasingCustomerId =
      await createUserForTesting(nonPurchasingInfo)
    const nonPurchasingCustomerToken = await signInForTesting(nonPurchasingInfo)

    try {
      const storeRes = await createStoreForTesting(vendorToken)
      const storeId = storeRes.body.store_id

      const productRequests = []
      for await (const req of createProductsForTesting(
        vendorToken,
        storeId,
        1,
      )) {
        productRequests.push(req)
      }
      const [productRes] = await Promise.all(productRequests)
      const productId = productRes.body.product_id
      const variantId = productRes.body.variants[0].variant_id

      const orderRes = await createOrderForTesting(
        customerToken,
        { store_id: storeId },
        { items: [{ variant_id: variantId, quantity: 1 }] },
      )
      orderRes.should.have.status(201)
      const orderItemId = orderRes.body.items[0].order_item_id

      await fn({
        customerToken,
        nonPurchasingCustomerToken,
        productId,
        orderItemId,
      })
    } finally {
      await deleteUserForTesting(customerId)
      await deleteUserForTesting(vendorId)
      await deleteUserForTesting(nonPurchasingCustomerId)
    }
  }

  const createReview = (token: string, orderItemId: number) =>
    testCreateProductReview({
      token,
      params: { order_item_id: orderItemId },
      body: {
        rating: 4.5,
        customer_remark: 'Great product, very satisfied!',
      },
    })

  it('should allow a customer to create a product review', () =>
    withReview(async (ctx) => {
      await createReview(ctx.customerToken, ctx.orderItemId)
    }))

  it('should prevent a non-purchasing customer from creating a product review', () =>
    withReview(async (ctx) => {
      await testCreateProductReviewUnauthorized({
        token: ctx.nonPurchasingCustomerToken,
        params: { order_item_id: ctx.orderItemId },
        body: {
          rating: 1.0,
          customer_remark: 'I did not buy this product.',
        },
      })
    }))

  it('should allow a customer to get their product review', () =>
    withReview(async (ctx) => {
      await createReview(ctx.customerToken, ctx.orderItemId)
      await testGetProductReview({
        token: ctx.customerToken,
        params: { order_item_id: ctx.orderItemId },
      })
    }))

  it('should allow a non-purchasing customer to view a product review', () =>
    withReview(async (ctx) => {
      await createReview(ctx.customerToken, ctx.orderItemId)
      await testGetProductReview({
        token: ctx.nonPurchasingCustomerToken,
        params: { order_item_id: ctx.orderItemId },
      })
    }))

  it('should allow anyone to get product reviews by product ID', () =>
    withReview(async (ctx) => {
      await createReview(ctx.customerToken, ctx.orderItemId)
      await testGetProductReviewsByProductId({ product_id: ctx.productId })
    }))

  it('should allow a customer to update their product review', () =>
    withReview(async (ctx) => {
      await createReview(ctx.customerToken, ctx.orderItemId)
      await testUpdateProductReview({
        token: ctx.customerToken,
        params: { order_item_id: ctx.orderItemId },
        body: {
          rating: 5.0,
          customer_remark: 'Absolutely love it! Highly recommend.',
        },
      })
    }))

  it('should prevent a non-purchasing customer from updating a product review', () =>
    withReview(async (ctx) => {
      await createReview(ctx.customerToken, ctx.orderItemId)
      await testUpdateProductReviewUnauthorized({
        token: ctx.nonPurchasingCustomerToken,
        params: { order_item_id: ctx.orderItemId },
        body: {
          rating: 1.0,
          customer_remark:
            'Attempted to update review as non-purchasing customer.',
        },
      })
    }))

  it('should prevent a non-purchasing customer from deleting a product review', () =>
    withReview(async (ctx) => {
      await createReview(ctx.customerToken, ctx.orderItemId)
      await testDeleteProductReviewUnauthorized({
        token: ctx.nonPurchasingCustomerToken,
        params: { order_item_id: ctx.orderItemId },
      })
    }))

  it('should allow a customer to delete their product review', () =>
    withReview(async (ctx) => {
      await createReview(ctx.customerToken, ctx.orderItemId)
      await testDeleteProductReview({
        token: ctx.customerToken,
        params: { order_item_id: ctx.orderItemId },
      })
    }))

  it('should fail to get a deleted product review', () =>
    withReview(async (ctx) => {
      await createReview(ctx.customerToken, ctx.orderItemId)
      await testDeleteProductReview({
        token: ctx.customerToken,
        params: { order_item_id: ctx.orderItemId },
      })
      await testGetNonExistentProductReview({
        token: ctx.customerToken,
        params: { order_item_id: ctx.orderItemId },
      })
    }))
}
