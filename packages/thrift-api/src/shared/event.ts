export type DomainEvent = {
  eventType: string
  data: unknown
}

export type EventPublisher = {
  publish(event: DomainEvent): Promise<void>
}
