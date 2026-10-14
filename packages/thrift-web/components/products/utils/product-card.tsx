import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ProductImage } from '../image'
import { Price } from './price'
import { Title } from './title'
import { Ratings } from './rating'
import { Product } from '@/types/products'

function minVariantPrice(product: Product): number | null {
  const prices = (product.variants ?? [])
    .map((v) => v.base_price)
    .filter((p): p is number => typeof p === 'number' && !Number.isNaN(p))
  if (prices.length === 0) return null
  return Math.min(...prices)
}

export default function ProductCard({ product }: { product: Product }) {
  const imageData = product.media?.find((img) => img.is_display_image)
  const price = minVariantPrice(product)

  return (
    <Card className="h-fit flex flex-col w-full overflow-hidden rounded-sm">
      <Link
        href={`/products/${product?.product_id}`}
        passHref
        className="hover:bg-primary/20 relative"
      >
        <CardContent className="p-0">
          <ProductImage
            className="object-contain h-[10rem] sm:h-[12rem] md:h-[14rem] lg:h-[16rem]"
            imgData={imageData}
            width={256}
            height={256}
          />
        </CardContent>
      </Link>
      <CardFooter className="p-2 sm:p-4 flex flex-1 flex-col gap-2 sm:gap-4 justify-between">
        <Title title={product?.title} product_id={product?.product_id} />
        <Ratings
          average_rating={product?.average_rating}
          review_count={product?.review_count}
        />
        {price != null && <Price kobo={price} />}
      </CardFooter>
    </Card>
  )
}
