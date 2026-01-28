import { DomainEvent } from '#src/events/publish.js'

export class PaymentSuccessEvent implements DomainEvent {
  constructor(private readonly data: any) {}

  getDestination(appUrl: string): string {
    return `${appUrl}/v1/payments/jobs/process-order`
  }

  toPayload(): any {
    return {
      eventType: 'charge.success',
      data: this.data,
    }
  }
}
