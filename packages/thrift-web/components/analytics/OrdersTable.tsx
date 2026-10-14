import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { RecentOrder as Order } from '@/types/analytics'
import { formatNaira } from '@/lib/money'

interface OrdersTableProps {
  orders: Order[]
  isLoading?: boolean
}

export function OrdersTable({ orders, isLoading }: OrdersTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading orders...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          Latest customer orders and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell className="font-medium">{order.orderId}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{formatNaira(order.totalAmount)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(order.orderDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
