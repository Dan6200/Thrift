import { AnalyticsRepository } from '../ports/analytics-repository.js'

export const getCustomersByLocationUseCase =
  (repository: AnalyticsRepository) =>
  (storeId: number, query: Record<string, any>) =>
    repository.getCustomersByLocation(storeId, query)
