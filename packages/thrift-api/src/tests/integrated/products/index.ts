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
import { ProfileRequestData } from '../../../types/profile/index.js'
import assert from 'assert'
import { createUserForTesting } from '../helpers/create-user.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import { createStoreForTesting } from '../helpers/create-store.js'
import { productFactory, variantFactory } from '../factories/index.js'

chai.use(chaiHttp).should()

export default function ({ userInfo }: { userInfo: ProfileRequestData }) {
  // Each test seeds its own vendor, store and products via factories, so no
  // test depends on state left behind by another.
  const withVendor = async (
    fn: (token: string, storeId: number) => Promise<void>,
  ) => {
    const userId = await createUserForTesting(userInfo)
    const token = await signInForTesting(userInfo)
    try {
      const storeRes = await createStoreForTesting(token)
      await fn(token, storeRes.body.store_id)
    } finally {
      await deleteUserForTesting(userId)
    }
  }

  // A fresh catalog (products + partial updates + variants to create + updates).
  const catalog = () => {
    const products: ProductRequestData[] = [
      productFactory(),
      productFactory(),
      productFactory(),
    ]
    const productPartialUpdate: UpdateProductRequestData[] = [
      { category_id: 2 },
      { description: ['An updated description'] },
      {
        title: `Renamed Product ${Math.random().toString(36).slice(2, 8)}`,
        subcategory_id: 2,
      },
    ]
    const variantsToCreate = [
      variantFactory(),
      variantFactory(),
      variantFactory(),
    ]
    const variantUpdates = [
      {
        base_price: 3000,
        quantity_available: 8,
        inventory_change_reason: 'restock',
      },
      { base_price: 4000 },
    ]
    return { products, productPartialUpdate, variantsToCreate, variantUpdates }
  }

  const createProduct = async (
    token: string,
    storeId: number,
    body: ProductRequestData,
  ) =>
    testCreateProduct({ token, query: { storeId }, body, expectedData: body })

  it('creates products and reads them all back', () =>
    withVendor(async (token, storeId) => {
      const { products } = catalog()
      for (const product of products) {
        await createProduct(token, storeId, product)
      }
      await testGetAllProducts({ token, query: { storeId } })
    }))

  it('creates new variants for a product', () =>
    withVendor(async (token, storeId) => {
      const { products, variantsToCreate } = catalog()
      const { product_id } = await createProduct(token, storeId, products[0])
      for (const variant of variantsToCreate) {
        await testPostVariant({
          params: { productId: product_id },
          query: { storeId },
          body: variant,
          token,
          expectedData: variant,
        })
      }
    }))

  it('updates the newly created variants', () =>
    withVendor(async (token, storeId) => {
      const { products, variantsToCreate, variantUpdates } = catalog()
      const { product_id } = await createProduct(token, storeId, products[0])
      const variantIds: number[] = []
      for (const variant of variantsToCreate) {
        const { variant_id } = await testPostVariant({
          params: { productId: product_id },
          query: { storeId },
          body: variant,
          token,
          expectedData: variant,
        })
        variantIds.push(variant_id)
      }
      assert(variantUpdates.length === 2)
      for (const [i, variantUpdate] of variantUpdates.entries()) {
        await testUpdateVariant({
          params: { productId: product_id, variantId: variantIds[i] },
          query: { storeId },
          body: variantUpdate,
          token,
          expectedData: { ...variantsToCreate[i], ...variantUpdate },
        })
      }
    }))

  it('updates all the products a vendor has for sale', () =>
    withVendor(async (token, storeId) => {
      const { products, productPartialUpdate } = catalog()
      const productIds: number[] = []
      for (const product of products) {
        const { product_id } = await createProduct(token, storeId, product)
        productIds.push(product_id)
      }
      assert(productIds.length === productPartialUpdate.length)
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
    }))

  it('reflects product and variant modifications when retrieved', () =>
    withVendor(async (token, storeId) => {
      const {
        products,
        productPartialUpdate,
        variantsToCreate,
        variantUpdates,
      } = catalog()

      const productIds: number[] = []
      for (const product of products) {
        const { product_id } = await createProduct(token, storeId, product)
        productIds.push(product_id)
      }

      const variantIds: number[] = []
      for (const variant of variantsToCreate) {
        const { variant_id } = await testPostVariant({
          params: { productId: productIds[0] },
          query: { storeId },
          body: variant,
          token,
          expectedData: variant,
        })
        variantIds.push(variant_id)
      }
      for (const [i, variantUpdate] of variantUpdates.entries()) {
        await testUpdateVariant({
          params: { productId: productIds[0], variantId: variantIds[i] },
          query: { storeId },
          body: variantUpdate,
          token,
          expectedData: { ...variantsToCreate[i], ...variantUpdate },
        })
      }
      for (const [idx, productId] of productIds.entries()) {
        const { variants, ...updated } = {
          ...products[idx],
          ...productPartialUpdate[idx],
        }
        await testUpdateProduct({
          token,
          params: { productId },
          body: productPartialUpdate[idx],
          query: { storeId },
          expectedData: updated,
        })
      }

      for (const [i, productId] of productIds.entries()) {
        const expected = {
          ...products[i],
          ...productPartialUpdate[i],
          variants:
            i === 0
              ? [
                  ...products[0].variants,
                  ...variantsToCreate.map((v, j) =>
                    variantUpdates[j] ? { ...v, ...variantUpdates[j] } : v,
                  ),
                ]
              : products[i].variants,
        }
        await testGetProduct({
          token,
          params: { productId },
          query: { storeId },
          expectedData: expected as unknown as ProductResponseData,
        })
      }
    }))

  it('deletes the newly created variants', () =>
    withVendor(async (token, storeId) => {
      const { products, variantsToCreate } = catalog()
      const { product_id } = await createProduct(token, storeId, products[0])
      for (const variant of variantsToCreate) {
        const { variant_id } = await testPostVariant({
          params: { productId: product_id },
          query: { storeId },
          body: variant,
          token,
          expectedData: variant,
        })
        await testDeleteVariant({
          query: { storeId },
          params: { productId: product_id, variantId: variant_id },
          token,
        })
      }
    }))

  it('deletes all products and fails to retrieve them', () =>
    withVendor(async (token, storeId) => {
      const { products } = catalog()
      const productIds: number[] = []
      for (const product of products) {
        const { product_id } = await createProduct(token, storeId, product)
        productIds.push(product_id)
      }
      for (const productId of productIds) {
        await testDeleteProduct({
          token,
          params: { productId },
          query: { storeId },
        })
      }
      for (const productId of productIds) {
        await testGetNonExistentProduct({
          query: { storeId },
          token,
          params: { productId },
        })
      }
    }))
}
