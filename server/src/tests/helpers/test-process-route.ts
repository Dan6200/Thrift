import { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import chaiRequest from './chai-request';
const filename = path.basename(__filename);

interface routeProcessorParams {
	server: Express;
	verb: string;
	baseUrl: string;
	statusCode: StatusCodes;
	dataMatrix?: object[][];
	checks?: (response: any) => void;
	parameter?: string;
}

export default function ({
	server,
	verb,
	baseUrl,
	dataMatrix,
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
		params && params.length.should.equal(new Set(params).size);
		// tokens should be unique to avoid duplicate id's
		do {
			let token = tokens && tokens[count];
			// test both route(path) parameters and query parameters
			let param = params && params[count];
			token ??= '';
			param ??= '';
			let url = baseUrl + (param ? '/' + param : '');
			// Test each data object in the list parameter
			let dataList = dataMatrix && dataMatrix[count];
			let count2 = 0;
			do {
				let data = dataList && dataList[count2];
				response = await chaiRequest(server, verb, url, token, data);
				response.should.have.status(statusCode);
				if (Object.keys(response.body).length) {
					checks && checks(response.body);
					responseList.push(response.body);
				}
				count2++;
			} while (dataList && count2 < dataList.length);
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
