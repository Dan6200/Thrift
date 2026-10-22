//cspell:ignore cloudinary
import { ProfileRequestData } from '#src/types/profile/index.js'
import { ProductMediaUpload } from '#src/types/products.js'
import {
  testCreateProductMedia,
  testGetProductMedia,
  testUpdateProductMedia,
  testDeleteProductMedia,
} from './definitions.js'
import { deleteUserForTesting } from '../../helpers/delete-user.js'
import { createUserForTesting } from '../../helpers/create-user.js'
import { signInForTesting } from '../../helpers/signin-user.js'
import { createStoreForTesting } from '../../helpers/create-store.js'
import { createProductsForTesting } from '../../helpers/create-product.js'

const productMediaRoute = '/v1/media/products'
const server: string = process.env.SERVER!

type Ctx = {
  userInfo: ProfileRequestData
  token: string
  productId: number
  storeId: number
}

export default function ({
  userInfo,
  productMedia,
}: {
  userInfo: ProfileRequestData
  productMedia: ProductMediaUpload[][]
}) {
  // Each test seeds its own vendor, store, product and media, so no test
  // depends on state left behind by another.
  const withProduct = async (
    fn: (ctx: Ctx) => Promise<void>,
  ): Promise<void> => {
    const userId = await createUserForTesting(userInfo)
    const token = await signInForTesting(userInfo)
    try {
      const storeRes = await createStoreForTesting(token)
      const storeId = storeRes.body.store_id

      const productRequests = []
      for await (const req of createProductsForTesting(token, storeId, 1)) {
        productRequests.push(req)
      }
      const [productRes] = await Promise.all(productRequests)

      await fn({
        userInfo,
        token,
        productId: productRes.body.product_id,
        storeId,
      })
    } finally {
      await deleteUserForTesting(userId)
    }
  }

  // Upload one image per product-media group onto this test's product.
  const uploadSingleMedia = async (ctx: Ctx): Promise<string[]> => {
    const mediaIds: string[] = []
    for (const media of productMedia) {
      const [{ media_id }] = await testCreateProductMedia(
        server,
        productMediaRoute,
        media[0],
        ctx.userInfo,
        { product_id: ctx.productId, store_id: ctx.storeId },
      )
      mediaIds.push(media_id)
    }
    return mediaIds
  }

  it("should upload a single product's media", () =>
    withProduct(async (ctx) => {
      await uploadSingleMedia(ctx)
    }))

  it("should get the product's media", () =>
    withProduct(async (ctx) => {
      const mediaIds = await uploadSingleMedia(ctx)
      for (const mediaId of mediaIds) {
        await testGetProductMedia(
          server,
          `${productMediaRoute}/${mediaId}`,
          ctx.token,
        )
      }
    }))

  it("should update the product's media", () =>
    withProduct(async (ctx) => {
      const mediaIds = await uploadSingleMedia(ctx)
      for (const [index, media] of productMedia.entries()) {
        await testUpdateProductMedia(
          server,
          `${productMediaRoute}/${mediaIds[index]}`,
          media[0],
          ctx.token,
          ctx.storeId,
        )
      }
    }))

  it("should delete the product's media", () =>
    withProduct(async (ctx) => {
      const mediaIds = await uploadSingleMedia(ctx)
      for (const mediaId of mediaIds) {
        await testDeleteProductMedia(
          server,
          `${productMediaRoute}/${mediaId}`,
          ctx.token,
          ctx.storeId,
        )
      }
    }))

  it("should bulk upload the product's media", () =>
    withProduct(async (ctx) => {
      for (const media of productMedia) {
        await testCreateProductMedia(
          server,
          productMediaRoute,
          media,
          ctx.userInfo,
          {
            product_id: ctx.productId,
            store_id: ctx.storeId,
          },
        )
      }
    }))
}
