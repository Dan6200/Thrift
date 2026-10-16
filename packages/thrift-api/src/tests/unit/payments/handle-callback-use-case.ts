import chai from 'chai'
import { handleCallbackUseCase } from '#src/context/payments/application/handle-callback.js'
import { makePaymentRepo, makePaymentGateway } from './support.js'

chai.should()

export default () => {
  describe('handleCallbackUseCase', () => {
    it('rejects an unknown reference with NOT_FOUND', async () => {
      let verifyCalled = false
      const gateway = makePaymentGateway({
        verifyTransaction: async () => {
          verifyCalled = true
          return { status: true, data: { status: 'success' } }
        },
      })
      const repo = makePaymentRepo({ getOrderByReference: async () => null })

      const result = await handleCallbackUseCase(
        repo,
        gateway,
      )({
        reference: 'ref',
      })

      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('NOT_FOUND')
      verifyCalled.should.equal(false)
    })

    it('reports already_processed for an already non-pending order', async () => {
      let verifyCalled = false
      const gateway = makePaymentGateway({
        verifyTransaction: async () => {
          verifyCalled = true
          return { status: true, data: { status: 'success' } }
        },
      })
      const repo = makePaymentRepo({
        getOrderByReference: async () => ({
          order_id: 1,
          status: 'processing',
        }),
      })

      const result = await handleCallbackUseCase(
        repo,
        gateway,
      )({
        reference: 'ref',
      })

      result.kind.should.equal('ok')
      if (result.kind === 'ok') {
        const value = result.value as {
          order_id: number
          already_processed: boolean
        }
        value.order_id.should.equal(1)
        value.already_processed.should.equal(true)
      }
      verifyCalled.should.equal(false)
    })

    it('marks the order failed when verification is not successful', async () => {
      let failedOrderId = -1
      let processedCalled = false
      const gateway = makePaymentGateway({
        verifyTransaction: async () => ({
          status: true,
          data: { status: 'failed' },
        }),
      })
      const repo = makePaymentRepo({
        getOrderByReference: async () => ({ order_id: 7, status: 'pending' }),
        markOrderFailed: async (orderId) => {
          failedOrderId = orderId
          return 1
        },
        markOrderProcessingByOrderId: async () => {
          processedCalled = true
          return 1
        },
      })

      const result = await handleCallbackUseCase(
        repo,
        gateway,
      )({
        reference: 'ref',
      })

      result.kind.should.equal('ok')
      failedOrderId.should.equal(7)
      processedCalled.should.equal(false)
    })

    it('marks the order processing on a successful verification', async () => {
      let processedOrderId = -1
      let failedCalled = false
      const gateway = makePaymentGateway({
        verifyTransaction: async () => ({
          status: true,
          data: { status: 'success' },
        }),
      })
      const repo = makePaymentRepo({
        getOrderByReference: async () => ({ order_id: 7, status: 'pending' }),
        markOrderProcessingByOrderId: async (orderId) => {
          processedOrderId = orderId
          return 1
        },
        markOrderFailed: async () => {
          failedCalled = true
          return 1
        },
      })

      const result = await handleCallbackUseCase(
        repo,
        gateway,
      )({
        reference: 'ref',
      })

      result.kind.should.equal('ok')
      processedOrderId.should.equal(7)
      failedCalled.should.equal(false)
    })
  })
}
