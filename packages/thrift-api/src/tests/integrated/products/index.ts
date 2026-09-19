import chai from 'chai'
import chaiHttp from 'chai-http'
import {
  ProductRequestData,
  ProductResponseData,
  UpdateProductRequestData,
} from '../../../types/products.js'
import {
  testCreateProduct,
  testGetAllProducts,
  testGetProduct,
  testUpdateProduct,
  testDeleteProduct,
  testGetNonExistentProduct,
  testPostVariant,
  testUpdateVariant,
  testDeleteVariant,
} from './definitions/index.js'
import { loadYamlFile } from '../helpers/load-data.js'

const {
  expectedDataAfterVariantAdditionAndUpdates,
  variantsToCreate,
  variantUpdates,
} = loadYamlFile(
  'src/tests/integrated/data/users/vendors/user-aliyu/products/index.yml',
)
import { ProfileRequestData } from '../../../types/profile/index.js'
import assert from 'assert'
import { createUserForTesting } from '../helpers/create-user.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import { createStoreForTesting } from '../helpers/create-store.js'

// globals
chai.use(chaiHttp).should()

export default function ({
  userInfo,
  products,
  productPartialUpdate,
}: {
  userInfo?: ProfileRequestData
  products?: ProductRequestData[]
  productPartialUpdate?: UpdateProductRequestData[]
}) {
  let token: string
  let storeId: number
  let userId: string
  const productIds: number[] = []
  const variantIds: number[] = []

  before(async () => {
    userId = await createUserForTesting(userInfo)
    token = await signInForTesting(userInfo)
    const response = await createStoreForTesting(token)
    ;({ store_id: storeId } = response.body)
  })

  it('it should Add a couple products to each store', async () => {
    for (const product of products) {
      const { product_id } = await testCreateProduct({
        body: product,
        query: { storeId },
        token,
        expectedData: product,
      })
      productIds.push(product_id)
    }
  })

  it('it should create new variants for the first product', async () => {
    const productId = productIds[0]
    for (const variant of variantsToCreate) {
      const { variant_id } = await testPostVariant({
        params: { productId },
        query: { storeId },
        body: variant,
        token,
        expectedData: variant,
      })
      variantIds.push(variant_id)
    }
  })

  it('it should update the newly created variants', async () => {
    const productId = productIds[0]
    assert(!!variantIds.length && !!variantUpdates.length)
    for (const [i, variantUpdate] of variantUpdates.entries()) {
      const expectedData = { ...variantsToCreate[i], ...variantUpdate }
      await testUpdateVariant({
        params: { productId, variantId: variantIds[i] },
        query: { storeId },
        body: variantUpdate,
        token,
        expectedData,
      })
    }
  })

  it('it should retrieve all the products and their variants', async () => {
    await testGetAllProducts({
      token,
      query: { storeId },
    })
  })

  it('it should update all the products a vendor has for sale', async () => {
    assert(
      !!productIds.length && productIds?.length === productPartialUpdate.length,
    )
    for (const [idx, productId] of productIds.entries()) {
      const { variants, ...expectedData } = {
        ...products[idx],
        ...productPartialUpdate[idx],
      }
      await testUpdateProduct({
        token,
        params: { productId },
        body: productPartialUpdate[idx],
        query: { storeId },
        expectedData,
      })
    }
  })

  it('it should retrieve a specific product and its variants. The return data should match updates in a synchronous test suite', async () => {
    assert(!!productIds.length)
    for (const [i, productId] of productIds.entries()) {
      await testGetProduct({
        token,
        params: { productId },
        query: { storeId },
        expectedData: expectedDataAfterVariantAdditionAndUpdates[
          i
        ] as unknown as ProductResponseData, // intentional typecast
      })
    }
  })

  it('it should delete the newly created variants', async () => {
    const productId = productIds[0]
    for (const variantId of variantIds) {
      await testDeleteVariant({
        query: { storeId },
        params: { productId, variantId },
        token,
      })
    }
  })

  it('it should delete all the product a vendor has for sale', async () => {
    assert(!!productIds.length)
    for (const productId of productIds)
      await testDeleteProduct({
        token,
        params: { productId },
        query: { storeId },
      })
  })

  it('it should fail to retrieve any of the deleted products', async () => {
    assert(!!productIds.length)
    for (const productId of productIds)
      await testGetNonExistentProduct({
        query: { storeId },
        token,
        params: { productId },
      })
  })

  after(async () => deleteUserForTesting(userId))
}
