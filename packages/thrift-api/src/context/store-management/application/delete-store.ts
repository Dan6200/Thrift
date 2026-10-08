import { StoreRepository } from '../ports/store-repository.js'

export const deleteStoreUseCase =
  (repository: StoreRepository) => (storeId: number) =>
    repository.remove(storeId)
