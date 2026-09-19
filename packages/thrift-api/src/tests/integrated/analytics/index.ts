import chai from 'chai'
import chaiHttp from 'chai-http'
import { ProfileRequestData } from '#src/types/profile/index.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'
import { createUserForTesting } from '../helpers/create-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import {
  testGetKPIs,
  testGetRevenueTrends,
  testGetSalesAnalytics,
  testGetCustomerAcquisitionTrends,
  testGetCustomersByLocation,
  testGetCustomerLifetimeValue,
  testGetTopSellingProducts,
  testGetLowStockProducts,
  testGetProductPerformance,
} from './definitions/index.js'
import { createStoreForTesting } from '../helpers/create-store.js'
import { createProductsForTesting } from '../helpers/create-product.js'
import { createOrderForTesting } from '../helpers/create-order.js'
import { knex } from '#src/db/index.js'
import { faker } from '@faker-js/faker'
import { loadUserData } from '../helpers/load-data.js'
import { updateVariantForTesting } from '../helpers/product-variants.js'
import { ProductVariant } from '#src/types/products.js'

const Ebuka = loadUserData(
  'src/tests/integrated/data/users/customers/user-ebuka',
)
const Aisha = loadUserData(
  'src/tests/integrated/data/users/customers/user-aisha',
)
const Mustapha = loadUserData(
  'src/tests/integrated/data/users/customers/user-mustapha',
)

chai.use(chaiHttp).should()

export default function ({ userInfo }: { userInfo: ProfileRequestData }) {
  describe('Analytics', () => {
    let token: string
    let storeId: number
    const userIds: string[] = []

    before(async function () {
      this.timeout(100000) // Increase timeout for seeding
      const vendorId = await createUserForTesting(userInfo)
      userIds.push(vendorId)
      token = await signInForTesting(userInfo)
      const storeResponse = await createStoreForTesting(token)
      storeId = storeResponse.body.store_id

      // Create and sign in customers
      const customers = [Ebuka.userInfo, Aisha.userInfo, Mustapha.userInfo]
      const customerTokens: { [key: string]: string } = {}
      for (const customerInfo of customers) {
        const customerId = await createUserForTesting(customerInfo)
        userIds.push(customerId)
        customerTokens[customerId] = await signInForTesting(customerInfo)
      }

      // Create products and collect variants
      const variants: (ProductVariant & { product_id: number })[] = []
      const productCreationPromises = []
      for await (const promise of createProductsForTesting(token, storeId, 3)) {
        productCreationPromises.push(promise)
      }
      const productResponses = await Promise.all(productCreationPromises)
      for (const res of productResponses) {
        const productId = res.body.product_id
        const variantsWithProductId = res.body.variants.map((v: any) => ({
          ...v,
          product_id: productId,
        }))
        variants.push(...variantsWithProductId)
      }

      // Create random orders
      const orderCreationPromises = []
      for (let i = 0; i < 30; i++) {
        const randomCustomerId = faker.helpers.arrayElement(
          Object.keys(customerTokens),
        )
        const randomCustomerToken = customerTokens[randomCustomerId]
        const randomVariant = faker.helpers.arrayElement(variants)
        const randomQuantity = faker.number.int({ min: 1, max: 3 })

        // Restock the ordered variant
        await updateVariantForTesting(
          token, // vendor token
          randomVariant.product_id,
          randomVariant.variant_id,
          storeId,
          {
            quantity_available: 1000,
            inventory_change_reason: 'restock_before_order_simulation',
          },
        )

        const promise = createOrderForTesting(
          randomCustomerToken,
          { store_id: storeId },
          {
            items: [
              {
                variant_id: randomVariant.variant_id,
                quantity: randomQuantity,
              },
            ],
          },
        ).then(async (orderRes) => {
          orderRes.should.have.status(201)
          const orderId = orderRes.body.order_id
          const orderDate = faker.date.between({
            from: '2024-01-01T00:00:00.000Z',
            to: '2024-12-31T23:59:59.999Z',
          })
          await knex('orders').where({ order_id: orderId }).update({
            created_at: orderDate,
            updated_at: orderDate,
          })
        })
        orderCreationPromises.push(promise)
      }
      await Promise.all(orderCreationPromises).catch((reason) => {
        console.error(reason)
      })
    })

    it('should get KPIs', async () => {
      await testGetKPIs({
        token,
        query: { storeId, startDate: '2024-01-01', endDate: '2024-12-31' },
      })
    })

    it('should get revenue trends', async () => {
      await testGetRevenueTrends({
        token,
        query: {
          storeId,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          interval: 'month',
        },
      })
    })

    it('should get sales analytics', async () => {
      await testGetSalesAnalytics({
        token,
        query: {
          storeId,
          type: 'by-product',
          offset: 2,
          limit: 10,
          sortBy: 'unitsSold',
          sortOrder: 'desc',
        },
      })
    })

    it('should get sales analytics by category', async () => {
      await testGetSalesAnalytics({
        token,
        query: { storeId, type: 'by-category' },
      })
    })

    it('should get sales analytics for recent orders', async () => {
      await testGetSalesAnalytics({
        token,
        query: {
          storeId,
          type: 'recent-orders',
          offset: 1,
          limit: 10,
          status: 'completed',
        },
      })
    })

    it('should get customer acquisition trends', async () => {
      await testGetCustomerAcquisitionTrends({
        token,
        query: {
          storeId,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          interval: 'month',
        },
      })
    })

    it('should get customers by location', async () => {
      await testGetCustomersByLocation({
        token,
        query: { storeId, locationType: 'country' },
      })
    })

    it('should get customer lifetime value', async () => {
      await testGetCustomerLifetimeValue({
        token,
        query: { storeId, limit: 10, sortBy: 'clv', sortOrder: 'desc' },
      })
    })

    it('should get top selling products', async () => {
      await testGetTopSellingProducts({
        token,
        query: {
          storeId,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          limit: 10,
        },
      })
    })

    it('should get low stock products', async () => {
      await testGetLowStockProducts({
        token,
        query: { storeId, threshold: 5, limit: 10 },
      })
    })

    it('should get product performance', async () => {
      await testGetProductPerformance({
        token,
        query: { storeId, startDate: '2024-01-01', endDate: '2024-12-31' },
      })
    })

    after(async () => {
      for (const userId of userIds) {
        await deleteUserForTesting(userId)
      }
    })
  })
}
