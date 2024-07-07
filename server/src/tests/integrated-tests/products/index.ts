import chai from 'chai'
import chaiHttp from 'chai-http'
import { Product } from '../../../types-and-interfaces/products.js'
import { StoresData } from '../../../types-and-interfaces/stores-data.js'
import {
  testCreateProduct,
  testGetAllProducts,
  testGetProduct,
  testUpdateProduct,
  testDeleteProduct,
  testGetNonExistentProduct,
} from './utils/index.js'
import { testPostVendor } from '../users/vendors/utils/index.js'
import { UserRequestData } from '../../../types-and-interfaces/users/index.js'
import assert from 'assert'
import { knex } from '../../../db/index.js'
import { isValidPostUserParams } from '../users/index.js'
import { testPostUser } from '../users/utils/index.js'
import { auth } from '../../../auth/firebase/index.js'
import { auth as _auth } from '../../../auth/firebase/testing.js'
import { signInWithCustomToken } from 'firebase/auth'

// globals
chai.use(chaiHttp).should()
// Set server url
const server = process.env.SERVER!

export default function ({
  userInfo,
  stores: vendorStores,
  products,
  productReplaced,
}: {
  userInfo: UserRequestData
  stores: StoresData[]
  updatedStores?: StoresData[]
  products: Product[]
  productReplaced: Product[]
}) {
  before(async () => {
    // Create a new user for each tests
    const postUserParams = {
      server,
      path: '/v1/users',
      body: userInfo,
    }
    if (!isValidPostUserParams(postUserParams))
      throw new Error('Invalid parameter object')
    const response = await testPostUser(postUserParams)
    uidToDelete = response.uid
    const customToken = await auth.createCustomToken(response.uid)
    token = await signInWithCustomToken(_auth, customToken).then(({ user }) =>
      user.getIdToken()
    )
    await testPostVendor({ server, token, path: vendorsRoute })
  })

  after(async function () {
    // Delete users from db
    await knex('users').where('uid', uidToDelete).del()
    // Delete all users from firebase auth
    await auth
      .deleteUser(uidToDelete)
      .catch((error) =>
        console.error(`failed to delete user with uid ${uidToDelete}: ${error}`)
      )
  })

  let storeIds: Map<number, number[] | null> = new Map()
  let token: string
  let uidToDelete: string
  const vendorsRoute = '/v1/users/vendors/'
  const storesRoute = '/v1/stores'
  const productsRoute = '/v1/products'

  describe('Testing Products In Each Store', async function () {
    it('it should Add a couple products to each store', async () => {
      let idx: number, store: StoresData
      for ([idx, store] of vendorStores.entries()) {
        for await (const { product_id } of testCreateProduct({
          server,
          token,
          path: productsRoute,
          query: null,
          dataList: products,
        })) {
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
