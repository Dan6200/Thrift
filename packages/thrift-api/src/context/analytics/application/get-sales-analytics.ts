import { AnalyticsRepository } from '../ports/analytics-repository.js'

export const getSalesAnalyticsUseCase =
  (repository: AnalyticsRepository) =>
  (storeId: number, query: Record<string, any>) =>
    repository.getSalesAnalytics(storeId, query)
