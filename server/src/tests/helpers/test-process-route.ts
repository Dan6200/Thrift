import chai from 'chai';
import { Express } from 'express';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import { Users, userDataTesting } from 'tests/authentication/user-data';
import AsyncList from 'types-and-interfaces/async-list';
const filename = path.basename(__filename);
chai.use(chaiHttp).should();

interface routeProcessorParams {
	server: Express;
	verb: string;
	baseUrl: string;
	statusCode: StatusCodes;
	dataList?: object[];
	checks?: (response: any) => void;
	parameter?: string;
	setParams?: (data: any) => Promise<void>;
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
	baseUrl,
	dataList,
	statusCode,
	checks,
	parameter,
	setParams,
}: routeProcessorParams) {
	return async function (): Promise<void> {
		let response: any;
		let count = 0;
		const tokens = await userDataTesting.get('tokens');
		tokens.should.not.be.empty;
		const params = await userDataTesting.get(parameter as string);
		do {
			let token = tokens[count];
			let param = params && params[count];
			let url = baseUrl + (param ? '/' + param : '');
			let count1 = 0;
			do {
				let data = dataList && dataList[count1];
				response = await chaiRequest(server, verb, url, token, data);
				count1++;
			} while (dataList && count1 < dataList.length);
			response.should.have.status(statusCode);
			if (Object.keys(response.body).length) {
				checks && checks(response.body);
				setParams && (await setParams(response.body));
			}
			count++;
		} while (tokens && count < tokens.length);
	};
}
