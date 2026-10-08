import { StaffRepository } from '../ports/staff-repository.js'

export const listStaffUseCase =
  (repository: StaffRepository) => (storeId: number) =>
    repository.list(storeId)
