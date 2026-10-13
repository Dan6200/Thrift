import chai from 'chai'
import { TestRequestParams, RequestParams } from './types.js'

export default function ({
  verb,
  statusCode,
  path,
  validateTestResData,
  validateTestReqData,
  expectedData, // New: Expected data for content validation
  compareData, // New: Custom comparison function
}: TestRequestParams) {
  return async function ({
    query,
    params,
    body,
    token,
    headers,
  }: RequestParams) {
    const server = process.env.SERVER!
    // Request validation is opt-in: only validate when a validator is provided.
    if (validateTestReqData && !validateTestReqData({ query, params, body }))
      throw new Error('Invalid Test Request Data')

    // Make request
    const request = chai
      .request(server)
      [verb](path)
      .query(query)
      .send(<object>body)

    if (headers) request.set(headers)

    process.env.DEBUG &&
      console.log('\nDEBUG: request ->' + JSON.stringify(request) + '\n')

    // Add request token
    if (token) request.auth(token, { type: 'bearer' })
    const response = await request

    process.env.DEBUG &&
      console.log(
        '\nDEBUG: response.body ->',
        JSON.stringify(response.body),
        ' \n',
      )
    response.should.have.status(statusCode)

    // Validate the response body against schema
    if (validateTestResData && !validateTestResData(response.body)) {
      if (response.body.length === 0) {
        return []
      }
      throw new Error('Invalid Database Result') //Now allowing empty responses
    }

    // Validate the response body against expected data
    if (expectedData !== undefined) {
      if (compareData) {
        if (!compareData(response.body, expectedData)) {
          throw new Error(
            'Response data does not match expected data (custom comparison)',
          )
        }
      } else {
        // Default to deep equality comparison using chai
        chai
          .expect(response.body)
          .deep.equal(
            expectedData,
            'Response data does not match expected data',
          )
      }
    }

    return response.body
  }
}
