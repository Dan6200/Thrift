import { Request } from 'express'

interface RequestWithPayload extends Request {
  uid?: string
}

export { RequestWithPayload }
