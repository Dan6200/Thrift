import chai from 'chai'
import chaiHttp from 'chai-http'
import {
  testGetAllProductsPublic,
  testGetProductPublic,
} from '../../products/utils/index.js'
import { testPostVendor } from '../../users/vendors/utils/index.js'
import { UserRequestData } from '@/types-and-interfaces/users/index.js'
import { knex } from '@/db/index.js'
import { isValidPostUserParams } from '../../users/index.js'
import { testPostUser } from '../../users/utils/index.js'
import { auth } from '@/auth/firebase/index.js'
import { auth as _auth } from '@/auth/firebase/testing.js'
import { signInWithCustomToken } from 'firebase/auth'

// globals
chai.use(chaiHttp).should()
// Set server url
const server = process.env.SERVER!

export default function () {
  const productsRoute = '/v1/products'
  const productIds: number[] = []

  describe('Testing Retrieving Publicly accessible Products', async function () {
    it('it should retrieve all the products', async () => {
      await testGetAllProductsPublic({
        server,
        path: productsRoute,
        query: { public: true },
      })
    })

    it('it should retrieve a specific product', async () => {
      for (const productId of productIds) {
        await testGetProductPublic({
          server,
          path: `${productsRoute}/${productId}`,
          query: { public: true },
        })
      }
    })

    //end
  })
}
