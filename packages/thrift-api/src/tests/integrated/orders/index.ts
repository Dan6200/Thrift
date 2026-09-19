import chai from 'chai'
import chaiHttp from 'chai-http'
import assert from 'assert'
import { ProfileRequestData } from '#src/types/profile/index.js'
import { OrderCreateRequestData } from '#src/types/orders.js'
import {
  testCreateOrder,
  testGetAllOrders,
  testGetOrder,
  testUpdateOrder,
  testDeleteOrder,
  testGetNonExistentOrder,
  testGetReviewableItem,
} from './definitions/index.js'
import { createUserForTesting } from '#src/tests/integrated/helpers/create-user.js'
import { deleteUserForTesting } from '#src/tests/integrated/helpers/delete-user.js'
import { signInForTesting } from '#src/tests/integrated/helpers/signin-user.js'
import { createStoreForTesting } from '#src/tests/integrated/helpers/create-store.js'
import { createProductsForTesting } from '#src/tests/integrated/helpers/create-product.js'
import { loadUserData } from '../helpers/load-data.js'

const { userInfo: aliyuInfo, products } = loadUserData(
  'src/tests/integrated/data/users/vendors/user-aliyu',
)

chai.use(chaiHttp).should()

export default function (customer: { userInfo: ProfileRequestData }) {
  let customerToken: string
  let customerId: string
  let vendorToken: string
  let vendorId: string
  let storeId: number
  let variantId: number
  let product_id: string // Added to capture product ID
  let order_id: number
  let order_item_id: number
  let variantPrice: number

  before(async () => {
    // Create and sign in customer
    customerId = await createUserForTesting(customer.userInfo)
    customerToken = await signInForTesting(customer.userInfo)

    // Create and sign in vendor
    vendorId = await createUserForTesting(aliyuInfo)
    vendorToken = await signInForTesting(aliyuInfo)

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
    product_id = productRes.body.product_id // Capture product_id
    variantId = productRes.body.variants[0].variant_id
    variantPrice = productRes.body.variants[0].base_price
  })

  after(async () => {
    await deleteUserForTesting(customerId)
    await deleteUserForTesting(vendorId)
  })

  it('should allow a customer to create an order', async () => {
    const orderData = {
      items: [
        {
          variant_id: variantId,
          quantity: 1,
        },
      ],
    }
    const response = await testCreateOrder({
      token: customerToken,
      body: orderData,
      query: { store_id: storeId },
      expectedData: {
        ...orderData,
        store_id: storeId,
        total_amount: variantPrice * 1,
      },
    })
    order_id = response.order_id
    order_item_id = response.items[0].order_item_id // Capture order_item_id
  })

  it('should allow a customer to get all their orders', async () => {
    await testGetAllOrders({
      token: customerToken,
      query: { store_id: storeId },
    })
  })

  it('should allow a customer to get a specific order', async () => {
    await testGetOrder({
      token: customerToken,
      params: { order_id },
      query: { store_id: storeId },
    })
  })

  it('should allow a customer to find a reviewable item', async () => {
    await testGetReviewableItem({
      token: customerToken,
      query: { product_id: product_id }, // Pass product_id only
      expectedOrderItemId: order_item_id,
    })
  })

  // it('should allow a customer to update an order', async () => {
  //   const updatedOrderData = {
  //     items: [
  //       {
  //         variant_id: variantId,
  //         quantity: 2,
  //       },
  //     ],
  //   }
  //   await testUpdateOrder({
  //     token: customerToken,
  //     params: { order_id },
  //     body: updatedOrderData,
  //     expectedData: {
  //       ...updatedOrderData,
  //       store_id: storeId,
  //       total_amount: variantPrice * 2,
  //     },
  //   })
  // })

  // it('should allow a customer to delete an order', async () => {
  //   await testDeleteOrder({
  //     token: customerToken,
  //     params: { order_id },
  //   })
  // })

  // it('should fail to get a deleted order', async () => {
  //   await testGetNonExistentOrder({
  //     token: customerToken,
  //     params: { order_id },
  //   })
  // })
}
