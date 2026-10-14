import { z } from 'zod'

// Corresponds to AnalyticsKPIsResponseSchema
export const AnalyticsKPISchema = z.object({
  totalRevenue: z.number(),
  totalOrders: z.number().int(),
  averageOrderValue: z.number(),
  newCustomers: z.number().int(),
  returningCustomers: z.number().int(),
  conversionRate: z.number().nullable().optional(),
})
export type AnalyticsKPIs = z.infer<typeof AnalyticsKPISchema>

// Corresponds to RevenueTrendResponseSchema
export const RevenueTrendSchema = z.object({
  date: z.string().datetime(),
  revenue: z.number(),
})
export type RevenueTrend = z.infer<typeof RevenueTrendSchema>

// Corresponds to SalesAnalyticsByProductResponseSchema
export const SalesByProductSchema = z.object({
  productId: z.number().int(),
  productTitle: z.string(),
  unitsSold: z.number().int(),
  totalRevenue: z.number(),
})
export type SalesByProduct = z.infer<typeof SalesByProductSchema>

// Corresponds to SalesAnalyticsByCategoryResponseSchema
export const SalesByCategorySchema = z.object({
  categoryId: z.number().int(),
  categoryName: z.string(),
  totalRevenue: z.number(),
})
export type SalesByCategory = z.infer<typeof SalesByCategorySchema>

// Corresponds to SalesAnalyticsRecentOrdersResponseSchema
export const RecentOrderSchema = z.object({
  orderId: z.coerce.number(),
  customerName: z.string(),
  totalAmount: z.coerce.number(),
  status: z.string(),
  orderDate: z.string(),
})
export type RecentOrder = z.infer<typeof RecentOrderSchema>

// A combined schema for the sales breakdown component
export const SalesDataSchema = z.object({
  byProduct: z.array(SalesByProductSchema),
  byCategory: z.array(SalesByCategorySchema),
})
export type SalesData = z.infer<typeof SalesDataSchema>

// Corresponds to CustomerAcquisitionTrendResponseSchema
export const CustomerAcquisitionTrendSchema = z.object({
  date: z.string().datetime(),
  newCustomers: z.number().int(),
})
export type CustomerAcquisitionTrend = z.infer<
  typeof CustomerAcquisitionTrendSchema
>

// Corresponds to CustomersByLocationResponseSchema
export const CustomersByLocationSchema = z.object({
  location: z.string(),
  customerCount: z.number().int(),
})
export type CustomersByLocation = z.infer<typeof CustomersByLocationSchema>

// Corresponds to CustomerCLVResponseSchema
export const CustomerCLVSchema = z.object({
  customerId: z.uuid('v4'),
  customerName: z.string(),
  clv: z.number(),
})
export type CustomerCLV = z.infer<typeof CustomerCLVSchema>

// A combined schema for the customer insights component
export const CustomerDataSchema = z.object({
  acquisitionTrend: z.array(CustomerAcquisitionTrendSchema),
  byLocation: z.array(CustomersByLocationSchema),
  clv: z.array(CustomerCLVSchema),
})
export type CustomerData = z.infer<typeof CustomerDataSchema>

// Corresponds to ProductPerformanceResponseSchema
export const ProductPerformanceSchema = z.object({
  productId: z.number().int(),
  productTitle: z.string(),
  purchases: z.number().int(),
  views: z.number().int().nullable(),
})
export type ProductPerformance = z.infer<typeof ProductPerformanceSchema>

export const LowStockProductsSchema = z.object({
  productId: z.number().int(),
  productTitle: z.string(),
  quantityAvailable: z.number().int(),
})
export type LowStockProducts = z.infer<typeof LowStockProductsSchema>

export const AnalyticsDataSchema = z.object({
  kpis: AnalyticsKPISchema,
  revenueTrend: z.array(RevenueTrendSchema),
  salesByCategory: z.array(SalesByCategorySchema),
  // salesByChannel: z.array(SalesByChannelSchema),
  recentOrders: z.array(RecentOrderSchema),
  customerData: CustomerDataSchema,
  productPerformance: z.array(ProductPerformanceSchema),
})
export type AnalyticsData = z.infer<typeof AnalyticsDataSchema>
