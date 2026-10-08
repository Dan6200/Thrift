import { AnalyticsRepository } from '../ports/analytics-repository.js'

export const getRevenueTrendsUseCase =
  (repository: AnalyticsRepository) =>
  (storeId: number, query: Record<string, any>) =>
    repository.getRevenueTrends(storeId, query)
