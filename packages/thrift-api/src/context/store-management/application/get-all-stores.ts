import { StoreRepository } from '../ports/store-repository.js'

export const getAllStoresUseCase =
  (repository: StoreRepository) => (vendorId?: string) =>
    repository.getAll(vendorId)
