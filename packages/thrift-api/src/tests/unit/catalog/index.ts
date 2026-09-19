import chai from 'chai'
import {
  createProduct,
  ProductDraft,
} from '#src/context/catalog/domain/product.js'

chai.should()

const validDraft: ProductDraft = {
  title: 'Wireless Headphones',
  categoryId: 1,
  subcategoryId: 1,
  description: ['Noise cancelling', '20-hour battery'],
  variants: [
    {
      sku: 'WH-BLK',
      basePrice: 1500000,
      quantityAvailable: 10,
      options: [{ optionName: 'COLOR', value: 'BLACK' }],
    },
  ],
}

export default () => {
  describe('createProduct', () => {
    it('returns a normalized product for a valid draft', () => {
      const result = createProduct(validDraft)
      result.kind.should.equal('ok')
      if (result.kind === 'ok') {
        result.value.title.should.equal('Wireless Headphones')
        result.value.variants.length.should.equal(1)
      }
    })

    it('trims variant SKUs', () => {
      const result = createProduct({
        ...validDraft,
        variants: [{ ...validDraft.variants[0], sku: '  WH-BLK  ' }],
      })
      result.kind.should.equal('ok')
      if (result.kind === 'ok') {
        result.value.variants[0].sku.should.equal('WH-BLK')
      }
    })

    it('rejects an empty title', () => {
      const result = createProduct({ ...validDraft, title: '   ' })
      result.kind.should.equal('err')
      if (result.kind === 'err') {
        result.error.code.should.equal('INVALID_INPUT')
      }
    })

    it('rejects a product with no variants', () => {
      const result = createProduct({ ...validDraft, variants: [] })
      result.kind.should.equal('err')
      if (result.kind === 'err') {
        result.error.code.should.equal('INVALID_INPUT')
      }
    })

    it('rejects duplicate SKUs', () => {
      const result = createProduct({
        ...validDraft,
        variants: [
          validDraft.variants[0],
          {
            ...validDraft.variants[0],
            options: [{ optionName: 'COLOR', value: 'WHITE' }],
          },
        ],
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') {
        result.error.code.should.equal('INVALID_INPUT')
      }
    })

    it('rejects a negative base price', () => {
      const result = createProduct({
        ...validDraft,
        variants: [{ ...validDraft.variants[0], basePrice: -1 }],
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') {
        result.error.code.should.equal('INVALID_INPUT')
      }
    })

    it('rejects a non-integer base price', () => {
      const result = createProduct({
        ...validDraft,
        variants: [{ ...validDraft.variants[0], basePrice: 1500.5 }],
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') {
        result.error.code.should.equal('INVALID_INPUT')
      }
    })

    it('rejects a negative quantity', () => {
      const result = createProduct({
        ...validDraft,
        variants: [{ ...validDraft.variants[0], quantityAvailable: -1 }],
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') {
        result.error.code.should.equal('INVALID_INPUT')
      }
    })

    it('rejects a variant with no options', () => {
      const result = createProduct({
        ...validDraft,
        variants: [{ ...validDraft.variants[0], options: [] }],
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') {
        result.error.code.should.equal('INVALID_INPUT')
      }
    })
  })
}
