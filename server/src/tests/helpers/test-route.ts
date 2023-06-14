import { testRouteParams } from '../../types-and-interfaces/test-routes.js'

export default function ({ verb, statusCode, checks }: testRouteParams) {
  return async function (
    serverAgent: ChaiHttp.Agent,
    path: string,
    data?: object | null,
  ): Promise<any> {
    const response = await serverAgent[verb](path).send(data)
    response.should.have.status(statusCode)
    // Check the data in the body if accurate
    checks && checks(response.body)
    return response.body
  }
}
