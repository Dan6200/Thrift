import chai from 'chai'
import { updateVariantUseCase } from '#src/context/catalog/application/update-variant.js'
import {
  ProductRepository,
  PersistedVariant,
} from '#src/context/catalog/ports/product-repository.js'

chai.should()

const notImplemented = (): never => {
  throw new Error('not implemented in test fake')
}

const persistedVariant: PersistedVariant = {
  variant_id: 1,
  sku: 'SKU-1',
  base_price: 1000,
  quantity_available: 5,
  options: [],
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
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
    return persistedVariant
  },
  async removeVariant(): Promise<void> {
    return undefined
  },
  ...overrides,
})

export default () => {
  describe('updateVariantUseCase', () => {
    it('rejects a quantity change without an inventory change reason', async () => {
      let updateCalled = false
      const repo = makeRepo({
        updateVariant: async () => {
          updateCalled = true
          return persistedVariant
        },
      })
      const result = await updateVariantUseCase(repo)({
        productId: 1,
        variantId: 1,
        storeId: 1,
        changes: { quantityAvailable: 5 },
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('INVALID_INPUT')
      updateCalled.should.equal(false)
    })

    it('rejects a negative quantity without touching the repository', async () => {
      let updateCalled = false
      const repo = makeRepo({
        updateVariant: async () => {
          updateCalled = true
          return persistedVariant
        },
      })
      const result = await updateVariantUseCase(repo)({
        productId: 1,
        variantId: 1,
        storeId: 1,
        changes: { quantityAvailable: -1, inventoryChangeReason: 'adjustment' },
      })
      result.kind.should.equal('err')
      updateCalled.should.equal(false)
    })

    it('persists a valid update and returns the updated variant', async () => {
      let received: unknown = undefined
      const repo = makeRepo({
        updateVariant: async (input) => {
          received = input
          return persistedVariant
        },
      })
      const result = await updateVariantUseCase(repo)({
        productId: 1,
        variantId: 1,
        storeId: 1,
        changes: { quantityAvailable: 5, inventoryChangeReason: 'restock' },
      })
      result.kind.should.equal('ok')
      received.should.not.equal(undefined)
    })
  })
}
