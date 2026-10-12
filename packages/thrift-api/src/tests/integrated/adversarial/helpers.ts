import chai from 'chai'
import chaiHttp from 'chai-http'
import { randomUUID } from 'node:crypto'
import { createUserForTesting } from '../helpers/create-user.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import { loadUserData } from '../helpers/load-data.js'

chai.use(chaiHttp)

export const SERVER = process.env.SERVER!

/** HTTP verb helper that returns the raw chai response (no status assertion). */
export function request(
  verb: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  opts: {
    token?: string
    body?: unknown
    query?: Record<string, unknown>
  } = {},
) {
  let req = chai.request(SERVER)[verb](path)
  if (opts.query) req = req.query(opts.query as any)
  if (opts.body !== undefined) req = req.send(opts.body as any)
  if (opts.token) req = req.auth(opts.token, { type: 'bearer' })
  return req
}

/**
 * Assert a request was rejected, without over-constraining the exact 4xx code.
 * Different implementations legitimately use 400 vs 404 vs 409 vs 422 for the
 * same business-rule violation; the contract only requires *rejection*.
 */
export function expectRejected(
  response: any,
  allowed: number[],
  label: string,
) {
  const status = response.status
  const body = (() => {
    try {
      return JSON.stringify(response.body)
    } catch {
      return String(response.body)
    }
  })()
  chai
    .expect(
      allowed,
      `${label}: expected one of [${allowed.join(', ')}] but got ${status} — body: ${body}`,
    )
    .to.include(status)
}

/** Assert the response carried an explicit error message (non-empty string). */
export function expectErrorMessage(response: any, label: string) {
  chai.expect(response.body, `${label}: response should carry an error body`).to
    .not.be.null
  const msg =
    response.body?.message ?? response.body?.error ?? response.body?.detail
  if (msg !== undefined) {
    chai
      .expect(msg, `${label}: error message should be a non-empty string`)
      .to.be.a('string')
  }
}

const vendorFixture = loadUserData(
  'src/tests/integrated/data/users/vendors/user-aliyu',
)

/**
 * Build a fresh userInfo fixture with a globally unique email/phone so it can
 * never collide with the fixed fixtures created by the main suite.
 */
export function uniqueUser(
  base: any,
  opts: { isVendor?: boolean; isCustomer?: boolean } = {},
) {
  const suffix = randomUUID()
  return {
    ...base,
    first_name: base.first_name,
    last_name: base.last_name,
    email: `adv-${suffix}@example.com`,
    phone: `2348${Math.floor(10000000 + Math.random() * 90000000)}`,
    password: base.password,
    dob: base.dob,
    country: base.country,
    is_customer: opts.isCustomer ?? base.is_customer ?? true,
    is_vendor: opts.isVendor ?? base.is_vendor ?? false,
  }
}

/** Create + sign-in a user, returning { id, token }. Caller must clean up id. */
export async function seedUser(userInfo: any): Promise<{
  id: string
  token: string
}> {
  const id = await createUserForTesting(userInfo)
  const token = await signInForTesting(userInfo)
  return { id, token }
}

/** A minimal, valid product payload; overrides replace any field wholesale. */
export function productPayload(overrides: Record<string, unknown> = {}) {
  return {
    title: 'Adversarial Product',
    category_id: 1,
    subcategory_id: 1,
    description: ['adversarial description'],
    variants: [
      {
        sku: `ADV-${randomUUID().slice(0, 8)}`,
        base_price: 1000,
        quantity_available: 10,
        options: [{ option_name: 'COLOR', value: 'BLACK' }],
      },
    ],
    ...overrides,
  }
}

/** Create a store for a token and return its id. */
export async function seedStore(token: string): Promise<number> {
  const res = await chai
    .request(SERVER)
    .post('/v1/stores')
    .auth(token, { type: 'bearer' })
    .send(vendorFixture.listOfStores[0])
  res.should.have.status(201)
  return res.body.store_id as number
}

/** Create a product under a store and return the parsed body. */
export async function seedProduct(
  token: string,
  storeId: number,
  overrides: Record<string, unknown> = {},
) {
  const res = await chai
    .request(SERVER)
    .post('/v1/products')
    .auth(token, { type: 'bearer' })
    .query({ storeId })
    .send(productPayload(overrides))
  res.should.have.status(201)
  return res.body
}

/** Full catalog+identity seed for a vendor owning one store with one product. */
export async function seedVendorCatalog() {
  const vendor = await seedUser(
    uniqueUser(vendorFixture.userInfo, { isVendor: true }),
  )
  const storeId = await seedStore(vendor.token)
  const product = await seedProduct(vendor.token, storeId)
  const variant = product.variants[0]
  return {
    vendor,
    storeId,
    productId: product.product_id as number,
    variantId: variant.variant_id as number,
    variantPrice: variant.base_price as number,
    variantStock: variant.quantity_available as number,
  }
}
