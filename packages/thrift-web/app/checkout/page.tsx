'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAtomValue } from 'jotai'
import { getItemsAtom, getTotalAtom } from '@/atoms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { formatNaira } from '@/lib/money'
import { createDeliveryInfo } from '@/lib/api/delivery-info'
import { createOrder } from '@/lib/api/orders'
import { initializePayment } from '@/lib/api/payments'
import { Item } from '@/types/shopping-cart'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'

interface DeliveryFormState {
  recipient_full_name: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  zip_postal_code: string
  country: string
  phone_number: string
  delivery_instructions: string
}

const emptyDelivery: DeliveryFormState = {
  recipient_full_name: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  state: '',
  zip_postal_code: '',
  country: 'Nigeria',
  phone_number: '',
  delivery_instructions: '',
}

function groupItemsByStore(items: Item[]) {
  const byStore = new Map<number, Item[]>()
  for (const item of items) {
    const storeId = item.product.store_id
    const existing = byStore.get(storeId) ?? []
    existing.push(item)
    byStore.set(storeId, existing)
  }
  return byStore
}

export default function CheckoutPage() {
  const router = useRouter()
  const items = useAtomValue(getItemsAtom)
  const total = useAtomValue(getTotalAtom)

  const [delivery, setDelivery] = useState<DeliveryFormState>(emptyDelivery)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const grouped = useMemo(() => groupItemsByStore(items), [items])

  const setField = (field: keyof DeliveryFormState, value: string) =>
    setDelivery((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (items.length === 0) {
      setError('Your cart is empty.')
      return
    }

    setIsSubmitting(true)
    try {
      // 1. Create delivery info
      const deliveryInfo = await createDeliveryInfo({
        recipient_full_name: delivery.recipient_full_name,
        address_line_1: delivery.address_line_1,
        address_line_2: delivery.address_line_2 || '',
        city: delivery.city,
        state: delivery.state,
        zip_postal_code: delivery.zip_postal_code,
        country: delivery.country,
        phone_number: delivery.phone_number,
        delivery_instructions: delivery.delivery_instructions || '',
      })

      // 2. Create one order per store
      const orderIds: number[] = []
      for (const [storeId, storeItems] of Array.from(grouped.entries())) {
        const order = await createOrder({
          store_id: storeId,
          delivery_info_id: deliveryInfo.delivery_info_id,
          items: storeItems.map((item) => ({
            variant_id: item.product.variant_id,
            quantity: item.count,
          })),
        })
        orderIds.push(order.order_id)
      }

      if (orderIds.length === 0) {
        throw new Error('No orders were created.')
      }

      // 3. Initialize Paystack payment for the first order
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const callbackUrl = `${origin}/checkout/success?orders=${orderIds.join(',')}`
      const payment = await initializePayment(orderIds[0], callbackUrl)

      // 4. Redirect to Paystack
      window.location.assign(payment.authorization_url)
    } catch (err) {
      console.error('Checkout failed:', err)
      const message =
        err instanceof Error
          ? err.message
          : 'Checkout failed. Please try again.'
      setError(message)
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Add some products before checking out.
        </p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-5xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Delivery info form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-semibold">Delivery Information</h2>

          <div className="space-y-2">
            <Label htmlFor="recipient_full_name">Recipient Full Name</Label>
            <Input
              id="recipient_full_name"
              required
              value={delivery.recipient_full_name}
              onChange={(e) => setField('recipient_full_name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line_1">Address Line 1</Label>
            <Input
              id="address_line_1"
              required
              value={delivery.address_line_1}
              onChange={(e) => setField('address_line_1', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line_2">Address Line 2 (optional)</Label>
            <Input
              id="address_line_2"
              value={delivery.address_line_2}
              onChange={(e) => setField('address_line_2', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                required
                value={delivery.city}
                onChange={(e) => setField('city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                required
                value={delivery.state}
                onChange={(e) => setField('state', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zip_postal_code">ZIP / Postal Code</Label>
              <Input
                id="zip_postal_code"
                required
                value={delivery.zip_postal_code}
                onChange={(e) => setField('zip_postal_code', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                required
                value={delivery.country}
                onChange={(e) => setField('country', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              required
              type="tel"
              value={delivery.phone_number}
              onChange={(e) => setField('phone_number', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery_instructions">
              Delivery Instructions (optional)
            </Label>
            <Textarea
              id="delivery_instructions"
              value={delivery.delivery_instructions}
              onChange={(e) =>
                setField('delivery_instructions', e.target.value)
              }
            />
          </div>

          {error && <p className="text-destructive font-medium">{error}</p>}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-semibold"
          >
            {isSubmitting ? (
              <Spinner className="mr-2" />
            ) : (
              `Place Order & Pay ${formatNaira(total)}`
            )}
          </Button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <Card>
            <CardContent className="p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.product.product_id}-${item.product.variant_id}`}
                  className="flex justify-between gap-2 text-sm"
                >
                  <div className="flex-1">
                    <p className="font-medium break-words">
                      {item.product.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.product.sku} × {item.count}
                    </p>
                  </div>
                  <p className="whitespace-nowrap">
                    {formatNaira(item.product.base_price * item.count)}
                  </p>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>{formatNaira(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
