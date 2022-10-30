import chai from 'chai';
import { Express } from 'express';
import chaiHttp from 'chai-http';
import { users } from 'tests/authentication/user-data';
import { StatusCodes } from 'http-status-codes';
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
	return async function (urlParams: null | string[]): Promise<string[]> {
		const tokens = await users.getUserTokens();
		tokens.should.not.be.empty;
		let response: any,
			newUrlParams: string[] = [''];
		urlParams ??= [''];
		for (let param of urlParams) {
			// Add the parameter list to the url
			url += param != '' ? '/' + param : param;
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
			}
		}
		setParams && setParams(newUrlParams, response.body);
		return newUrlParams;
	};
}
