import { StaffRepository } from '../ports/staff-repository.js'

export const removeStaffUseCase =
  (repository: StaffRepository) =>
  (input: { storeId: number; staffId: string }) =>
    repository.remove(input)
