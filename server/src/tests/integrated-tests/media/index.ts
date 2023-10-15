import db from '../../../db/index.js'
import { AccountData } from '../../../types-and-interfaces/account.js'
import {
  Product,
  ProductMedia,
} from '../../../types-and-interfaces/products.js'
import { StoresData } from '../../../types-and-interfaces/stores-data.js'
import { registration } from '../helper-functions/auth/index.js'
import {
  testCreateProduct,
  testUploadProductMedia,
} from '../helper-functions/products/index.js'
import { testCreateStore } from '../helper-functions/store/index.js'
import { testCreateVendor } from '../helper-functions/vendor/index.js'

// globals
const mediaRoute = '/v1/media'
const vendorsRoute = '/v1/account/vendor/'
const storesRoute = '/v1/stores'
const productsRoute = '/v1/products'
let token: string, server: string
let storeIds = new Map<number, number[] | null>()

export default function ({
  accountInfo,
  stores: vendorStores,
  products,
  productMedia,
}: {
  accountInfo: AccountData
  stores: StoresData[]
  products: Product[]
  productMedia: ProductMedia[][]
}) {
  describe('Product media management', () => {
    before(async function () {
      //  Set the server url
      server = process.env.SERVER!
      // Delete all user accounts
      await db.query({
        text: 'delete from user_accounts where email=$1 or phone=$2',
        values: [accountInfo.email, accountInfo.phone],
      })
      ;({
        body: { token },
      } = await registration(server, accountInfo))
      // Create a vendor account for the user
      await testCreateVendor(server, token, vendorsRoute)
      // Create a store for the vendor
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
    after(async () => {
      await db.query({
        text: 'delete from user_accounts where email=$1 or phone=$2',
        values: [accountInfo.email, accountInfo.phone],
      })
    })

    // Create a product for the store
    it("it should add the product's media to an existing product", async () => {
      let productIds: number[] | null
      for ([, productIds] of storeIds.entries()) {
        if (productIds)
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
      }
    })
  })
}
