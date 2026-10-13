import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import {
  request,
  expectRejected,
  expectErrorMessage,
  uniqueUser,
  seedUser,
  seedStore,
  seedVendorCatalog,
  productPayload,
} from './helpers.js'
import { userFactory, vendorFactory } from '../factories/index.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'

chai.use(chaiHttp).should()

const { BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT } =
  StatusCodes

const customerFixture = userFactory({ isCustomer: true })

export default function () {
  describe('Adversarial: Catalog (products/variants)', () => {
    let vendor: { id: string; token: string }
    let storeId: number

    before(async () => {
      vendor = await seedUser(
        uniqueUser(vendorFactory().userInfo, {
          isVendor: true,
        }),
      )
      storeId = await seedStore(vendor.token)
    })

    after(async () => {
      await deleteUserForTesting(vendor.id)
    })

    const postProduct = (body: unknown) =>
      request('post', '/v1/products', {
        token: vendor.token,
        query: { storeId },
        body,
      })

    describe('validation bypass', () => {
      it('rejects a product with a missing title', async () => {
        const { title, ...body } = productPayload()
        const res = await postProduct(body)
        expectRejected(res, [BAD_REQUEST], 'missing title')
        expectErrorMessage(res, 'missing title')
      })

      it('rejects a product with a whitespace-only title', async () => {
        const res = await postProduct(productPayload({ title: '   ' }))
        expectRejected(res, [BAD_REQUEST], 'whitespace title')
      })

      it('rejects a product with a non-array description', async () => {
        const res = await postProduct(
          productPayload({ description: 'not an array' }),
        )
        expectRejected(res, [BAD_REQUEST], 'non-array description')
      })

      it('rejects a product with a missing category_id', async () => {
        const { category_id, ...body } = productPayload()
        const res = await postProduct(body)
        expectRejected(res, [BAD_REQUEST], 'missing category_id')
      })

      it('rejects a product with no variants', async () => {
        const res = await postProduct(productPayload({ variants: [] }))
        expectRejected(res, [BAD_REQUEST], 'empty variants')
      })

      it('rejects a variant with a missing sku', async () => {
        const payload = productPayload()
        const { sku, ...variant } = payload.variants[0]
        const res = await postProduct({ ...payload, variants: [variant] })
        expectRejected(res, [BAD_REQUEST], 'missing sku')
      })

      it('rejects a variant with a whitespace-only sku', async () => {
        const payload = productPayload()
        const res = await postProduct({
          ...payload,
          variants: [{ ...payload.variants[0], sku: '   ' }],
        })
        expectRejected(res, [BAD_REQUEST], 'whitespace sku')
      })

      it('rejects a variant with no options', async () => {
        const payload = productPayload()
        const res = await postProduct({
          ...payload,
          variants: [{ ...payload.variants[0], options: [] }],
        })
        expectRejected(res, [BAD_REQUEST], 'variant with no options')
      })

      it('rejects an option with a missing option_name', async () => {
        const payload = productPayload()
        const { option_name, ...option } = payload.variants[0].options[0]
        const res = await postProduct({
          ...payload,
          variants: [{ ...payload.variants[0], options: [option] }],
        })
        expectRejected(res, [BAD_REQUEST], 'option missing option_name')
      })

      it('rejects an option with a missing value', async () => {
        const payload = productPayload()
        const { value, ...option } = payload.variants[0].options[0]
        const res = await postProduct({
          ...payload,
          variants: [{ ...payload.variants[0], options: [option] }],
        })
        expectRejected(res, [BAD_REQUEST], 'option missing value')
      })

      it('rejects a camelCase basePrice field (snake_case is required)', async () => {
        const payload = productPayload()
        const variant = payload.variants[0]
        const { base_price, ...variantRest } = variant
        const res = await postProduct({
          ...payload,
          variants: [{ ...variantRest, basePrice: 1000 }],
        })
        expectRejected(res, [BAD_REQUEST], 'camelCase basePrice')
      })
    })

    describe('boundary & precision', () => {
      it('rejects a negative base price', async () => {
        const payload = productPayload()
        const res = await postProduct({
          ...payload,
          variants: [{ ...payload.variants[0], base_price: -1 }],
        })
        expectRejected(res, [BAD_REQUEST], 'negative base price')
      })

      it('rejects a non-integer base price', async () => {
        const payload = productPayload()
        const res = await postProduct({
          ...payload,
          variants: [{ ...payload.variants[0], base_price: 100.5 }],
        })
        expectRejected(res, [BAD_REQUEST], 'non-integer base price')
      })

      it('rejects a fractional-string base price', async () => {
        const payload = productPayload()
        const res = await postProduct({
          ...payload,
          variants: [{ ...payload.variants[0], base_price: '100.50' }],
        })
        expectRejected(res, [BAD_REQUEST], 'fractional-string base price')
      })

      it('rejects a negative quantity available', async () => {
        const payload = productPayload()
        const res = await postProduct({
          ...payload,
          variants: [{ ...payload.variants[0], quantity_available: -5 }],
        })
        expectRejected(res, [BAD_REQUEST], 'negative quantity')
      })

      it('rejects a non-integer quantity available', async () => {
        const payload = productPayload()
        const res = await postProduct({
          ...payload,
          variants: [{ ...payload.variants[0], quantity_available: 1.5 }],
        })
        expectRejected(res, [BAD_REQUEST], 'non-integer quantity')
      })
    })

    describe('uniqueness', () => {
      it('rejects duplicate SKUs within a single product', async () => {
        const payload = productPayload()
        const dup = {
          ...payload.variants[0],
          options: [{ option_name: 'COLOR', value: 'WHITE' }],
        }
        const res = await postProduct({
          ...payload,
          variants: [payload.variants[0], dup],
        })
        expectRejected(res, [BAD_REQUEST, CONFLICT], 'duplicate SKU')
      })
    })

    describe('authorization', () => {
      it('rejects product creation without a token', async () => {
        const res = await request('post', '/v1/products', {
          query: { storeId },
          body: productPayload(),
        })
        res.should.have.status(UNAUTHORIZED)
      })

      it('rejects product creation by a non-vendor customer', async () => {
        const customer = await seedUser(uniqueUser(customerFixture.userInfo))
        try {
          const res = await request('post', '/v1/products', {
            token: customer.token,
            query: { storeId },
            body: productPayload(),
          })
          res.should.have.status(FORBIDDEN)
        } finally {
          await deleteUserForTesting(customer.id)
        }
      })

      it('rejects a vendor from another store reading this store product', async () => {
        // Two stores under the same vendor; product lives in store 1.
        const catalog = await seedVendorCatalog()
        try {
          const res = await request(
            'get',
            `/v1/products/${catalog.productId}`,
            {
              token: vendor.token,
              query: { storeId },
            },
          )
          // `storeId` here is the *first* vendor's store, not the catalog's.
          expectRejected(
            res,
            [FORBIDDEN, NOT_FOUND],
            'cross-store product read',
          )
        } finally {
          await deleteUserForTesting(catalog.vendor.id)
        }
      })
    })

    describe('param coercion & robustness', () => {
      it('rejects a non-numeric product id', async () => {
        const res = await request('get', '/v1/products/not-a-number', {
          token: vendor.token,
          query: { storeId },
        })
        expectRejected(res, [BAD_REQUEST, NOT_FOUND], 'non-numeric product id')
      })

      it('rejects a non-numeric variant id', async () => {
        const res = await request(
          'get',
          '/v1/products/1/variants/not-a-number',
          { token: vendor.token, query: { storeId } },
        )
        expectRejected(res, [BAD_REQUEST, NOT_FOUND], 'non-numeric variant id')
      })

      it('returns not found for a non-existent product id', async () => {
        const res = await request('get', '/v1/products/999999999', {
          token: vendor.token,
          query: { storeId },
        })
        res.should.have.status(NOT_FOUND)
      })

      it('returns not found for a non-existent variant id', async () => {
        const catalog = await seedVendorCatalog()
        try {
          const res = await request(
            'get',
            `/v1/products/${catalog.productId}/variants/999999999`,
            {
              token: catalog.vendor.token,
              query: { storeId: catalog.storeId },
            },
          )
          res.should.have.status(NOT_FOUND)
        } finally {
          await deleteUserForTesting(catalog.vendor.id)
        }
      })
    })

    describe('variant update adversarial', () => {
      it('rejects updating a variant to a negative quantity', async () => {
        const catalog = await seedVendorCatalog()
        try {
          const res = await request(
            'patch',
            `/v1/products/${catalog.productId}/variants/${catalog.variantId}`,
            {
              token: catalog.vendor.token,
              query: { storeId: catalog.storeId },
              body: { quantity_available: -3 },
            },
          )
          expectRejected(res, [BAD_REQUEST], 'negative variant quantity update')
        } finally {
          await deleteUserForTesting(catalog.vendor.id)
        }
      })

      it('rejects updating a variant to a non-integer base price', async () => {
        const catalog = await seedVendorCatalog()
        try {
          const res = await request(
            'patch',
            `/v1/products/${catalog.productId}/variants/${catalog.variantId}`,
            {
              token: catalog.vendor.token,
              query: { storeId: catalog.storeId },
              body: { base_price: 10.99 },
            },
          )
          expectRejected(
            res,
            [BAD_REQUEST],
            'non-integer variant base price update',
          )
        } finally {
          await deleteUserForTesting(catalog.vendor.id)
        }
      })

      it('rejects creating a variant with a duplicate SKU', async () => {
        const catalog = await seedVendorCatalog()
        try {
          const existingSku = (
            await request('get', `/v1/products/${catalog.productId}`, {
              token: catalog.vendor.token,
              query: { storeId: catalog.storeId },
            })
          ).body.variants[0].sku
          const res = await request(
            'post',
            `/v1/products/${catalog.productId}/variants`,
            {
              token: catalog.vendor.token,
              query: { storeId: catalog.storeId },
              body: {
                sku: existingSku,
                base_price: 500,
                quantity_available: 1,
                options: [{ option_name: 'COLOR', value: 'BLUE' }],
              },
            },
          )
          // CONTRACT FINDING: the variant-add endpoint does not pre-check SKU
          // uniqueness, so the DB unique constraint surfaces as a raw 500
          // (leaking schema details) instead of a client-facing 400/409.
          // This test intentionally fails until the duplicate is rejected
          // gracefully.
          expectRejected(res, [BAD_REQUEST, CONFLICT], 'duplicate variant SKU')
        } finally {
          await deleteUserForTesting(catalog.vendor.id)
        }
      })
    })
  })
}
