import { StoreRepository, StoreData } from '../ports/store-repository.js'

export const updateStoreUseCase =
  (repository: StoreRepository) =>
  (input: { storeId: number; storeData: StoreData }) =>
    repository.update(input)
