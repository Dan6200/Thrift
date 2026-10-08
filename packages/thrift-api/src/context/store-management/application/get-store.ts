import { StoreRepository } from '../ports/store-repository.js'

export const getStoreUseCase =
  (repository: StoreRepository) =>
  (input: { storeId: number; vendorId?: string }) =>
    repository.getById(input.storeId, input.vendorId)
