import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { validate } from '../request-validation.js'
import { validateDbResult } from '../db-result-validation.js'
import { sendResponse } from '../send-response.js'
import authenticateUser from '../authentication.js'
import { hasStoreAccess } from '../authorization/has-store-access.js'
import { getKPIsHandler } from '#src/context/analytics/http/get-kpis.js'
import { getRevenueTrendsHandler } from '#src/context/analytics/http/get-revenue-trends.js'
import { getSalesAnalyticsHandler } from '#src/context/analytics/http/get-sales-analytics.js'
import { getCustomerAcquisitionTrendsHandler } from '#src/context/analytics/http/get-customer-acquisition-trends.js'
import { getCustomersByLocationHandler } from '#src/context/analytics/http/get-customers-by-location.js'
import { getCustomerLifetimeValueHandler } from '#src/context/analytics/http/get-customer-lifetime-value.js'
import { getTopSellingProductsHandler } from '#src/context/analytics/http/get-top-selling-products.js'
import { getLowStockProductsHandler } from '#src/context/analytics/http/get-low-stock-products.js'
import { getProductPerformanceHandler } from '#src/context/analytics/http/get-product-performance.js'
import {
  DashboardKPIsResponseSchema,
  RevenueTrendResponseSchema,
  SalesAnalyticsQuerySchema,
  SalesAnalyticsResponseUnionSchema,
  CustomerAcquisitionTrendResponseSchema,
  CustomersByLocationResponseSchema,
  CustomerCLVResponseSchema,
  TopSellingProductsResponseSchema,
  LowStockProductsResponseSchema,
  ProductPerformanceResponseSchema,
  DashboardKPIsQuerySchema,
  RevenueTrendQuerySchema,
  CustomerAcquisitionTrendQuerySchema,
  CustomersByLocationQuerySchema,
  CustomerCLVQuerySchema,
  TopSellingProductsQuerySchema,
  LowStockProductsQuerySchema,
  ProductPerformanceQuerySchema,
  AnalyticsRequestSchema,
} from '../app-schema/analytics.js'

const router = Router()
const { OK } = StatusCodes

router.use(authenticateUser)

router.get(
  '/stores/:storeId/kpis',
  validate(AnalyticsRequestSchema(DashboardKPIsQuerySchema)),
  hasStoreAccess(['admin', 'editor', 'viewer']),
  getKPIsHandler,
  validateDbResult(DashboardKPIsResponseSchema),
  sendResponse(OK),
)

router.get(
  '/stores/:storeId/revenue-trends',
  validate(AnalyticsRequestSchema(RevenueTrendQuerySchema)),
  hasStoreAccess(['admin', 'editor', 'viewer']),
  getRevenueTrendsHandler,
  validateDbResult(RevenueTrendResponseSchema),
  sendResponse(OK),
)

router.get(
  '/stores/:storeId/sales-analytics',
  validate(AnalyticsRequestSchema(SalesAnalyticsQuerySchema)),
  hasStoreAccess(['admin', 'editor', 'viewer']),
  getSalesAnalyticsHandler,
  validateDbResult(SalesAnalyticsResponseUnionSchema),
  sendResponse(OK),
)

router.get(
  '/stores/:storeId/customer-acquisition-trends',
  validate(AnalyticsRequestSchema(CustomerAcquisitionTrendQuerySchema)),
  hasStoreAccess(['admin', 'editor', 'viewer']),
  getCustomerAcquisitionTrendsHandler,
  validateDbResult(CustomerAcquisitionTrendResponseSchema),
  sendResponse(OK),
)

router.get(
  '/stores/:storeId/customers-by-location',
  validate(AnalyticsRequestSchema(CustomersByLocationQuerySchema)),
  hasStoreAccess(['admin', 'editor', 'viewer']),
  getCustomersByLocationHandler,
  validateDbResult(CustomersByLocationResponseSchema),
  sendResponse(OK),
)

router.get(
  '/stores/:storeId/customer-lifetime-value',
  validate(AnalyticsRequestSchema(CustomerCLVQuerySchema)),
  hasStoreAccess(['admin', 'editor', 'viewer']),
  getCustomerLifetimeValueHandler,
  validateDbResult(CustomerCLVResponseSchema),
  sendResponse(OK),
)

router.get(
  '/stores/:storeId/top-selling-products',
  validate(AnalyticsRequestSchema(TopSellingProductsQuerySchema)),
  hasStoreAccess(['admin', 'editor', 'viewer']),
  getTopSellingProductsHandler,
  validateDbResult(TopSellingProductsResponseSchema),
  sendResponse(OK),
)

router.get(
  '/stores/:storeId/low-stock-products',
  validate(AnalyticsRequestSchema(LowStockProductsQuerySchema)),
  hasStoreAccess(['admin', 'editor', 'viewer']),
  getLowStockProductsHandler,
  validateDbResult(LowStockProductsResponseSchema),
  sendResponse(OK),
)

router.get(
  '/stores/:storeId/product-performance',
  validate(AnalyticsRequestSchema(ProductPerformanceQuerySchema)),
  hasStoreAccess(['admin', 'editor', 'viewer']),
  getProductPerformanceHandler,
  validateDbResult(ProductPerformanceResponseSchema),
  sendResponse(OK),
)

export default router
