import { AnalyticsRepository } from '../ports/analytics-repository.js'

export const getLowStockProductsUseCase =
  (repository: AnalyticsRepository) =>
  (storeId: number, query: Record<string, any>) =>
    repository.getLowStockProducts(storeId, query)
