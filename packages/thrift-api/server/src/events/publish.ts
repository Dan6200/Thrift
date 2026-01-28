import { Request, Response, NextFunction } from 'express'
import { client as qstash } from '#src/lib/queue.js'
import logger from '#src/utils/logger.js'

// Base Event Interface
export interface DomainEvent {
  // Returns the destination URL for QStash (e.g., full URL or relative path handled by middleware)
  getDestination(appUrl: string): string
  // Returns the payload to send
  toPayload(): any
}

// Constructor type for the Event Class
export interface EventConstructor {
  new (payload: any): DomainEvent
}

/**
 * Middleware to publish an event to QStash.
 * It expects the previous middleware to have attached data to `req.eventPayload`.
 *
 * @param EventClass The class of the event to publish.
 */
export const publishEvent = (EventClass: EventConstructor) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    // 1. Check if event data exists
    const payload = req.eventPayload
    if (!payload) {
      // No event payload set, meaning the previous middleware didn't trigger an event.
      // This is valid (e.g., webhook for an ignored event type).
      return next()
    }

    try {
      // 2. Instantiate the Event
      const event = new EventClass(payload)

      // 3. Determine Destination
      // Use APP_URL env var or construct from request host
      const appUrl = process.env.APP_URL || `https://${req.get('host')}`
      const destination = event.getDestination(appUrl)

      // 4. Publish to QStash
      await qstash.publishJSON({
        url: destination,
        body: event.toPayload(),
      })

      logger.info(`Event Published: ${EventClass.name} -> ${destination}`)

      next()
    } catch (error: any) {
      logger.error(`Failed to publish event ${EventClass.name}:`, error)
      // We generally want to fail the request if publishing fails, so the webhook provider retries
      next(error)
    }
  }
}
