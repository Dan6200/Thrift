import { Request } from 'express'
import { DecodedIdToken } from 'firebase-admin/auth'

interface RequestWithPayload extends Request {
  uid: DecodedIdToken
}

export { RequestWithPayload }
