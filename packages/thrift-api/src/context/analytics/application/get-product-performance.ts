import { AnalyticsRepository } from '../ports/analytics-repository.js'

export const getProductPerformanceUseCase =
  (repository: AnalyticsRepository) =>
  (storeId: number, query: Record<string, any>) =>
    repository.getProductPerformance(storeId, query)
