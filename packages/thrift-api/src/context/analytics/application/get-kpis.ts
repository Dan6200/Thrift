import { AnalyticsRepository } from '../ports/analytics-repository.js'

export const getKPIsUseCase =
  (repository: AnalyticsRepository) =>
  (storeId: number, query: Record<string, any>) =>
    repository.getKPIs(storeId, query)
