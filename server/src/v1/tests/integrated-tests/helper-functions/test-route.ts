import chai from 'chai'
import { testRouteParams } from '../../../types-and-interfaces/test-routes.js'

export default function ({ verb, statusCode, checks }: testRouteParams) {
	return async function (
		server: string,
		token: string | null,
		path: string,
		query: object | null,
		data?: object | null
	): Promise<any> {
		const request = chai
			.request(server)
			[verb](path)
			.query(query ?? {})
			.send(data)
		if (token) request.auth(token, { type: 'bearer' })
		const response = await request
		response.should.have.status(statusCode)
		// Check the data in the body if accurate
		checks && (await checks(response.body))
		return response.body
	}
}
