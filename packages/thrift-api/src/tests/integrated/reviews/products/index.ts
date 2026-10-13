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

const { userInfo: vendorInfo } = vendorFactory()
const { userInfo: mustaphaInfo } = userFactory({ isCustomer: true })
const { userInfo: ebukaInfo } = userFactory({ isCustomer: true })
import { createOrderForTesting } from '../../helpers/create-order.js'

chai.use(chaiHttp).should()

export default function (customer: { userInfo: ProfileRequestData }) {
  let customerToken: string
  let customerId: string
  let vendorToken: string
  let vendorId: string
  let storeId: number
  let orderItemId: number
  let productId: number
  let nonPurchasingCustomerId: string
  let nonPurchasingCustomerToken: string

  before(async () => {
    // Create and sign in customer
    customerId = await createUserForTesting(customer.userInfo)
    customerToken = await signInForTesting(customer.userInfo)

    // Create and sign in vendor
    vendorId = await createUserForTesting(vendorInfo)
    vendorToken = await signInForTesting(vendorInfo)

    // Create a store for the vendor
    const storeRes = await createStoreForTesting(vendorToken)
    storeId = storeRes.body.store_id

    // Create a product in that store
    const productCreationPromises = []
    for await (const promise of createProductsForTesting(
      vendorToken,
      storeId,
      1,
    )) {
      productCreationPromises.push(promise)
    }
    const productResponses = await Promise.all(productCreationPromises)
    const productRes = productResponses[0]
    productId = productRes.body.product_id
    const variantId = productRes.body.variants[0].variant_id

    // Create an order for the customer with the product variant
    const orderRes = await createOrderForTesting(
      customerToken,
      { store_id: storeId },
      {
        items: [{ variant_id: variantId, quantity: 1 }],
      },
    )
    orderRes.should.have.status(201)
    orderItemId = orderRes.body.items[0].order_item_id

    // Create and sign in a non-purchasing customer to test authorization
    const otherCustomers = [ebukaInfo, mustaphaInfo]
    const nonPurchasingUser = otherCustomers.find(
      (c) => c.email !== customer.userInfo.email,
    )
    if (!nonPurchasingUser) {
      throw new Error(
        'Could not find a unique non-purchasing customer for the test.',
      )
    }
    nonPurchasingCustomerId = await createUserForTesting(nonPurchasingUser)
    nonPurchasingCustomerToken = await signInForTesting(nonPurchasingUser)
  })

  after(async () => {
    await deleteUserForTesting(customerId)
    await deleteUserForTesting(vendorId)
    await deleteUserForTesting(nonPurchasingCustomerId)
  })

  it('should allow a customer to create a product review', async () => {
    const reviewData = {
      rating: 4.5,
      customer_remark: 'Great product, very satisfied!',
    }
    await testCreateProductReview({
      token: customerToken,
      params: { order_item_id: orderItemId },
      body: reviewData,
    })
  })

  it('should prevent a non-purchasing customer from creating a product review', async () => {
    const reviewData = {
      rating: 1.0,
      customer_remark: 'I did not buy this product.',
    }
    await testCreateProductReviewUnauthorized({
      token: nonPurchasingCustomerToken,
      params: { order_item_id: orderItemId },
      body: reviewData,
    })
  })

  it('should allow a customer to get their product review', async () => {
    await testGetProductReview({
      token: customerToken,
      params: { order_item_id: orderItemId },
    })
  })

  it('should allow a non-purchasing customer to view a product review', async () => {
    await testGetProductReview({
      token: nonPurchasingCustomerToken,
      params: { order_item_id: orderItemId },
    })
  })

  it('should allow anyone to get product reviews by product ID', async () => {
    await testGetProductReviewsByProductId({
      product_id: productId,
    })
  })

  it('should allow a customer to update their product review', async () => {
    const updatedReviewData = {
      rating: 5.0,
      customer_remark: 'Absolutely love it! Highly recommend.',
    }
    await testUpdateProductReview({
      token: customerToken,
      params: { order_item_id: orderItemId },
      body: updatedReviewData,
    })
  })

  it('should prevent a non-purchasing customer from updating a product review', async () => {
    const updatedReviewData = {
      rating: 1.0,
      customer_remark: 'Attempted to update review as non-purchasing customer.',
    }
    await testUpdateProductReviewUnauthorized({
      token: nonPurchasingCustomerToken,
      params: { order_item_id: orderItemId },
      body: updatedReviewData,
    })
  })

  it('should prevent a non-purchasing customer from deleting a product review', async () => {
    await testDeleteProductReviewUnauthorized({
      token: nonPurchasingCustomerToken,
      params: { order_item_id: orderItemId },
    })
  })

  it('should allow a customer to delete their product review', async () => {
    await testDeleteProductReview({
      token: customerToken,
      params: { order_item_id: orderItemId },
    })
  })

  it('should fail to get a deleted product review', async () => {
    await testGetNonExistentProductReview({
      token: customerToken,
      params: { order_item_id: orderItemId },
    })
  })
}
