import { AnalyticsRepository } from '../ports/analytics-repository.js'

export const getTopSellingProductsUseCase =
  (repository: AnalyticsRepository) =>
  (storeId: number, query: Record<string, any>) =>
    repository.getTopSellingProducts(storeId, query)
