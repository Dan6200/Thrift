//cspell:ignore cloudinary
import { knex } from '../../../db/index.js'
import { UserRequestData } from '@/types-and-interfaces/users/index.js'
import {
  ProductRequestData,
  ProductMedia,
} from '@/types-and-interfaces/products.js'
import {
  testPostProduct,
  testUploadProductMedia,
} from '../products/utils/index.js'
import { testPostVendor } from '../users/vendors/utils/index.js'
import { isValidPostUserParams } from '../users/index.js'
import { testPostUser } from '../users/utils/index.js'
import { auth } from '@/auth/firebase/index.js'
import { auth as _auth } from '@/auth/firebase/testing.js'
import { signInWithCustomToken } from 'firebase/auth'
import { bulkDeleteImages } from '../utils/bulk-delete.js'

// globals
const mediaRoute = '/v1/media'
const vendorsRoute = '/v1/users/vendors/'
const productsRoute = '/v1/products'
let token: string
const server: string = process.env.SERVER!
let uidToDelete: string
const productIds: number[] = []

export default function ({
  userInfo,
  products,
  productMedia,
}: {
  userInfo: UserRequestData
  products: ProductRequestData[]
  productMedia: ProductMedia[][]
}) {
  describe('Product media management', () => {
    before(async () => {
      // Bulk delete media from cloudinary
      await bulkDeleteImages()
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
      for (const product of products) {
        const { product_id } = await testPostProduct({
          server,
          token,
          path: `${productsRoute}`,
          body: product,
        })
        productIds.push(product_id)
      }
    })

    after(async function () {
      // Delete users from db
      if (uidToDelete) await knex('users').where('uid', uidToDelete).del()
      // Delete all users from firebase auth
      await auth
        .deleteUser(uidToDelete)
        .catch((error: Error) =>
          console.error(
            `failed to delete user with uid ${uidToDelete}: ${error}`
          )
        )
      // Bulk delete media from cloudinary
      await bulkDeleteImages()
    })

    // Create a product for the store
    it("it should add the product's media to an existing product", async () => {
      for (const [idx, productId] of productIds.entries())
        await testUploadProductMedia(
          server,
          token,
          mediaRoute,
          productMedia[idx],
          {
            productId,
          }
        )
    })
  })
}
