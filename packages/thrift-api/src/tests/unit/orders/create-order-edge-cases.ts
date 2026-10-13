import chai from 'chai'
import {
  createOrder,
  OrderDraft,
  VariantPrice,
  AvailableStock,
} from '#src/context/orders/domain/order.js'

chai.should()

const priceOf: VariantPrice = (variantId) =>
  variantId === 1 ? 1000 : variantId === 2 ? 2500 : undefined
const stockOf: AvailableStock = (variantId) =>
  variantId === 1 ? 10 : variantId === 2 ? 5 : 0

export default () => {
  describe('createOrder (domain) edge cases', () => {
    it('computes totalAmount as the sum of price × quantity across items', () => {
      const draft: OrderDraft = {
        customerId: 'c1',
        storeId: 1,
        items: [
          { variantId: 1, quantity: 2 },
          { variantId: 2, quantity: 3 },
        ],
      }
      const r = createOrder(draft, priceOf, stockOf)
      r.kind.should.equal('ok')
      if (r.kind === 'ok') {
        r.value.totalAmount.should.equal(1000 * 2 + 2500 * 3)
        r.value.status.should.equal('pending')
        r.value.items[0].priceAtPurchase.should.equal(1000)
        r.value.items[1].priceAtPurchase.should.equal(2500)
      }
    })

    it('rejects an order where a later item exceeds stock', () => {
      const draft: OrderDraft = {
        customerId: 'c1',
        storeId: 1,
        items: [
          { variantId: 1, quantity: 1 },
          { variantId: 2, quantity: 6 }, // stock is 5
        ],
      }
      const r = createOrder(draft, priceOf, stockOf)
      r.kind.should.equal('err')
      if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
    })

    it('rejects a non-integer quantity', () => {
      const draft: OrderDraft = {
        customerId: 'c1',
        storeId: 1,
        items: [{ variantId: 1, quantity: 1.5 }],
      }
      const r = createOrder(draft, priceOf, stockOf)
      r.kind.should.equal('err')
    })

    it('rejects an order containing an unknown variant alongside a known one', () => {
      const draft: OrderDraft = {
        customerId: 'c1',
        storeId: 1,
        items: [
          { variantId: 1, quantity: 1 },
          { variantId: 99, quantity: 1 },
        ],
      }
      const r = createOrder(draft, priceOf, stockOf)
      r.kind.should.equal('err')
      if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
    })
  })
}
