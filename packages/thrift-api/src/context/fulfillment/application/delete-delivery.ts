import { DeliveryInfoRepository } from '../ports/delivery-info-repository.js'

export const deleteDeliveryUseCase =
  (repository: DeliveryInfoRepository) =>
  (customerId: string, deliveryInfoId: number) =>
    repository.remove(customerId, deliveryInfoId)
