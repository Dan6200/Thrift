//cspell:ignore ponyfill
import { ProductData, ProductDataSchema } from '@/types/products'
import { normalizeProduct } from '@/lib/normalize-product'

export default async function getProducts({
  page = 1,
  limit = 50,
}: {
  page?: number
  limit?: number
}): Promise<ProductData> {
  const response = await fetch(
    process.env.NEXT_PUBLIC_SERVER +
      '/v1/products?' +
      new URLSearchParams({
        sort: '-created_at',
        offset: String((page - 1) * limit),
        limit: limit.toString(),
      }),
    { next: { revalidate: 60 * 60 } },
  ).then((res) => {
    if (!res.ok) return null
    return res.json()
  })

  if (!response) {
    return { products: [], total_count: 0 }
  }

  // Tolerate schema drift / malformed responses by degrading to an empty list.
  const normalized = {
    ...response,
    products: Array.isArray(response.products)
      ? response.products.map(normalizeProduct)
      : response.products,
  }
  const parsed = ProductDataSchema.safeParse(normalized)
  if (!parsed.success) {
    return { products: [], total_count: 0 }
  }

  return {
    products: parsed.data.products,
    total_count: parsed.data.total_count,
  }
}
