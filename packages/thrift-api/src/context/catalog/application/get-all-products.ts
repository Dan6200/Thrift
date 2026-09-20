import {
  ProductRepository,
  GetAllProductsQuery,
} from '../ports/product-repository.js'

export const getAllProductsUseCase =
  (repository: ProductRepository) => (query: GetAllProductsQuery) =>
    repository.getAll(query)
