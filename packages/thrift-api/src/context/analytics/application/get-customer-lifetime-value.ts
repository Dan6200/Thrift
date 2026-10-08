import { AnalyticsRepository } from '../ports/analytics-repository.js'

export const getCustomerLifetimeValueUseCase =
  (repository: AnalyticsRepository) =>
  (storeId: number, query: Record<string, any>) =>
    repository.getCustomerLifetimeValue(storeId, query)
