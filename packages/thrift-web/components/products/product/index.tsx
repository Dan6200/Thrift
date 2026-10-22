'use client'
import { MoveLeft } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent } from '../../ui/card'
import { GoBackLink } from '../go-back-link'
import { ProductImage } from '../image'
import {
  ImgData,
  Product as ProductType,
  ProductVariant,
} from '@/types/products'
import { ProductReviews } from './utils/product-reviews'
import { Separator } from '@/components/ui/separator'
import { Description } from './utils/description'
import { ProductDetails } from './utils/ProductDetails'

export function Product({ product }: { product: ProductType }) {
  const media = product.media ?? []

  // Initialize from the product itself so the first (server) render shows the
  // real variant, price and image instead of a ₦0.00 / placeholder flash.
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] ?? null,
  )

  const imageVariants = media.reduce(
    (acc, img) => {
      acc[img.variant_id.toString()] = img
      return acc
    },
    {} as Record<string, ImgData>,
  )

  const handleOptionSelect = (optionName: string, value: string) => {
    if (!selectedVariant || !product.variants) return

    const currentOptions = Object.fromEntries(
      selectedVariant.options.map((opt) => [opt.option_name, opt.value]),
    )
    const nextOptions = { ...currentOptions, [optionName]: value }

    const nextVariant = product.variants.find((variant) =>
      variant.options.every(
        (opt) => nextOptions[opt.option_name] === opt.value,
      ),
    )

    if (nextVariant) {
      setSelectedVariant(nextVariant)
    }
  }

  const displayImg: ImgData | undefined = selectedVariant
    ? (imageVariants[selectedVariant.variant_id] ?? media[0])
    : media[0]

  return (
    <div className="container mx-auto p-4 sm:p-8 my-10 md:my-20 h-full">
      <GoBackLink className="h-fit w-fit cursor-pointer text-base md:text-lg text-blue-700 dark:text-blue-200 my-4 sm:my-8 block">
        <MoveLeft className="inline mr-4" />
        Go back
      </GoBackLink>

      {/* Main Product Card */}
      <Card className="flex flex-col lg:flex-row gap-8 rounded-xl w-full overflow-clip">
        {/* Left Side: Image */}
        <CardContent className="w-fit p-0 bg-transparent">
          <ProductImage
            imgData={displayImg}
            className="object-contain h-full"
            width={640}
            height={512}
          />
        </CardContent>

        {/* Right Side: Details */}
        <CardContent className="w-full lg:w-1/2 p-6 sm:p-8">
          <ProductDetails
            product={product}
            selectedVariant={selectedVariant}
            onOptionSelect={handleOptionSelect}
          />
        </CardContent>
      </Card>

      <div className="w-2/3 mx-auto">
        <Description description={product.description ?? []} />

        <Separator />

        <ProductReviews
          product_id={product.product_id}
          average_rating={product.average_rating}
          review_count={product.review_count}
        />
      </div>
    </div>
  )
}
