import chai from 'chai'
import { handleWebhookUseCase } from '#src/context/payments/application/handle-webhook.js'
import {
  makePaymentRepo,
  makePaymentGateway,
  makePublisher,
} from './support.js'

chai.should()

const chargeSuccessEvent = {
  id: 'evt_1',
  event: 'charge.success',
  data: { reference: 'ref_1', metadata: { order_id: 7 } },
}

export default () => {
  describe('handleWebhookUseCase', () => {
    it('rejects a request with no signature', async () => {
      let recordCalled = false
      const repo = makePaymentRepo({
        recordWebhook: async () => {
          recordCalled = true
          return 'recorded'
        },
      })
      const result = await handleWebhookUseCase(
        repo,
        makePaymentGateway(),
        makePublisher(),
      )({ rawBody: '{}', signature: '', event: chargeSuccessEvent })
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('INVALID_INPUT')
      recordCalled.should.equal(false)
    })

    it('rejects an invalid signature', async () => {
      let recordCalled = false
      const gateway = makePaymentGateway({ verifySignature: () => false })
      const repo = makePaymentRepo({
        recordWebhook: async () => {
          recordCalled = true
          return 'recorded'
        },
      })
      const result = await handleWebhookUseCase(
        repo,
        gateway,
        makePublisher(),
      )({ rawBody: '{}', signature: 'bad', event: chargeSuccessEvent })
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('INVALID_INPUT')
      recordCalled.should.equal(false)
    })

    it('rejects an event without an id', async () => {
      const repo = makePaymentRepo({
        recordWebhook: async () => 'recorded',
      })
      const result = await handleWebhookUseCase(
        repo,
        makePaymentGateway(),
        makePublisher(),
      )({
        rawBody: '{}',
        signature: 'sig',
        event: { event: 'charge.success', data: {} },
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('INVALID_INPUT')
    })

    it('short-circuits a duplicate event id', async () => {
      let processingCalled = false
      const repo = makePaymentRepo({
        recordWebhook: async () => 'duplicate',
        markOrderProcessing: async () => {
          processingCalled = true
          return 1
        },
      })
      const result = await handleWebhookUseCase(
        repo,
        makePaymentGateway(),
        makePublisher(),
      )({ rawBody: '{}', signature: 'sig', event: chargeSuccessEvent })
      result.kind.should.equal('ok')
      processingCalled.should.equal(false)
    })

    it('ignores an unhandled event type', async () => {
      let processingCalled = false
      const repo = makePaymentRepo({
        recordWebhook: async () => 'recorded',
        markOrderProcessing: async () => {
          processingCalled = true
          return 1
        },
      })
      const result = await handleWebhookUseCase(
        repo,
        makePaymentGateway(),
        makePublisher(),
      )({
        rawBody: '{}',
        signature: 'sig',
        event: { id: 'evt_2', event: 'transfer.success', data: {} },
      })
      result.kind.should.equal('ok')
      processingCalled.should.equal(false)
    })

    it('processes a charge.success event and publishes an event', async () => {
      let processedOrderId = -1
      let published = false
      const repo = makePaymentRepo({
        recordWebhook: async () => 'recorded',
        markOrderProcessing: async (orderId) => {
          processedOrderId = orderId
          return 1
        },
      })
      const publisher = makePublisher({
        publish: async () => {
          published = true
        },
      })
      const result = await handleWebhookUseCase(
        repo,
        makePaymentGateway(),
        publisher,
      )({ rawBody: '{}', signature: 'sig', event: chargeSuccessEvent })
      result.kind.should.equal('ok')
      processedOrderId.should.equal(7)
      published.should.equal(true)
    })

    it('does not publish when the order was already processed', async () => {
      let published = false
      const repo = makePaymentRepo({
        recordWebhook: async () => 'recorded',
        markOrderProcessing: async () => 0,
      })
      const publisher = makePublisher({
        publish: async () => {
          published = true
        },
      })
      const result = await handleWebhookUseCase(
        repo,
        makePaymentGateway(),
        publisher,
      )({ rawBody: '{}', signature: 'sig', event: chargeSuccessEvent })
      result.kind.should.equal('ok')
      published.should.equal(false)
    })
  })
}
