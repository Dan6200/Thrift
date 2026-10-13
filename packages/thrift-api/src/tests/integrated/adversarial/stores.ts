import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { randomUUID } from 'node:crypto'
import {
  request,
  expectRejected,
  expectErrorMessage,
  uniqueUser,
  seedUser,
  seedStore,
  productPayload,
} from './helpers.js'
import { userFactory, vendorFactory } from '../factories/index.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'

chai.use(chaiHttp).should()

const { BAD_REQUEST, NOT_FOUND, FORBIDDEN, CONFLICT, CREATED, OK } = StatusCodes

const vendorFixture = vendorFactory()
const customerFixture = userFactory({ isCustomer: true })

export default function () {
  describe('Adversarial: Stores & Staff', () => {
    let vendorA: { id: string; token: string }
    let vendorB: { id: string; token: string }
    let staffUser: { id: string; token: string }
    let storeA: number
    let storeB: number

    before(async () => {
      vendorA = await seedUser(
        uniqueUser(vendorFixture.userInfo, { isVendor: true }),
      )
      vendorB = await seedUser(
        uniqueUser(vendorFixture.userInfo, { isVendor: true }),
      )
      staffUser = await seedUser(uniqueUser(customerFixture.userInfo))
      storeA = await seedStore(vendorA.token)
      storeB = await seedStore(vendorB.token)
    })

    after(async () => {
      await deleteUserForTesting(vendorA.id)
      await deleteUserForTesting(vendorB.id)
      await deleteUserForTesting(staffUser.id)
    })

    describe('store validation', () => {
      it('rejects creating a store with a missing store_name', async () => {
        const { store_name, ...body } = vendorFixture.listOfStores[0]
        const res = await request('post', '/v1/stores', {
          token: vendorA.token,
          body,
        })
        expectRejected(res, [BAD_REQUEST], 'missing store_name')
        expectErrorMessage(res, 'missing store_name')
      })

      it('rejects creating a store with a missing store_address', async () => {
        const { store_address, ...body } = vendorFixture.listOfStores[0]
        const res = await request('post', '/v1/stores', {
          token: vendorA.token,
          body,
        })
        expectRejected(res, [BAD_REQUEST], 'missing store_address')
      })
    })

    describe('cross-vendor store isolation', () => {
      it('prevents a vendor from reading another vendor store', async () => {
        const res = await request('get', `/v1/stores/${storeA}`, {
          token: vendorB.token,
        })
        expectRejected(res, [FORBIDDEN, NOT_FOUND], 'cross-vendor store read')
      })

      it('prevents a vendor from updating another vendor store', async () => {
        const res = await request('patch', `/v1/stores/${storeA}`, {
          token: vendorB.token,
          body: { store_name: 'Hijacked' },
        })
        expectRejected(res, [FORBIDDEN, NOT_FOUND], 'cross-vendor store update')
      })

      it('prevents a vendor from deleting another vendor store', async () => {
        const res = await request('delete', `/v1/stores/${storeA}`, {
          token: vendorB.token,
        })
        expectRejected(res, [FORBIDDEN, NOT_FOUND], 'cross-vendor store delete')
      })
    })

    describe('staff validation & uniqueness', () => {
      it('rejects adding a staff member with an invalid role', async () => {
        const res = await request('post', `/v1/stores/${storeA}/staff`, {
          token: vendorA.token,
          body: { staff_id: staffUser.id, role: 'superadmin' },
        })
        expectRejected(res, [BAD_REQUEST], 'invalid staff role')
        expectErrorMessage(res, 'invalid staff role')
      })

      it('rejects adding the same staff member twice', async () => {
        const body = { staff_id: staffUser.id, role: 'editor' }
        const first = await request('post', `/v1/stores/${storeA}/staff`, {
          token: vendorA.token,
          body,
        })
        first.should.have.status(CREATED)
        const dup = await request('post', `/v1/stores/${storeA}/staff`, {
          token: vendorA.token,
          body,
        })
        // CONTRACT FINDING: re-adding the same staff member surfaces the DB
        // unique constraint as a raw 500 instead of a client-facing 400/409.
        // This test intentionally fails until the duplicate is rejected
        // gracefully.
        expectRejected(dup, [BAD_REQUEST, CONFLICT], 'duplicate staff member')
      })

      it('rejects updating a staff member to an invalid role', async () => {
        const res = await request(
          'patch',
          `/v1/stores/${storeA}/staff/${staffUser.id}`,
          { token: vendorA.token, body: { role: 'root' } },
        )
        expectRejected(res, [BAD_REQUEST], 'invalid role update')
      })

      it('rejects removing a non-existent staff member', async () => {
        const res = await request(
          'delete',
          `/v1/stores/${storeA}/staff/${randomUUID()}`,
          { token: vendorA.token },
        )
        expectRejected(res, [NOT_FOUND], 'remove non-existent staff')
      })
    })

    describe('viewer role write restrictions', () => {
      let viewerUser: { id: string; token: string }

      before(async () => {
        // A dedicated, fresh user avoids role pollution from the uniqueness
        // tests above (which already registered `staffUser` as an editor).
        viewerUser = await seedUser(uniqueUser(customerFixture.userInfo))
        const added = await request('post', `/v1/stores/${storeA}/staff`, {
          token: vendorA.token,
          body: { staff_id: viewerUser.id, role: 'viewer' },
        })
        added.should.have.status(CREATED)
      })

      after(async () => {
        await deleteUserForTesting(viewerUser.id)
      })

      it('prevents a viewer from updating the store', async () => {
        const res = await request('patch', `/v1/stores/${storeA}`, {
          token: viewerUser.token,
          body: { store_name: 'Viewer write attempt' },
        })
        expectRejected(res, [FORBIDDEN], 'viewer store update')
      })

      it('prevents a viewer from deleting the store', async () => {
        const res = await request('delete', `/v1/stores/${storeA}`, {
          token: viewerUser.token,
        })
        expectRejected(res, [FORBIDDEN], 'viewer store delete')
      })

      it('prevents a viewer from creating a product in the store', async () => {
        const res = await request('post', '/v1/products', {
          token: viewerUser.token,
          query: { storeId: storeA },
          body: productPayload(),
        })
        expectRejected(res, [FORBIDDEN], 'viewer product create')
      })
    })
  })
}
