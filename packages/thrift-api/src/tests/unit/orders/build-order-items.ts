import chai from 'chai'
import {
  buildOrderItems,
  OrderItemInput,
  VariantPrice,
  AvailableStock,
} from '#src/context/orders/domain/order.js'

chai.should()

const priceOf: VariantPrice = (variantId) =>
  variantId === 1 ? 1000 : variantId === 2 ? 2500 : undefined
const stockOf: AvailableStock = (variantId) =>
  variantId === 1 ? 10 : variantId === 2 ? 5 : 0

export default () => {
  describe('orders domain buildOrderItems', () => {
    it('builds items with a price snapshot and sums totalAmount', () => {
      const items: OrderItemInput[] = [
        { variantId: 1, quantity: 2 },
        { variantId: 2, quantity: 3 },
      ]
      const r = buildOrderItems(items, priceOf, stockOf)
      r.kind.should.equal('ok')
      if (r.kind === 'ok') {
        r.value.items[0].priceAtPurchase.should.equal(1000)
        r.value.items[1].priceAtPurchase.should.equal(2500)
        r.value.totalAmount.should.equal(1000 * 2 + 2500 * 3)
      }
    })

    it('rejects an empty items list', () => {
      const r = buildOrderItems([], priceOf, stockOf)
      r.kind.should.equal('err')
      if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
    })

    it('rejects a zero quantity', () => {
      const r = buildOrderItems(
        [{ variantId: 1, quantity: 0 }],
        priceOf,
        stockOf,
      )
      r.kind.should.equal('err')
      if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
    })

    it('rejects a negative quantity', () => {
      const r = buildOrderItems(
        [{ variantId: 1, quantity: -1 }],
        priceOf,
        stockOf,
      )
      r.kind.should.equal('err')
    })

    it('rejects a non-integer quantity', () => {
      const r = buildOrderItems(
        [{ variantId: 1, quantity: 1.5 }],
        priceOf,
        stockOf,
      )
      r.kind.should.equal('err')
    })

    it('rejects an unknown variant', () => {
      const r = buildOrderItems(
        [{ variantId: 99, quantity: 1 }],
        priceOf,
        stockOf,
      )
      r.kind.should.equal('err')
      if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
    })

    it('rejects a quantity above available stock', () => {
      const r = buildOrderItems(
        [{ variantId: 2, quantity: 6 }],
        priceOf,
        stockOf,
      )
      r.kind.should.equal('err')
      if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
    })

    it('accepts a quantity exactly equal to available stock', () => {
      const r = buildOrderItems(
        [{ variantId: 2, quantity: 5 }],
        priceOf,
        stockOf,
      )
      r.kind.should.equal('ok')
    })
  })
}
