import chai from 'chai'
import { createVariantUseCase } from '#src/context/catalog/application/create-variant.js'
import {
  ProductRepository,
  PersistedVariant,
} from '#src/context/catalog/ports/product-repository.js'
import { Variant } from '#src/context/catalog/domain/product.js'

chai.should()

const validVariant: Variant = {
  sku: 'NEW-SKU',
  basePrice: 1000,
  quantityAvailable: 5,
  options: [{ optionName: 'COLOR', value: 'RED' }],
}

const notImplemented = (): never => {
  throw new Error('not implemented in test fake')
}

const makeRepo = (
  overrides: Partial<ProductRepository> = {},
): ProductRepository => ({
  async create(): Promise<any> {
    return notImplemented()
  },
  async getAll(): Promise<unknown> {
    return null
  },
  async getById(): Promise<unknown> {
    return null
  },
  async update(): Promise<any> {
    return notImplemented()
  },
  async remove(): Promise<void> {
    return undefined
  },
  async getVariantBySku(): Promise<{ variant_id: number } | null> {
    return null
  },
  async createVariant(): Promise<PersistedVariant> {
    return notImplemented()
  },
  async updateVariant(): Promise<PersistedVariant> {
    return notImplemented()
  },
  async removeVariant(): Promise<void> {
    return undefined
  },
  ...overrides,
})

export default () => {
  describe('createVariantUseCase', () => {
    it('rejects an invalid variant without touching the repository', async () => {
      let createCalled = false
      const repo = makeRepo({
        createVariant: async () => {
          createCalled = true
          return notImplemented()
        },
      })
      const result = await createVariantUseCase(repo)({
        productId: 1,
        variant: { ...validVariant, basePrice: -1 },
      })
      result.kind.should.equal('err')
      createCalled.should.equal(false)
    })

    it('rejects a duplicate SKU with CONFLICT', async () => {
      let createCalled = false
      const repo = makeRepo({
        getVariantBySku: async () => ({ variant_id: 999 }),
        createVariant: async () => {
          createCalled = true
          return notImplemented()
        },
      })
      const result = await createVariantUseCase(repo)({
        productId: 1,
        variant: validVariant,
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('CONFLICT')
      createCalled.should.equal(false)
    })

    it('persists a valid, non-duplicate variant', async () => {
      const repo = makeRepo({
        createVariant: async () => ({
          variant_id: 1,
          sku: validVariant.sku,
          base_price: validVariant.basePrice,
          quantity_available: validVariant.quantityAvailable,
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-01T00:00:00.000Z',
        }),
      })
      const result = await createVariantUseCase(repo)({
        productId: 1,
        variant: validVariant,
      })
      result.kind.should.equal('ok')
    })
  })
}
