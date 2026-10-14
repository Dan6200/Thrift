// lib/api/analytics.ts
import { axiosInstance } from '@/components/axios-instance'

const base = (storeId: string | number) => `/analytics/stores/${storeId}`

export const getKPIs = async (
  storeId: string,
  startDate?: string,
  endDate?: string,
) => {
  const response = await axiosInstance.get(`${base(storeId)}/kpis`, {
    params: { startDate, endDate },
  })
  return response.data
}

export const getRevenueData = async (
  storeId: string,
  startDate: string,
  endDate: string,
) => {
  const response = await axiosInstance.get(`${base(storeId)}/revenue-trends`, {
    params: { startDate, endDate },
  })
  return response.data
}

export const getSalesData = async (storeId: string) => {
  const response = await axiosInstance.get(`${base(storeId)}/sales-analytics`)
  return response.data
}

export const getRecentOrders = async (storeId: string) => {
  const response = await axiosInstance.get(`${base(storeId)}/sales-analytics`, {
    params: { type: 'recent-orders' },
  })
  return response.data
}

export const getCustomerData = async (storeId: string) => {
  const response = await axiosInstance.get(
    `${base(storeId)}/customer-acquisition-trends`,
  )
  return response.data
}

export const getProductPerformance = async (storeId: string) => {
  const response = await axiosInstance.get(
    `${base(storeId)}/product-performance`,
  )
  return response.data
}

export const getLowStockProducts = async (storeId: string) => {
  const response = await axiosInstance.get(
    `${base(storeId)}/low-stock-products`,
  )
  return response.data
}
