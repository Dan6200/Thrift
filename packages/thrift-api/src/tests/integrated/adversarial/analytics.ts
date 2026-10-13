import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import {
  request,
  expectRejected,
  uniqueUser,
  seedUser,
  seedStore,
} from './helpers.js'
import { userFactory, vendorFactory } from '../factories/index.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'

chai.use(chaiHttp).should()

const { BAD_REQUEST, NOT_FOUND, OK } = StatusCodes

const vendorFixture = vendorFactory()

export default function () {
  describe('Adversarial: Analytics query validation', () => {
    let vendor: { id: string; token: string }
    let storeId: number

    before(async () => {
      vendor = await seedUser(
        uniqueUser(vendorFixture.userInfo, { isVendor: true }),
      )
      storeId = await seedStore(vendor.token)
    })

    after(async () => {
      await deleteUserForTesting(vendor.id)
    })

    const getAnalytics = (endpoint: string, query: Record<string, unknown>) =>
      request('get', `/v1/analytics/stores/${storeId}/${endpoint}`, {
        token: vendor.token,
        query,
      })

    describe('pagination & sort injection', () => {
      it('rejects an invalid interval', async () => {
        const res = await getAnalytics('revenue-trends', {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          interval: 'fortnight',
        })
        expectRejected(res, [BAD_REQUEST], 'invalid interval')
      })

      it('rejects an invalid sales-analytics type', async () => {
        const res = await getAnalytics('sales-analytics', {
          type: 'by-nothing',
        })
        expectRejected(res, [BAD_REQUEST], 'invalid type')
      })

      it('rejects an invalid sortBy', async () => {
        const res = await getAnalytics('sales-analytics', {
          type: 'by-product',
          sortBy: 'totallyBogusColumn',
        })
        expectRejected(res, [BAD_REQUEST], 'invalid sortBy')
      })

      it('rejects an invalid sortOrder', async () => {
        const res = await getAnalytics('sales-analytics', {
          type: 'by-product',
          sortOrder: 'sideways',
        })
        expectRejected(res, [BAD_REQUEST], 'invalid sortOrder')
      })

      it('rejects a negative offset', async () => {
        const res = await getAnalytics('sales-analytics', {
          type: 'by-product',
          offset: -1,
        })
        expectRejected(res, [BAD_REQUEST], 'negative offset')
      })

      it('rejects a negative limit', async () => {
        const res = await getAnalytics('sales-analytics', {
          type: 'by-product',
          limit: -5,
        })
        expectRejected(res, [BAD_REQUEST], 'negative limit')
      })

      it('rejects a non-numeric threshold', async () => {
        const res = await getAnalytics('low-stock-products', {
          threshold: 'lots',
        })
        expectRejected(res, [BAD_REQUEST], 'non-numeric threshold')
      })

      it('rejects an invalid locationType', async () => {
        const res = await getAnalytics('customers-by-location', {
          locationType: 'planet',
        })
        expectRejected(res, [BAD_REQUEST], 'invalid locationType')
      })
    })

    describe('date range robustness', () => {
      it('rejects a startDate after endDate', async () => {
        const res = await getAnalytics('kpis', {
          startDate: '2024-12-31',
          endDate: '2024-01-01',
        })
        expectRejected(res, [BAD_REQUEST], 'startDate after endDate')
      })
    })

    describe('param coercion', () => {
      it('rejects a non-numeric storeId in the path', async () => {
        const res = await request(
          'get',
          '/v1/analytics/stores/not-a-number/kpis',
          { token: vendor.token },
        )
        expectRejected(res, [BAD_REQUEST, NOT_FOUND], 'non-numeric storeId')
      })
    })
  })
}
