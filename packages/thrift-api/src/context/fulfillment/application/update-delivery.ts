import {
  DeliveryInfoRepository,
  UpdateDeliveryInput,
} from '../ports/delivery-info-repository.js'

export const updateDeliveryUseCase =
  (repository: DeliveryInfoRepository) => (input: UpdateDeliveryInput) =>
    repository.update(input)
