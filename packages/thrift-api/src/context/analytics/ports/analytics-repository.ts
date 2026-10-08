export type AnalyticsRepository = {
  getKPIs(storeId: number, query: Record<string, any>): Promise<unknown>
  getRevenueTrends(
    storeId: number,
    query: Record<string, any>,
  ): Promise<unknown>
  getSalesAnalytics(
    storeId: number,
    query: Record<string, any>,
  ): Promise<unknown>
  getCustomerAcquisitionTrends(
    storeId: number,
    query: Record<string, any>,
  ): Promise<unknown>
  getCustomersByLocation(
    storeId: number,
    query: Record<string, any>,
  ): Promise<unknown>
  getCustomerLifetimeValue(
    storeId: number,
    query: Record<string, any>,
  ): Promise<unknown>
  getTopSellingProducts(
    storeId: number,
    query: Record<string, any>,
  ): Promise<unknown>
  getLowStockProducts(
    storeId: number,
    query: Record<string, any>,
  ): Promise<unknown>
  getProductPerformance(
    storeId: number,
    query: Record<string, any>,
  ): Promise<unknown>
}
