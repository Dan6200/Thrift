// components/account/OrderCard.tsx
import { Order } from '@/types/orders'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { formatNaira } from '@/lib/money'

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const formattedDate = format(new Date(order.order_date), 'PPP')
  const totalAmount = formatNaira(order.total_amount)

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-xl">Order #{order.order_id}</CardTitle>
          <CardDescription>Placed on {formattedDate}</CardDescription>
        </div>
        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
          {order.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Amount:</span>
            <span className="font-semibold">{totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Items:</span>
            <span>{order.items?.length ?? 0}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/account/orders/${order.order_id}`} passHref>
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
