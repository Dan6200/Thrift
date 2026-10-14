import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orders?: string }>
}) {
  const { orders } = await searchParams
  const orderIds = (orders ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <div className="container mx-auto p-8 max-w-xl text-center">
      <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Payment Received</h1>
      <p className="text-muted-foreground mb-2">
        Thank you for your order. Your payment is being processed and your order
        will be confirmed shortly.
      </p>
      {orderIds.length > 0 && (
        <p className="text-sm text-muted-foreground mb-6">
          Order{orderIds.length > 1 ? 's' : ''}:{' '}
          <span className="font-medium">{orderIds.join(', ')}</span>
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/account/orders">
          <Button variant="outline">View My Orders</Button>
        </Link>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}
