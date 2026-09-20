import {
  ProductRepository,
  GetProductQuery,
} from '../ports/product-repository.js'

export const getProductUseCase =
  (repository: ProductRepository) => (query: GetProductQuery) =>
    repository.getById(query)
