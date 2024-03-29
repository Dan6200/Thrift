import chai from 'chai'
import chaiHttp from 'chai-http'
import { Product } from '../../../types-and-interfaces/products.js'
import { StoresData } from '../../../types-and-interfaces/stores-data.js'
import { registration } from '../helper-functions/auth/index.js'
import {
  testCreateProduct,
  testGetAllProducts,
  testGetProduct,
  testUpdateProduct,
  testDeleteProduct,
  testGetNonExistentProduct,
} from '../helper-functions/products/index.js'
import { testCreateStore } from '../helper-functions/store/index.js'
import { testCreateVendor } from '../helper-functions/vendor/index.js'
import { AccountData } from '../../../types-and-interfaces/account.js'
import assert from 'assert'
import db from '../../../db/index.js'

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
  productReplaced,
}: {
  accountInfo: AccountData
  stores: StoresData[]
  updatedStores?: StoresData[]
  products: Product[]
  productReplaced: Product[]
}) {
  before(async function () {
    //  Set the server url
    server = process.env.SERVER!
    // Delete all user accounts
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

  let storeIds: Map<number, number[] | null> = new Map()
  describe('Testing Products In Each Store', async function () {
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
        for await (const { product_id } of testCreateProduct(
          server,
          token,
          productsRoute,
          { storeId: store_id },
          products
        )) {
          if (storeIds.get(store_id)) {
            storeIds.set(store_id, storeIds.get(store_id)!.concat(product_id))
          } else {
            storeIds.set(store_id, [product_id])
          }
        }
      }
    })

    it('it should retrieve all the products from each store', async () => {
      for (const [storeId] of storeIds.entries()) {
        await testGetAllProducts(server, token, productsRoute, {
          storeId,
        })
      }
    })

    it('it should retrieve all products from each store, sorted by net price ascending', async () => {
      for (const [storeId] of storeIds.entries()) {
        await testGetAllProducts(server, token, productsRoute, {
          storeId,
          sort: '-net_price',
        })
      }
    })

    it('it should retrieve all products from each store, results offset by 2 and limited by 10', async () => {
      for (const [storeId] of storeIds.entries()) {
        await testGetAllProducts(server, token, productsRoute, {
          storeId,
          offset: 1,
          limit: 2,
        })
      }
    })

    it('it should retrieve a specific product a vendor has for sale', async () => {
      for (const [storeId, productIds] of storeIds.entries()) {
        for (const productId of productIds!)
          await testGetProduct(server, token, `${productsRoute}/${productId}`, {
            storeId,
          })
      }
    })

    it('it should update all the products a vendor has for sale', async () => {
      for (const [storeId, productIds] of storeIds.entries()) {
        assert(productIds?.length === productReplaced.length)
        let idx = 0
        for (const productId of productIds!)
          await testUpdateProduct(
            server,
            token,
            `${productsRoute}/${productId}`,
            { storeId },
            productReplaced[idx++]
          )
      }
    })

    it('it should delete all the product a vendor has for sale', async () => {
      for (const [storeId, productIds] of storeIds.entries()) {
        for (const productId of productIds!)
          await testDeleteProduct(
            server,
            token,
            `${productsRoute}/${productId}`,
            { storeId }
          )
      }
    })

    it('it should fail to retrieve any of the deleted products', async () => {
      for (const [storeId, productIds] of storeIds.entries()) {
        for (const productId of productIds!)
          await testGetNonExistentProduct(
            server,
            token,
            `${productsRoute}/${productId}`,
            { storeId }
          )
      }
    })

    //end
  })
}
