import { Request } from 'express'

declare global {
  namespace Express {
    interface Request {
      userId?: string
      validatedParams?: Record<string, string>
      validatedQueryParams?: Record<string, any>
      validatedBody?: Record<string, any>
      dbResult?: any | any[] // This will hold the result from the DB query middleware
      validatedResponse?: any | any[] // This will hold the validated response data before sending
      authorized?: boolean // Flag to indicate successful authorization
      eventPayload?: any // Data to be used by the publishEvent middleware
    }
  }
}
