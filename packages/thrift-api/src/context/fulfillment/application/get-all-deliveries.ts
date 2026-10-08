import { DeliveryInfoRepository } from '../ports/delivery-info-repository.js'

export const getAllDeliveriesUseCase =
  (repository: DeliveryInfoRepository) => (customerId: string) =>
    repository.getAll(customerId)
