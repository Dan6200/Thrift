import {
  CreateDeliveryInput,
  DeliveryInfoRepository,
} from '../ports/delivery-info-repository.js'

export const createDeliveryUseCase =
  (repository: DeliveryInfoRepository) => (input: CreateDeliveryInput) =>
    repository.create(input)
