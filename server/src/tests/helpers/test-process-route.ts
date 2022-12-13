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
	dataList?: object[];
	checks?: (response: any) => void;
	parameter?: string;
}

function singleData({
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
			let count2 = 0;
			do {
				// test both route(path) parameters and query parameters
				let param = params && params[count2];
				token ??= '';
				param ??= '';
				let url = baseUrl + (param ? '/' + param : '');
				// Test each data object in the list parameter
				let data = dataList && dataList[count];
				response = await chaiRequest(server, verb, url, token, data);
				response.should.have.status(statusCode);
				if (Object.keys(response.body).length) {
					checks && checks(response.body);
					responseList.push(response.body);
				}
				count2++;
			} while (params && count2 < params.length);
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

function multiData({
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
			let count2 = 0;
			do {
				// test both route(path) parameters and query parameters
				let param = params && params[count2];
				token ??= '';
				param ??= '';
				let url = baseUrl + (param ? '/' + param : '');
				let count3 = 0;
				do {
					// Test each data object in the list parameter
					let data = dataList && dataList[count3];
					response = await chaiRequest(
						server,
						verb,
						url,
						token,
						data
					);
					response.should.have.status(statusCode);
					if (Object.keys(response.body).length) {
						checks && checks(response.body);
						responseList.push(response.body);
					}
					count3++;
				} while (dataList && count3 < dataList.length);
				count2++;
			} while (params && count2 < params.length);
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

export { singleData, multiData };
