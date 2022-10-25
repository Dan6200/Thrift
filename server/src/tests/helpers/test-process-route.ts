import chai from 'chai';
import { Express } from 'express';
import chaiHttp from 'chai-http';
import { users } from 'tests/authentication/user-data';
import { StatusCodes } from 'http-status-codes';
chai.use(chaiHttp).should();

const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes;
interface routeProcessorParams {
	server?: Express;
	verb: string;
	url?: string;
	statusCode:
		| typeof CREATED
		| typeof OK
		| typeof NO_CONTENT
		| typeof NOT_FOUND;
	data?: object;
	checks?: (response: any) => void;
}

export default function ({
	server,
	verb,
	url,
	data,
	statusCode,
	checks,
}: routeProcessorParams) {
	return async () => {
		const tokens = await users.getUserTokens();
		tokens.should.not.be.empty;
		for (let token of tokens) {
			const response = await chai
				.request(server)
				[verb](url)
				.send(data)
				.auth(token, { type: 'bearer' });
			response.should.have.status(statusCode);
			checks && checks(response);
		}
	};
}
