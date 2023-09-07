//
export type Product = {
  title: string
  category_id: string
  subcategory_id: string
  description: string[]
  list_price: number
  net_price: number
  quantity_available: number
}

export type ProductPartial = {
  title?: string
  category_id?: string
  subcategory_id?: string
  description?: string[]
  list_price?: number
  net_price?: number
  quantity_available?: number
}

export type ProductMedia = {
  name: string
  path: string
  description: string
  is_display_image: boolean
  is_landing_image: boolean
  is_video: boolean
}

export function isValidProductData(
  productData: unknown
): productData is Product {
  return (
    typeof productData === 'object' &&
    productData != null &&
    'title' in productData &&
    'category_id' in productData &&
    'subcategory_id' in productData &&
    'description' in productData &&
    'list_price' in productData &&
    'net_price' in productData &&
    'quantity_available' in productData
  )
}
