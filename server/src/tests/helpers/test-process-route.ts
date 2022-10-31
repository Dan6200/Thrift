import chai from 'chai';
import { Express } from 'express';
import chaiHttp from 'chai-http';
import { users } from 'tests/authentication/user-data';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
const filename = path.basename(__filename);
chai.use(chaiHttp).should();

interface routeProcessorParams {
	server: Express;
	verb: string;
	url: string;
	statusCode: StatusCodes;
	dataList?: object[];
	checks?: (response: any) => void;
	setParams?: (params: string[], data: any) => void;
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
	url,
	dataList,
	statusCode,
	checks,
	setParams,
}: routeProcessorParams) {
	return async function (urlParams: null | string[]): Promise<void> {
		const tokens = await users.getUserTokens();
		tokens.should.not.be.empty;
		let response: any,
			newUrlParams: string[] = [];
		debugger;
		console.log('url parameters: ', urlParams, 'at ' + filename);
		let count = 0;
		for (let token of tokens) {
			// set the url parameters
			url +=
				urlParams && urlParams[count] ? '/' + urlParams[count++] : '';
			console.log(verb, url, 'at ' + filename);
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
			console.log(response.body, 'at ' + filename);
			setParams && setParams(newUrlParams, response.body);
			checks && checks(response.body);
		}
		urlParams = newUrlParams;
		console.log('url parameters: ', urlParams, 'at ' + filename);
	};
}
