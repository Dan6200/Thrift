import { StoreRepository, StoreData } from '../ports/store-repository.js'

export const createStoreUseCase =
  (repository: StoreRepository) =>
  (input: { vendorId: string; storeData: StoreData }) =>
    repository.create(input)
