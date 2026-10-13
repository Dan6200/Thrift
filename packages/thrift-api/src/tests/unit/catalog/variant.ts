import chai from 'chai'
import {
  createVariant,
  validateVariantUpdate,
} from '#src/context/catalog/domain/variant.js'
import { Variant } from '#src/context/catalog/domain/product.js'

chai.should()

const validVariant: Variant = {
  sku: 'WH-BLK',
  basePrice: 1500000,
  quantityAvailable: 10,
  options: [{ optionName: 'COLOR', value: 'BLACK' }],
}

export default () => {
  describe('catalog domain variant', () => {
    describe('createVariant', () => {
      it('returns a normalized variant for a valid input', () => {
        const r = createVariant(validVariant)
        r.kind.should.equal('ok')
        if (r.kind === 'ok') {
          r.value.sku.should.equal('WH-BLK')
        }
      })

      it('trims the SKU', () => {
        const r = createVariant({ ...validVariant, sku: '  WH-BLK  ' })
        r.kind.should.equal('ok')
        if (r.kind === 'ok') {
          r.value.sku.should.equal('WH-BLK')
        }
      })

      it('rejects a whitespace-only SKU', () => {
        const r = createVariant({ ...validVariant, sku: '   ' })
        r.kind.should.equal('err')
        if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
      })

      it('accepts a zero base price', () => {
        const r = createVariant({ ...validVariant, basePrice: 0 })
        r.kind.should.equal('ok')
      })

      it('rejects a negative base price', () => {
        const r = createVariant({ ...validVariant, basePrice: -1 })
        r.kind.should.equal('err')
        if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
      })

      it('rejects a non-integer base price', () => {
        const r = createVariant({ ...validVariant, basePrice: 100.5 })
        r.kind.should.equal('err')
        if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
      })

      it('accepts a zero quantity', () => {
        const r = createVariant({ ...validVariant, quantityAvailable: 0 })
        r.kind.should.equal('ok')
      })

      it('rejects a negative quantity', () => {
        const r = createVariant({ ...validVariant, quantityAvailable: -1 })
        r.kind.should.equal('err')
        if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
      })

      it('rejects a non-integer quantity', () => {
        const r = createVariant({ ...validVariant, quantityAvailable: 1.5 })
        r.kind.should.equal('err')
        if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
      })

      it('rejects a variant with no options', () => {
        const r = createVariant({ ...validVariant, options: [] })
        r.kind.should.equal('err')
        if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
      })
    })

    describe('validateVariantUpdate', () => {
      it('accepts an empty update', () => {
        const r = validateVariantUpdate({})
        r.kind.should.equal('ok')
      })

      it('accepts a valid partial update', () => {
        const r = validateVariantUpdate({ basePrice: 2000 })
        r.kind.should.equal('ok')
      })

      it('rejects a negative base price', () => {
        const r = validateVariantUpdate({ basePrice: -1 })
        r.kind.should.equal('err')
        if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
      })

      it('rejects a non-integer base price', () => {
        const r = validateVariantUpdate({ basePrice: 10.5 })
        r.kind.should.equal('err')
      })

      it('rejects a negative quantity', () => {
        const r = validateVariantUpdate({
          quantityAvailable: -1,
          inventoryChangeReason: 'adjustment',
        })
        r.kind.should.equal('err')
        if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
      })

      it('rejects a non-integer quantity', () => {
        const r = validateVariantUpdate({
          quantityAvailable: 1.5,
          inventoryChangeReason: 'adjustment',
        })
        r.kind.should.equal('err')
      })

      it('rejects a quantity change without an inventory change reason', () => {
        const r = validateVariantUpdate({ quantityAvailable: 5 })
        r.kind.should.equal('err')
        if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
      })

      it('accepts a quantity change with an inventory change reason', () => {
        const r = validateVariantUpdate({
          quantityAvailable: 5,
          inventoryChangeReason: 'restock',
        })
        r.kind.should.equal('ok')
      })
    })
  })
}
