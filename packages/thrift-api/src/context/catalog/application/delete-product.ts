import {
  ProductRepository,
  RemoveProductCommand,
} from '../ports/product-repository.js'

export const deleteProductUseCase =
  (repository: ProductRepository) => (command: RemoveProductCommand) =>
    repository.remove(command)
