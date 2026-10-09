import { Result, ok, err } from '#src/shared/result.js'
import { DomainError, domainError } from '#src/shared/domain-error.js'
import { PaymentGateway } from '../ports/payment-gateway.js'
import { PaymentRepository } from '../ports/payment-repository.js'

export type InitializePaymentCommand = {
  userId: string
  orderId: number
  callbackUrl?: string
  saveCard: boolean
}

export const initializePaymentUseCase =
  (repository: PaymentRepository, gateway: PaymentGateway) =>
  async (
    command: InitializePaymentCommand,
  ): Promise<Result<unknown, DomainError>> => {
    const order = await repository.getOrderForPayment(
      command.orderId,
      command.userId,
    )
    if (!order) {
      return err(
        domainError(
          'NOT_FOUND',
          'Order not found or does not belong to the authenticated user.',
        ),
      )
    }

    if (order.status !== 'pending') {
      return err(
        domainError(
          'INVALID_INPUT',
          `Order ${command.orderId} is not in a 'pending' state for payment.`,
        ),
      )
    }

    const email = await repository.getProfileEmail(command.userId)
    if (!email) {
      return err(
        domainError(
          'INTERNAL',
          'Customer email not found for authenticated user.',
        ),
      )
    }

    const reference = `THR-${order.order_id}-${Date.now()}`

    try {
      const transaction = await gateway.initializeTransaction({
        email,
        amount: Number(order.total_amount),
        reference,
        metadata: JSON.stringify({
          order_id: order.order_id,
          customer_id: command.userId,
          save_card: !!command.saveCard,
        }),
        callbackUrl: command.callbackUrl,
      })

      if (!transaction.status) {
        return err(
          domainError(
            'INTERNAL',
            `Paystack initialization failed: ${transaction.message}`,
          ),
        )
      }

      await repository.updatePaymentReference(
        command.orderId,
        transaction.data.reference,
      )

      return ok({
        authorization_url: transaction.data.authorization_url,
        access_code: transaction.data.access_code,
        reference: transaction.data.reference,
      })
    } catch (error: any) {
      return err(
        domainError(
          'INTERNAL',
          `Payment initialization failed: ${error.response?.data?.message || error.message}`,
        ),
      )
    }
  }
