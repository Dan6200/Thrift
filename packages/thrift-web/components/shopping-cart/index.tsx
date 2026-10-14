'use client'
// cspell:ignore Swipeable
import { ProductImage } from '../products/image'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Minus, Plus, Trash2 } from 'lucide-react'
import ShippingInfo from '@/types/shipping-info'
import { useSetAtom } from 'jotai'
import { ImgData } from '@/types/products'
import { Item, CartProduct } from '@/types/shopping-cart'
import { formatNaira } from '@/lib/money'
import { useRouter } from 'next/navigation'

type RemoveItem = ReturnType<
  typeof useSetAtom<null, [newProduct: CartProduct], void>
>

type IncreaseItemCount = ReturnType<
  typeof useSetAtom<null, [index: number], void>
>

type DecreaseItemCount = ReturnType<
  typeof useSetAtom<null, [index: number], void>
>

export function ShoppingCart({
  removeItem,
  items,
  increaseItemCount,
  decreaseItemCount,
  total,
}: {
  shippingInfo: ShippingInfo | null
  items: Item[]
  increaseItemCount: IncreaseItemCount
  decreaseItemCount: DecreaseItemCount
  total?: number
  removeItem?: RemoveItem
}) {
  const router = useRouter()

  return (
    <div className="flex flex-col justify-between container p-4">
      <h2 className="text-center p8 font-semibold text-2xl w-full my-8">
        Items in Cart
      </h2>
      <div className="space-y-4">
        {items.length ? (
          items.map(({ product, count }: Item, index: number) => {
            const imageData = product?.media?.find(
              (img: ImgData) => img.is_display_image,
            )
            return (
              <Card
                key={`${product.product_id}-${product.variant_id}`}
                className="flex bg-transparent items-center w-full"
              >
                <CardContent className="rounded-md w-full border-b border-border p-4 flex flex-col  sm:flex-row items-center justify-between h-44 sm:h-24">
                  <ProductImage
                    className="py-1 object-contain w-32 mx-auto rounded-sm bg-white max-h-24 sm:max-h-20 object-center border dark:border-none"
                    imgData={imageData}
                    width={128}
                    height={128}
                  />
                  <div className="w-full flex sm:px-8 justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <p className="font-semibold break-words">
                        {product.title}
                      </p>
                      {product.sku && (
                        <p className="text-xs text-muted-foreground">
                          {product.sku}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex h-fit mr-2 items-center border border-border bg-transparent w-28 justify-between p-0 rounded-md overflow-clip">
                        <Button
                          onClick={() => {
                            count > 1 ? decreaseItemCount(index) : null
                          }}
                          variant={'outline'}
                          className="p-2 border-r border-y-0 border-l-0 bg-transparent h-7 rounded-none m-0"
                        >
                          <Minus className="w-4" />
                        </Button>
                        <p className="mx-auto p-1">{count}</p>
                        {product?.quantity_available && (
                          <Button
                            onClick={() => {
                              count <= (product?.quantity_available ?? count)
                                ? increaseItemCount(index)
                                : null
                            }}
                            variant={'outline'}
                            className="p-2 border-l border-y-0 border-r-0 bg-transparent h-7 rounded-none m-0"
                          >
                            <Plus className="w-4" />
                          </Button>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        className="bg-transparent"
                        onClick={() =>
                          removeItem ? removeItem(product) : null
                        }
                      >
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                    <p className="p-1">
                      {formatNaira(product.base_price * count)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="w-full text-center">
            <h2 className="p8 text-semibold text-lg w-full my-8 ">
              No Items in the Cart yet
            </h2>
            <p>Click on the &apos;Add to cart button&apos; on the page</p>
          </div>
        )}
      </div>
      {!!items.length && (
        <>
          <div className="my-8 flex w-full items-center justify-between text-center text-lg">
            <h2 className="">Total Items: </h2>
            <p className="text-xl font-bold text-green-700 dark:text-green-400">
              {formatNaira(total)}
            </p>
          </div>
          <Button
            className="my-16 flex mx-auto font-semibold bg-green-600 w-full md:w-64 h-10 text-lg text-tertiary hover:bg-green-500"
            onClick={() => router.push('/checkout')}
          >
            Checkout
          </Button>
        </>
      )}
    </div>
  )
}
