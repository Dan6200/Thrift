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
	parameter: string;
	baseUrl: string;
	statusCode: StatusCodes;
	dataList?: object[];
	checks?: (response: any) => void;
	users?: Users;
	productIds?: AsyncList<string>;
	setParams?: (parameter: string, data: any) => Promise<void>;
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
	parameter,
	baseUrl,
	dataList,
	statusCode,
	checks,
	users,
	setParams,
}: routeProcessorParams) {
	return async function (): Promise<void> {
		let response: any;
		let count = 0;
		if (users) {
			const tokens = await users.get('tokens');
			tokens.should.not.be.empty;
			const params = users.get(parameter);
			do {
				let token = tokens[count];
				let url = baseUrl + (params ? '/' + params[count] : '');
				let count1 = 0;
				do {
					let data = dataList && dataList[count1];
					response = await chaiRequest(
						server,
						verb,
						url,
						token,
						data
					);
					count1++;
				} while (dataList && count1 < dataList.length);
				response.should.have.status(statusCode);
				if (Object.keys(response.body).length) {
					checks && checks(response.body);
					setParams && setParams(parameter, response.body);
				}
				count++;
			} while (tokens && count < tokens.length);
		}
	};
}
