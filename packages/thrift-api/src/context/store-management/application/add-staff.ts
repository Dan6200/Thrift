import { StaffRepository } from '../ports/staff-repository.js'

export const addStaffUseCase =
  (repository: StaffRepository) =>
  (input: { storeId: number; staffId: string; role: string }) =>
    repository.add(input)
