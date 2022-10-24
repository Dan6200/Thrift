import chai from 'chai';
import { Express } from 'express';
import chaiHttp from 'chai-http';
chai.use(chaiHttp).should();

interface routeProcessorParams {
	tokens: string[];
	server?: Express;
	verb: string;
	url?: string;
	data?: object;
	constraints?: (response: any) => Promise<void>;
}

export default async function ({
	tokens,
	server,
	verb,
	url,
	data,
	constraints,
}: routeProcessorParams) {
	if (tokens) {
		tokens.should.not.be.empty;
		for (let token of tokens) {
			let response: any;
			response = await chai.request(server)[verb](url);
			if (data) response = await response.send(data);
			response = await response.auth(token, { type: 'bearer' });
			constraints && constraints(response);
		}
	}
}
