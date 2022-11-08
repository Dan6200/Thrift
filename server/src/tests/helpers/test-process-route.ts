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
	users?: Users;
	productIds?: AsyncList<string>;
	setParams?: (params: string[], data: any) => void;
}

const chaiRequest = async (
	server: Express,
	verb: string,
	url: string,
	token?: string,
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
	users,
	productIds,
	setParams,
}: routeProcessorParams) {
	return async function (): Promise<any[]> {
		const tokens = users && (await users.getUserTokens());
		let response: any,
			responseData: any[] = [];
		debugger;
		let count = 0;
		const Ids = productIds && (await productIds.getList());
		do {
			let token = tokens && tokens[count];
			let urlWithParams = url + (Ids ? '/' + Ids[count] : '');
			let count1 = 0;
			do {
				let data = dataList && dataList[count1];
				response = await chaiRequest(
					server,
					verb,
					urlWithParams,
					token,
					data
				);
				console.log(tokens, response.body, filename, '\n');
				count1++;
			} while (dataList && count1 < dataList.length);
			response.should.have.status(statusCode);
			checks && checks(response.body);
			responseData.push(response.body);
			count++;
		} while (tokens && count < tokens.length);
		return responseData;
	};
}
