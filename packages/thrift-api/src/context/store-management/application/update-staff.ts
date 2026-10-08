import { StaffRepository } from '../ports/staff-repository.js'

export const updateStaffUseCase =
  (repository: StaffRepository) =>
  (input: { storeId: number; staffId: string; role: string }) =>
    repository.update(input)
