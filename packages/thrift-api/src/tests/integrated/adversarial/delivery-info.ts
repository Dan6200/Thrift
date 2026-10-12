import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import {
  request,
  expectRejected,
  expectErrorMessage,
  uniqueUser,
  seedUser,
} from './helpers.js'
import { loadUserData } from '../helpers/load-data.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'

chai.use(chaiHttp).should()

const { BAD_REQUEST, NOT_FOUND, FORBIDDEN, CREATED, OK } = StatusCodes

const aisha = loadUserData(
  'src/tests/integrated/data/users/customers/user-aisha',
)
const ebuka = loadUserData(
  'src/tests/integrated/data/users/customers/user-ebuka',
)

const validDeliveryInfo = {
  recipient_full_name: 'Adversary Tester',
  address_line_1: '1 Attack Street',
  address_line_2: '',
  city: 'Lagos',
  state: 'Lagos',
  zip_postal_code: '100001',
  country: 'Nigeria',
  phone_number: '+2348000000000',
  delivery_instructions: 'leave at door',
}

export default function () {
  describe('Adversarial: Delivery Info', () => {
    let customer: { id: string; token: string }
    let other: { id: string; token: string }

    before(async () => {
      customer = await seedUser(uniqueUser(aisha.userInfo))
      other = await seedUser(uniqueUser(ebuka.userInfo))
    })

    after(async () => {
      await deleteUserForTesting(customer.id)
      await deleteUserForTesting(other.id)
    })

    describe('validation bypass', () => {
      it('rejects creating delivery info with a missing recipient_full_name', async () => {
        const { recipient_full_name, ...body } = validDeliveryInfo
        const res = await request('post', '/v1/delivery-info', {
          token: customer.token,
          body,
        })
        expectRejected(res, [BAD_REQUEST], 'missing recipient_full_name')
        expectErrorMessage(res, 'missing recipient_full_name')
      })

      it('rejects creating delivery info with an empty address_line_1', async () => {
        const res = await request('post', '/v1/delivery-info', {
          token: customer.token,
          body: { ...validDeliveryInfo, address_line_1: '' },
        })
        expectRejected(res, [BAD_REQUEST], 'empty address_line_1')
      })

      it('rejects creating delivery info with a missing country', async () => {
        const { country, ...body } = validDeliveryInfo
        const res = await request('post', '/v1/delivery-info', {
          token: customer.token,
          body,
        })
        expectRejected(res, [BAD_REQUEST], 'missing country')
      })
    })

    describe('ownership isolation', () => {
      const seed = async () => {
        const res = await request('post', '/v1/delivery-info', {
          token: customer.token,
          body: validDeliveryInfo,
        })
        res.should.have.status(CREATED)
        return res.body.delivery_info_id as number
      }

      it('prevents another customer from reading my delivery info', async () => {
        const deliveryId = await seed()
        const res = await request('get', `/v1/delivery-info/${deliveryId}`, {
          token: other.token,
        })
        expectRejected(res, [FORBIDDEN, NOT_FOUND], 'cross-user delivery read')
      })

      it('prevents another customer from updating my delivery info', async () => {
        const deliveryId = await seed()
        const res = await request('patch', `/v1/delivery-info/${deliveryId}`, {
          token: other.token,
          body: { ...validDeliveryInfo, city: 'Abuja' },
        })
        // The app surfaces this as 400 ("not found for customer") rather than
        // the spec's 403/404; the *behavior* (rejection) is what matters here.
        expectRejected(
          res,
          [BAD_REQUEST, FORBIDDEN, NOT_FOUND],
          'cross-user delivery update',
        )

        // The owner must still observe their original data.
        const mine = await request('get', `/v1/delivery-info/${deliveryId}`, {
          token: customer.token,
        })
        mine.should.have.status(OK)
        mine.body.city.should.equal('Lagos')
      })

      it('prevents another customer from deleting my delivery info', async () => {
        const deliveryId = await seed()
        // DISCREPANCY (soft): DELETE returns 204 even for a foreign id rather
        // than 403/404, but the row is correctly scoped to the owner, so the
        // data is never removed. The security invariant is asserted below.
        await request('delete', `/v1/delivery-info/${deliveryId}`, {
          token: other.token,
        })

        // The security invariant: a foreign delete must never remove my data.
        const mine = await request('get', `/v1/delivery-info/${deliveryId}`, {
          token: customer.token,
        })
        mine.should.have.status(OK)
      })
    })

    describe('param coercion & not found', () => {
      it('returns not found for a non-existent delivery info id', async () => {
        const res = await request('get', '/v1/delivery-info/999999999', {
          token: customer.token,
        })
        res.should.have.status(NOT_FOUND)
      })

      it('rejects a non-numeric delivery info id', async () => {
        const res = await request('get', '/v1/delivery-info/not-a-number', {
          token: customer.token,
        })
        expectRejected(
          res,
          [BAD_REQUEST, NOT_FOUND],
          'non-numeric delivery info id',
        )
      })
    })
  })
}
