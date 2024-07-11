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

export default function ({ userInfo }: { userInfo: UserRequestData }) {
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
    if (uidToDelete) await knex('users').where('uid', uidToDelete).del()
    // Delete all users from firebase auth
    await auth
      .deleteUser(uidToDelete)
      .catch((error: Error) =>
        console.error(`failed to delete user with uid ${uidToDelete}: ${error}`)
      )
  })

  let token: string
  let uidToDelete: string
  const vendorsRoute = '/v1/users/vendors/'
  const productsRoute = '/v1/products'
  const productIds: number[] = []

  describe('Testing Retrieving Publicly accessible Products', async function () {
    it('it should retrieve all the products', async () => {
      await testGetAllProductsPublic({
        server,
        token,
        path: productsRoute,
        query: { public: true },
      })
    })

    it('it should retrieve a specific product without authentication', async () => {
      for (const productId of productIds) {
        await testGetProductPublic({
          server,
          token,
          path: `${productsRoute}/${productId}`,
          query: { public: true },
        })
      }
    })

    //end
  })
}
