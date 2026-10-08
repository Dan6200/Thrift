import { knex } from '#src/db/index.js'
import NotFoundError from '#src/errors/not-found.js'
import { StaffRepository } from '../ports/staff-repository.js'

export const knexStaffRepository: StaffRepository = {
  async add({ storeId, staffId, role }) {
    const [newStaff] = await knex('store_staff')
      .insert({ store_id: storeId, staff_id: staffId, role })
      .returning('*')
    return newStaff
  },

  async list(storeId) {
    return knex('store_staff').where({ store_id: storeId }).select('*')
  },

  async update({ storeId, staffId, role }) {
    const [updatedStaff] = await knex('store_staff')
      .where({ store_id: storeId, staff_id: staffId })
      .update({ role })
      .returning('*')

    if (!updatedStaff) {
      throw new NotFoundError('Staff member not found for this store.')
    }
    return updatedStaff
  },

  async remove({ storeId, staffId }) {
    const deletedCount = await knex('store_staff')
      .where({ store_id: storeId, staff_id: staffId })
      .del()

    if (deletedCount === 0) {
      throw new NotFoundError('Staff member not found for this store.')
    }
    return deletedCount
  },
}
