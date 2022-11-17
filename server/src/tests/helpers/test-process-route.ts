import chai from 'chai';
import { Express } from 'express';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
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
}: routeProcessorParams) {
	return async function (
		tokens?: string[],
		params?: string[]
	): Promise<typeof returnData> {
		let response: any,
			count = 0,
			responseList: any[] = [];
		tokens && tokens.should.not.be.empty;
		tokens && tokens.length.should.equal(new Set(tokens).size);
		// tokens should be unique to avoid duplicate id's
		do {
			let token = tokens && tokens[count];
			let param = params && params[count];
			token ??= '';
			param ??= '';
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
				responseList.push(response.body);
			}
			count++;
		} while (tokens && count < tokens.length);
		let returnData: {
			responseList?: any[];
			authTokens?: string[];
		};
		returnData = { responseList, authTokens: tokens };
		return returnData;
	};
}
