import {
  ProductRepository,
  UpdateProductCommand,
} from '../ports/product-repository.js'

export const updateProductUseCase =
  (repository: ProductRepository) => (command: UpdateProductCommand) =>
    repository.update(command)
