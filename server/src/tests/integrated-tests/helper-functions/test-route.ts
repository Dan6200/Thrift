import chai from 'chai'
import { testRouteParams } from '../../../types-and-interfaces/test-routes.js'

export default function ({ verb, statusCode, checks }: testRouteParams) {
	return async function (
		server: string,
		token: string,
		path: string,
		query: object | null,
		data?: object | null
	): Promise<any> {
		const response = await chai
			.request(server)
			[verb](path)
			.auth(token, { type: 'bearer' })
			.query(query ?? {})
			.send(data)
		response.should.have.status(statusCode)
		// Check the data in the body if accurate
		checks && (await checks(response.body))
		return response.body
	}
}
