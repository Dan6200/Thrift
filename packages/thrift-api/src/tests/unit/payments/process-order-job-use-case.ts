import chai from 'chai'
import { processOrderJobUseCase } from '#src/context/payments/application/process-order-job.js'
import { makePaymentRepo } from './support.js'

chai.should()

const baseData = {
  reference: 'ref_1',
  metadata: { order_id: 7 },
}

export default () => {
  describe('processOrderJobUseCase', () => {
    it('ignores a non charge.success event', async () => {
      let processingCalled = false
      const repo = makePaymentRepo({
        markOrderProcessingByReference: async () => {
          processingCalled = true
          return null
        },
      })
      const result = await processOrderJobUseCase(repo)({
        eventType: 'transfer.success',
        data: baseData,
      })
      result.kind.should.equal('ok')
      processingCalled.should.equal(false)
    })

    it('ignores an event with no order_id', async () => {
      let processingCalled = false
      const repo = makePaymentRepo({
        markOrderProcessingByReference: async () => {
          processingCalled = true
          return null
        },
      })
      const result = await processOrderJobUseCase(repo)({
        eventType: 'charge.success',
        data: { reference: 'ref_1', metadata: {} },
      })
      result.kind.should.equal('ok')
      processingCalled.should.equal(false)
    })

    it('returns NOT_FOUND when the order/reference is unknown', async () => {
      const repo = makePaymentRepo({
        markOrderProcessingByReference: async () => null,
        getOrderByIdAndReference: async () => null,
      })
      const result = await processOrderJobUseCase(repo)({
        eventType: 'charge.success',
        data: baseData,
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('NOT_FOUND')
    })

    it('reports already_processed for an order that is no longer pending', async () => {
      const repo = makePaymentRepo({
        markOrderProcessingByReference: async () => null,
        getOrderByIdAndReference: async () => ({
          order_id: 7,
          status: 'processing',
        }),
      })
      const result = await processOrderJobUseCase(repo)({
        eventType: 'charge.success',
        data: baseData,
      })
      result.kind.should.equal('ok')
    })

    it('marks the order processing on success', async () => {
      let processedRef: string | undefined
      const persisted = { order_id: 7, status: 'processing' }
      const repo = makePaymentRepo({
        markOrderProcessingByReference: async (_orderId, reference) => {
          processedRef = reference
          return persisted
        },
      })
      const result = await processOrderJobUseCase(repo)({
        eventType: 'charge.success',
        data: baseData,
      })
      result.kind.should.equal('ok')
      if (result.kind === 'ok') {
        ;(result.value as any).order.should.equal(persisted)
      }
      processedRef.should.equal('ref_1')
    })

    it('saves a reusable card when requested', async () => {
      let saved = false
      const repo = makePaymentRepo({
        markOrderProcessingByReference: async () => ({
          order_id: 7,
          status: 'processing',
        }),
        saveCard: async () => {
          saved = true
        },
      })
      const result = await processOrderJobUseCase(repo)({
        eventType: 'charge.success',
        data: {
          ...baseData,
          customer: { email: 'c@example.com' },
          authorization: { reusable: true, authorization_code: 'AUTH_x' },
          metadata: { order_id: 7, save_card: true, customer_id: 'c1' },
        },
      })
      result.kind.should.equal('ok')
      saved.should.equal(true)
    })
  })
}
