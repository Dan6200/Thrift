import chai from 'chai'
import chaiHttp from 'chai-http'
import db from '../../../../db/index.js'
import { AccountData } from '../../../../types-and-interfaces/account.js'
import { Product } from '../../../../types-and-interfaces/products.js'
import { StoresData } from '../../../../types-and-interfaces/stores-data.js'
import { registration } from '../../helper-functions/auth/index.js'
import {
  testCreateProduct,
  testGetAllProductsPublic,
  testGetProductPublic,
} from '../../helper-functions/products/index.js'
import { testCreateStore } from '../../helper-functions/store/index.js'
import { testCreateVendor } from '../../helper-functions/vendor/index.js'

// globals
chai.use(chaiHttp).should()
let server: string, token: string
const vendorsRoute = '/v1/account/vendor/'
const storesRoute = '/v1/stores'
const productsRoute = '/v1/products'

export default function ({
  accountInfo,
  stores: vendorStores,
  products,
}: {
  accountInfo: AccountData
  stores: StoresData[]
  products: Product[]
}) {
  before(async function () {
    //  Set the server url
    server = process.env.LOCAL_APP_SERVER!
    // Delete user accounts
    await db.query({
      text: 'delete from user_accounts where email=$1 or phone=$2',
      values: [accountInfo.email, accountInfo.phone],
    })
    // Register a new user
    ;({
      body: { token },
    } = await registration(server, accountInfo))
    // Create a vendor account for the user
    await testCreateVendor(server, token, vendorsRoute)
  })
  beforeEach(async () => {
    if (!token) throw new Error('access token undefined')
  })
  const productIds: number[] = []
  describe('Testing Products In Each Store', async function () {
    before(async () => {
      // Delete all stores
      await db.query({ text: 'delete from stores' })
    })

    after(async () => {
      // Delete all stores
      await db.query({ text: 'delete from stores' })
      // Delete all products
      await db.query({ text: 'delete from products' })
    })

    it('it should Add a couple products to each store', async () => {
      let idx: number, store: StoresData
      for ([idx, store] of vendorStores.entries()) {
        const { store_id } = await testCreateStore(
          server,
          token,
          storesRoute,
          null,
          store
        )
        for await (let { product_id } of testCreateProduct(
          server,
          token,
          productsRoute,
          { storeId: store_id },
          products
        ))
          productIds.push(product_id)
      }
    })

    it('it should retrieve all the products from each store', async () => {
      await testGetAllProductsPublic(server, null, productsRoute, {
        public: true,
      })
    })

    it('it should retrieve all products from each store, sorted by net price ascending', async () => {
      await testGetAllProductsPublic(server, null, productsRoute, {
        sort: '-net_price',
        public: true,
      })
    })

    it('it should retrieve all products from each store, results offset by 2 and limited by 10', async () => {
      await testGetAllProductsPublic(server, null, productsRoute, {
        offset: 1,
        limit: 2,
        public: true,
      })
    })

    it('it should retrieve a specific product', async () => {
      for (const productId of productIds)
        await testGetProductPublic(
          server,
          null,
          `${productsRoute}/${productId}`,
          { public: true }
        )
    })

    //end
  })
}
