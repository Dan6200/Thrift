import { DeliveryInfoRepository } from '../ports/delivery-info-repository.js'

export const getDeliveryUseCase =
  (repository: DeliveryInfoRepository) =>
  (customerId: string, deliveryInfoId: number) =>
    repository.getById(customerId, deliveryInfoId)
