import chai from 'chai'
import {
  createOrder,
  OrderDraft,
  VariantPrice,
  AvailableStock,
} from '#src/context/orders/domain/order.js'
import { createOrderUseCase } from '#src/context/orders/application/create-order.js'
import {
  OrderRepository,
  PersistedOrder,
} from '#src/context/orders/ports/order-repository.js'

chai.should()

const priceOf: VariantPrice = (variantId) =>
  variantId === 1 ? 1000 : undefined
const stockOf: AvailableStock = (variantId) => (variantId === 1 ? 10 : 0)

const validDraft: OrderDraft = {
  customerId: 'c1',
  storeId: 1,
  items: [{ variantId: 1, quantity: 2 }],
}

const fakeRepository: OrderRepository = {
  async storeExists(storeId) {
    return storeId === 1
  },
  async deliveryInfoBelongsTo(deliveryInfoId, customerId) {
    return deliveryInfoId === 1 && customerId === 'c1'
  },
  async getVariantPrices() {
    return new Map([[1, 1000]])
  },
  async getAvailableStock() {
    return new Map([[1, 10]])
  },
  async create({ order }): Promise<PersistedOrder> {
    return {
      order_id: 1,
      customer_id: order.customerId,
      store_id: order.storeId,
      delivery_info_id: order.deliveryInfoId ?? null,
      order_date: '2026-01-01T00:00:00.000Z',
      total_amount: order.totalAmount,
      status: order.status,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
      items: order.items.map((item, index) => ({
        order_item_id: index + 1,
        variant_id: item.variantId,
        quantity: item.quantity,
        price_at_purchase: item.priceAtPurchase,
      })),
    }
  },
  async getProfile() {
    return null
  },
  async hasStoreAccess() {
    return false
  },
  async getAllOrders() {
    return []
  },
  async getOrderById() {
    return null
  },
  async findReviewableItem() {
    return null
  },
}

export default () => {
  describe('createOrder (domain)', () => {
    it('computes the total from base prices', () => {
      const result = createOrder(validDraft, priceOf, stockOf)
      result.kind.should.equal('ok')
      if (result.kind === 'ok') {
        result.value.totalAmount.should.equal(2000)
        result.value.items[0].priceAtPurchase.should.equal(1000)
      }
    })

    it('rejects an empty order', () => {
      const result = createOrder({ ...validDraft, items: [] }, priceOf, stockOf)
      result.kind.should.equal('err')
    })

    it('rejects a non-positive quantity', () => {
      const result = createOrder(
        { ...validDraft, items: [{ variantId: 1, quantity: 0 }] },
        priceOf,
        stockOf,
      )
      result.kind.should.equal('err')
    })

    it('rejects an unknown variant', () => {
      const result = createOrder(
        { ...validDraft, items: [{ variantId: 99, quantity: 1 }] },
        priceOf,
        stockOf,
      )
      result.kind.should.equal('err')
    })

    it('rejects insufficient stock', () => {
      const result = createOrder(
        { ...validDraft, items: [{ variantId: 1, quantity: 11 }] },
        priceOf,
        stockOf,
      )
      result.kind.should.equal('err')
    })
  })

  describe('createOrderUseCase', () => {
    it('persists a valid order', async () => {
      const result = await createOrderUseCase(fakeRepository)({
        customerId: 'c1',
        storeId: 1,
        items: [{ variantId: 1, quantity: 2 }],
      })
      result.kind.should.equal('ok')
      if (result.kind === 'ok') {
        result.value.total_amount.should.equal(2000)
      }
    })

    it('returns NOT_FOUND for a missing store', async () => {
      const result = await createOrderUseCase(fakeRepository)({
        customerId: 'c1',
        storeId: 999,
        items: [{ variantId: 1, quantity: 1 }],
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') {
        result.error.code.should.equal('NOT_FOUND')
      }
    })

    it('returns INVALID_INPUT for invalid delivery info', async () => {
      const result = await createOrderUseCase(fakeRepository)({
        customerId: 'c1',
        storeId: 1,
        deliveryInfoId: 999,
        items: [{ variantId: 1, quantity: 1 }],
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') {
        result.error.code.should.equal('INVALID_INPUT')
      }
    })
  })
}
