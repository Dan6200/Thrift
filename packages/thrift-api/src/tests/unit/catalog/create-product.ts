import chai from 'chai'
import {
  createProductUseCase,
  CreateProductCommand,
} from '#src/context/catalog/application/create-product.js'
import {
  ProductRepository,
  PersistedProduct,
  PersistedVariant,
} from '#src/context/catalog/ports/product-repository.js'

chai.should()

const validCommand: CreateProductCommand = {
  title: 'Wireless Headphones',
  categoryId: 1,
  subcategoryId: 1,
  description: ['Noise cancelling'],
  variants: [
    {
      sku: 'WH-BLK',
      basePrice: 1500000,
      quantityAvailable: 10,
      options: [{ optionName: 'COLOR', value: 'BLACK' }],
    },
  ],
  vendorId: 'v1',
  storeId: 1,
}

const notImplemented = (): never => {
  throw new Error('not implemented in test fake')
}

const fakeRepository: ProductRepository = {
  async create({ product, vendorId, storeId }): Promise<PersistedProduct> {
    return {
      product_id: 1,
      title: product.title,
      description: product.description,
      vendor_id: vendorId,
      store_id: storeId,
      category_id: product.categoryId,
      subcategory_id: product.subcategoryId,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
      variants: product.variants.map((variant, index) => ({
        variant_id: index + 1,
        sku: variant.sku,
        base_price: variant.basePrice,
        quantity_available: variant.quantityAvailable,
        options: variant.options.map((option, optionIndex) => ({
          option_id: optionIndex + 1,
          option_value_id: optionIndex + 1,
          option_name: option.optionName,
          value: option.value,
        })),
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      })),
    }
  },
  async getAll(): Promise<unknown> {
    return null
  },
  async getById(): Promise<unknown> {
    return null
  },
  async update(): Promise<PersistedProduct> {
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
}

export default () => {
  describe('createProductUseCase', () => {
    it('persists a valid command and returns the persisted product', async () => {
      const result = await createProductUseCase(fakeRepository)(validCommand)
      result.kind.should.equal('ok')
      if (result.kind === 'ok') {
        result.value.product_id.should.equal(1)
        result.value.variants.length.should.equal(1)
      }
    })

    it('returns a domain error for invalid input without calling the repository', async () => {
      let called = false
      const repository: ProductRepository = {
        ...fakeRepository,
        create: async (input) => {
          called = true
          return fakeRepository.create(input)
        },
      }
      const result = await createProductUseCase(repository)({
        ...validCommand,
        variants: [],
      })
      result.kind.should.equal('err')
      called.should.equal(false)
    })
  })
}
