import { Product, ProductSchema } from '@/types/products'
import { normalizeProduct } from '@/lib/normalize-product'

export default async function getProductById(
  id: number,
): Promise<Product | null> {
  const response = await fetch(
    process.env.NEXT_PUBLIC_SERVER + '/v1/products/' + id,
    { next: { revalidate: 30 * 60 } },
  ).then((res) => {
    if (!res.ok) return null
    return res.json()
  })

  if (response == null) return null

  const parsed = ProductSchema.safeParse(normalizeProduct(response))
  if (!parsed.success) return null

  return parsed.data
}
