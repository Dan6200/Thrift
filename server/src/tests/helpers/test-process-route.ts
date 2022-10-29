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
	urls: string[];
	statusCode: StatusCodes;
	data?: object;
	checks?: (response: any) => void;
	outputData?: object;
}

export default function ({
	server,
	verb,
	urls,
	data,
	statusCode,
	checks,
	outputData,
}: routeProcessorParams) {
	return async function () {
		const tokens = await users.getUserTokens();
		tokens.should.not.be.empty;
		for (let url of urls) {
			for (let token of tokens) {
				const response = await chai
					.request(server)
					[verb](url)
					.send(data)
					.auth(token, { type: 'bearer' });
				response.should.have.status(statusCode);
				checks && checks(response.body);
				debugger;
				outputData = response.body;
			}
		}
	};
}
