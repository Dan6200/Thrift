import { AnalyticsRepository } from '../ports/analytics-repository.js'

export const getCustomerAcquisitionTrendsUseCase =
  (repository: AnalyticsRepository) =>
  (storeId: number, query: Record<string, any>) =>
    repository.getCustomerAcquisitionTrends(storeId, query)
