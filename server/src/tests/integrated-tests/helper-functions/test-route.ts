import chai from 'chai'
import BadRequestError from '../../../errors/bad-request.js'
import { TestCreateRequestParams } from '../../../types-and-interfaces/test-routes.js'

export default function ({
  verb,
  statusCode,
  validateResData,
  validateReqData,
}: TestCreateRequestParams) {
  return async function ({
    server,
    token,
    path,
    query,
    body,
  }: {
    server: string
    token: string
    path: string
    query?: { [k: string]: any }
    body?: object & { length: never }
  }) {
    // Validate the request body
    if (body && !validateReqData)
      throw new BadRequestError('Must validate request data')
    if (validateReqData && !validateReqData(body))
      throw new BadRequestError('Invalid Request Data')

    // Make request
    const request = chai
      .request(server)
      [verb](path)
      .query(query ?? {})
      .send(body)

    // Add request token
    if (token) request.auth(token, { type: 'bearer' })
    const response = await request
    response.should.have.status(statusCode)

    // Validate the response body
    if (response.body && !validateResData)
      throw new BadRequestError('Invalid Database Result')
    return response.body
  }
}
