import chai from 'chai'
import { cancelOrderUseCase } from '#src/context/orders/application/cancel-order.js'
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

const cancelledOrder: PersistedOrder = {
  order_id: 1,
  customer_id: 'c1',
  store_id: 1,
  delivery_info_id: null,
  order_date: '2026-01-01T00:00:00.000Z',
  total_amount: 3000,
  status: 'cancelled',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  items: [],
}

export default () => {
  describe('cancelOrderUseCase', () => {
    it('rejects a non-existent order with NOT_FOUND', async () => {
      let cancelCalled = false
      const repo = makeOrderRepo({
        getOrderForMutation: async () => null,
        cancelOrder: async () => {
          cancelCalled = true
          return cancelledOrder
        },
      })
      const result = await cancelOrderUseCase(repo)({
        customerId: 'c1',
        orderId: 1,
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('NOT_FOUND')
      cancelCalled.should.equal(false)
    })

    it('rejects cancelling a non-pending order with CONFLICT', async () => {
      let cancelCalled = false
      const repo = makeOrderRepo({
        getOrderForMutation: async () => ({
          ...pendingOrder,
          status: 'shipped',
        }),
        cancelOrder: async () => {
          cancelCalled = true
          return cancelledOrder
        },
      })
      const result = await cancelOrderUseCase(repo)({
        customerId: 'c1',
        orderId: 1,
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('CONFLICT')
      cancelCalled.should.equal(false)
    })

    it('cancels a pending order', async () => {
      let cancelledId = -1
      const repo = makeOrderRepo({
        getOrderForMutation: async () => pendingOrder,
        cancelOrder: async (orderId) => {
          cancelledId = orderId
          return cancelledOrder
        },
      })
      const result = await cancelOrderUseCase(repo)({
        customerId: 'c1',
        orderId: 1,
      })
      result.kind.should.equal('ok')
      cancelledId.should.equal(1)
    })
  })
}
