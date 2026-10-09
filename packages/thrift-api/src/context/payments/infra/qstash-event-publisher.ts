import { client as qstash } from '#src/lib/queue.js'
import { DomainEvent, EventPublisher } from '#src/shared/event.js'

const destinations: Record<string, string> = {
  'charge.success': '/v1/payments/jobs/process-order',
}

export const qstashEventPublisher: EventPublisher = {
  async publish(event: DomainEvent) {
    const destination = destinations[event.eventType]
    if (!destination) {
      throw new Error(
        `No destination configured for event type: ${event.eventType}`,
      )
    }
    const appUrl = process.env.APP_URL || 'http://localhost:1037'
    await qstash.publishJSON({ url: `${appUrl}${destination}`, body: event })
  },
}
