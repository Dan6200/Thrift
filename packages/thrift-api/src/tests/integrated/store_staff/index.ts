import chai from 'chai'
import chaiHttp from 'chai-http'
import {
  testAddStaff,
  testListStaff,
  testUpdateStaff,
  testRemoveStaff,
  testAddStaffUnauthorized,
  testListStaffUnauthorized,
  testUpdateStaffUnauthorized,
  testRemoveStaffUnauthorized,
} from './definitions/index.js'
import { ProfileRequestData } from '../../../types/profile/index.js'
import { createUserForTesting } from '../helpers/create-user.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import { createStoreForTesting } from '../helpers/create-store.js'
import { StoreStaff } from '#src/types/store_staff.js'

// globals
chai.use(chaiHttp).should()

type StaffContext = {
  ownerToken: string
  staffToken: string
  ownerId: string
  staffId: string
  storeId: number
}

export default function ({
  vendorInfo,
  customerInfo,
}: {
  vendorInfo: ProfileRequestData
  customerInfo: ProfileRequestData
}) {
  // Each test seeds its own owner + staff member + store, so no test depends on
  // state left behind by another.
  const withStoreStaff = async (
    fn: (ctx: StaffContext) => Promise<void>,
  ): Promise<void> => {
    const ownerId = await createUserForTesting(vendorInfo)
    const staffId = await createUserForTesting(customerInfo)
    const ownerToken = await signInForTesting(vendorInfo)
    const staffToken = await signInForTesting(customerInfo)
    try {
      const response = await createStoreForTesting(ownerToken)
      const storeId = response.body.store_id
      await fn({ ownerToken, staffToken, ownerId, staffId, storeId })
    } finally {
      await deleteUserForTesting(ownerId)
      await deleteUserForTesting(staffId)
    }
  }

  const addStaff = async (
    ctx: StaffContext,
    role: StoreStaff['role'] = 'editor',
  ) => {
    const expectedData: StoreStaff = { staff_id: ctx.staffId, role }
    await testAddStaff({
      token: ctx.ownerToken,
      params: { storeId: ctx.storeId },
      body: expectedData,
      expectedData,
    })
  }

  describe('Testing /store_staff endpoints', () => {
    it('it should allow the store owner to add a staff member', () =>
      withStoreStaff(async (ctx) => {
        await addStaff(ctx)
      }))

    it('it should not allow a non-owner to add a staff member', () =>
      withStoreStaff(async (ctx) => {
        await testAddStaffUnauthorized({
          token: ctx.staffToken,
          params: { storeId: ctx.storeId },
          body: { staff_id: ctx.ownerId, role: 'admin' },
        })
      }))

    it('it should allow the store owner to list staff members', () =>
      withStoreStaff(async (ctx) => {
        await addStaff(ctx)
        await testListStaff({
          token: ctx.ownerToken,
          params: { storeId: ctx.storeId },
        })
      }))

    it('it should allow a staff member to list staff members', () =>
      withStoreStaff(async (ctx) => {
        await addStaff(ctx)
        await testListStaff({
          token: ctx.staffToken,
          params: { storeId: ctx.storeId },
        })
      }))

    it("it should allow the store owner to update a staff member's role", () =>
      withStoreStaff(async (ctx) => {
        await addStaff(ctx)
        const expectedData: StoreStaff = {
          staff_id: ctx.staffId,
          role: 'viewer',
        }
        await testUpdateStaff({
          token: ctx.ownerToken,
          params: { storeId: ctx.storeId, staffId: ctx.staffId },
          body: { role: 'viewer' },
          expectedData,
        })
      }))

    it("it should not allow a non-owner to update a staff member's role", () =>
      withStoreStaff(async (ctx) => {
        await addStaff(ctx)
        await testUpdateStaffUnauthorized({
          token: ctx.staffToken,
          params: { storeId: ctx.storeId, staffId: ctx.staffId },
          body: { role: 'admin' },
        })
      }))

    it('it should allow the store owner to remove a staff member', () =>
      withStoreStaff(async (ctx) => {
        await addStaff(ctx)
        await testRemoveStaff({
          token: ctx.ownerToken,
          params: { storeId: ctx.storeId, staffId: ctx.staffId },
        })
      }))

    it('it should not allow a non-owner to remove a staff member', () =>
      withStoreStaff(async (ctx) => {
        await addStaff(ctx)
        await testRemoveStaffUnauthorized({
          token: ctx.staffToken,
          params: { storeId: ctx.storeId, staffId: ctx.staffId },
        })
      }))
  })
}
