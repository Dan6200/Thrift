import chai from 'chai';
import { Express } from 'express';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import { Users } from 'tests/authentication/user-data';
import AsyncList from 'types-and-interfaces/async-list';
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
	users?: Users;
	productIds?: AsyncList<string>;
}

const chaiRequest = async (
	token?: string,
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
	users,
	productIds,
}: routeProcessorParams) {
	return async function (urlParams: null | string[]): Promise<void> {
		const tokens = users && (await users.getUserTokens());
		console.log('tokens %o %s', tokens, filename);
		let response: any,
			newUrlParams: string[] = [];
		debugger;
		console.log('url parameters: ', urlParams, 'at ' + filename);
		let count = 0;
		do {
			let token = tokens && tokens[count];
			// set the url parameters
			url += urlParams && urlParams[count] ? '/' + urlParams[count] : '';
			console.log(verb, url, 'at ' + filename);
			let count1 = 0;
			do {
				let data = dataList && dataList[count1];
				response = await chaiRequest(token, server, verb, url, data);
				count1++;
			} while (dataList && count1 < dataList.length);
			response.should.have.status(statusCode);
			count++;
		} while (tokens && count < tokens.length);
		console.log(response.body, 'at ' + filename);
		setParams && setParams(newUrlParams, response.body);
		checks && checks(response.body);
		urlParams = newUrlParams;
		console.log('url parameters: ', urlParams, 'at ' + filename);
	};
}
