import chai from 'chai';
import { Express } from 'express';
import chaiHttp from 'chai-http';
import { users } from 'tests/authentication/user-data';
import { StatusCodes } from 'http-status-codes';
chai.use(chaiHttp).should();

const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes;
interface routeProcessorParams {
	server: Express;
	verb: string;
	urls: string[];
	statusCode: StatusCodes;
	dataList?: object[];
	checks?: (response: any) => void;
	outputData?: object;
}

const chaiRequest = async (
	token: string,
	server: Express,
	verb: string,
	url: string,
	data?: object
) => {
	return await chai
		.request(server)
		[verb](url)
		.send(data)
		.auth(token, { type: 'bearer' });
};

export default function ({
	server,
	verb,
	urls,
	dataList,
	statusCode,
	checks,
	outputData,
}: routeProcessorParams) {
	return async function () {
		const tokens = await users.getUserTokens();
		tokens.should.not.be.empty;
		let response: any;
		debugger;
		for (let url of urls) {
			for (let token of tokens) {
				if (dataList && dataList.length) {
					for (let data of dataList) {
						response = await chaiRequest(
							token,
							server,
							verb,
							url,
							data
						);
					}
				} else {
					response = await chaiRequest(token, server, verb, url);
				}
				response.should.have.status(statusCode);
				checks && checks(response.body);
				outputData = response.body;
			}
		}
	};
}
