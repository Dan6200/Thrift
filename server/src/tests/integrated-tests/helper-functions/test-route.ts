import chai from 'chai'
import { TestCreateRequestParams } from '../../../types-and-interfaces/test-routes.js'

export default function ({
  verb,
  statusCode,
  validateReqData,
  validateResData,
}: TestCreateRequestParams) {
  return async function (
    server: string,
    token: string | null,
    path: string,
    query: object | null,
    requestBody: object | null
  ): Promise<any> {
    const request = chai
      .request(server)
      [verb](path)
      .query(query ?? {})
      .send(requestBody)
    if (token) request.auth(token, { type: 'bearer' })
    const response = await request
    response.should.have.status(statusCode)
    // Check the data in the body if accurate
    return response.body
  }
}
