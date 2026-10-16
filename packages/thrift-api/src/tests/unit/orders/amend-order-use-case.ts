import chai from 'chai'
import { amendOrderUseCase } from '#src/context/orders/application/amend-order.js'
import {
  OrderForMutation,
  PersistedOrder,
} from '#src/context/orders/ports/order-repository.js'
import { makeOrderRepo } from './support.js'

chai.should()

const pendingOrder: OrderForMutation = {
  order_id: 1,
  status: 'pending',
  store_id: 1,
  items: [
    { order_item_id: 1, variant_id: 1, quantity: 3, price_at_purchase: 1000 },
  ],
}

const persistedOrder: PersistedOrder = {
  order_id: 1,
  customer_id: 'c1',
  store_id: 1,
  delivery_info_id: null,
  order_date: '2026-01-01T00:00:00.000Z',
  total_amount: 4000,
  status: 'pending',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  items: [],
}

export default () => {
  describe('amendOrderUseCase', () => {
    it('rejects a non-existent order with NOT_FOUND', async () => {
      let amendCalled = false
      const repo = makeOrderRepo({
        getOrderForMutation: async () => null,
        amendOrder: async () => {
          amendCalled = true
          return persistedOrder
        },
      })
      const result = await amendOrderUseCase(repo)({
        customerId: 'c1',
        orderId: 1,
        items: [{ variantId: 1, quantity: 1 }],
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('NOT_FOUND')
      amendCalled.should.equal(false)
    })

    it('rejects amending a non-pending order with CONFLICT', async () => {
      let amendCalled = false
      const repo = makeOrderRepo({
        getOrderForMutation: async () => ({
          ...pendingOrder,
          status: 'processing',
        }),
        amendOrder: async () => {
          amendCalled = true
          return persistedOrder
        },
      })
      const result = await amendOrderUseCase(repo)({
        customerId: 'c1',
        orderId: 1,
        items: [{ variantId: 1, quantity: 1 }],
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('CONFLICT')
      amendCalled.should.equal(false)
    })

    it('rejects an empty items list', async () => {
      let amendCalled = false
      const repo = makeOrderRepo({
        getOrderForMutation: async () => pendingOrder,
        getVariantPrices: async () => new Map([[1, 1000]]),
        getAvailableStock: async () => new Map([[1, 10]]),
        amendOrder: async () => {
          amendCalled = true
          return persistedOrder
        },
      })
      const result = await amendOrderUseCase(repo)({
        customerId: 'c1',
        orderId: 1,
        items: [],
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('INVALID_INPUT')
      amendCalled.should.equal(false)
    })

    it('amends a pending order with the recomputed total', async () => {
      let amended: any = null
      const repo = makeOrderRepo({
        getOrderForMutation: async () => pendingOrder,
        getVariantPrices: async () => new Map([[1, 1000]]),
        getAvailableStock: async () => new Map([[1, 2]]),
        amendOrder: async (input) => {
          amended = input
          return persistedOrder
        },
      })
      const result = await amendOrderUseCase(repo)({
        customerId: 'c1',
        orderId: 1,
        items: [{ variantId: 1, quantity: 4 }],
      })
      result.kind.should.equal('ok')
      amended.should.not.equal(null)
      amended.totalAmount.should.equal(4000)
    })

    it("credits the order's own held quantity when checking stock", async () => {
      // The order already holds 3; available stock is 2 => effective stock 5.
      const repo = makeOrderRepo({
        getOrderForMutation: async () => pendingOrder,
        getVariantPrices: async () => new Map([[1, 1000]]),
        getAvailableStock: async () => new Map([[1, 2]]),
        amendOrder: async () => persistedOrder,
      })
      const allowed = await amendOrderUseCase(repo)({
        customerId: 'c1',
        orderId: 1,
        items: [{ variantId: 1, quantity: 5 }],
      })
      allowed.kind.should.equal('ok')

      const tooMany = await amendOrderUseCase(repo)({
        customerId: 'c1',
        orderId: 1,
        items: [{ variantId: 1, quantity: 6 }],
      })
      tooMany.kind.should.equal('err')
      if (tooMany.kind === 'err')
        tooMany.error.code.should.equal('INVALID_INPUT')
    })
  })
}
