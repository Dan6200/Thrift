// components/products/product/utils/ProductDetails.tsx
'use client'
import { addItemAtom, getTotalCountAtom } from '@/atoms'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useSetAtom, useAtomValue } from 'jotai'
import { Product as ProductType, ProductVariant } from '@/types/products'
import { CartProduct } from '@/types/shopping-cart'
import { Price } from './price'
import { VariantSelector } from './variant-selector'
import { ShoppingCartIcon, Plus, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { QuantitySelector } from '@/components/ui/quantity-selector'
import { useRouter } from 'next/navigation'

interface ProductDetailsProps {
  product: ProductType
  selectedVariant: ProductVariant | null
  onOptionSelect: (optionName: string, value: string) => void
}

export function ProductDetails({
  product,
  selectedVariant,
  onOptionSelect,
}: ProductDetailsProps) {
  const addItem = useSetAtom(addItemAtom)
  const totalItems = useAtomValue(getTotalCountAtom)
  const { toast } = useToast()
  const router = useRouter()
  const [showToast, setShowToast] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (showToast) {
      toast({
        title: `${totalItems} Item(s) Added To Cart.`,
      })
      setShowToast(false)
    }
  }, [showToast, totalItems, toast])

  const buildCartProduct = (): CartProduct | null => {
    if (!selectedVariant) return null
    return { ...product, ...selectedVariant } as CartProduct
  }

  const handleAddToCart = () => {
    const itemToAdd = buildCartProduct()
    if (!itemToAdd) return
    addItem({ product: itemToAdd, quantity })
    setShowToast(true)
  }

  const handleBuyNow = () => {
    const itemToAdd = buildCartProduct()
    if (!itemToAdd) return
    addItem({ product: itemToAdd, quantity })
    router.push('/checkout')
  }

  const price = selectedVariant?.base_price ?? null

  return (
    <div className="flex flex-col w-full h-full justify-center">
      <h2 className="text-2xl lg:text-3xl mb-6 text-left font-bold break-words">
        {product.title.replace(/\u00A0/, ' ')}
      </h2>
      <Price kobo={price} />
      {selectedVariant && (
        <p className="text-sm text-muted-foreground mb-1">
          SKU: {selectedVariant.sku}
        </p>
      )}
      <div className="text-md flex mb-4">
        <p>
          Items left:{'\u00A0'.repeat(4)}
          {selectedVariant?.quantity_available ?? 0}
        </p>
      </div>
      {product.variants && product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          selectedVariant={selectedVariant}
          onOptionSelect={onOptionSelect}
        />
      )}
      <div className="flex items-center gap-4 my-4">
        <QuantitySelector
          quantity={quantity}
          onIncrease={() => setQuantity((q) => q + 1)}
          onDecrease={() => setQuantity((q) => q - 1)}
          maxQuantity={selectedVariant?.quantity_available}
        />
        <p className="text-sm text-muted-foreground">Select Quantity</p>
      </div>
      <div className="flex flex-col w-full my-4 gap-4 justify-between">
        <Button
          className="text-base h-12 font-bold w-full"
          onClick={handleAddToCart}
          disabled={
            !selectedVariant || selectedVariant.quantity_available === 0
          }
        >
          Add To Cart
          <span className="flex ml-2">
            <ShoppingCartIcon className="w-6" />
            <Plus className="w-6" />
          </span>
        </Button>
        <Button
          variant="outline"
          className="text-base h-12 font-bold w-full"
          onClick={handleBuyNow}
          disabled={
            !selectedVariant || selectedVariant.quantity_available === 0
          }
        >
          Buy Now
          <Zap className="w-6 ml-2" />
        </Button>
      </div>
    </div>
  )
}
