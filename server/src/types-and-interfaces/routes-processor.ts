import { StatusCodes } from 'http-status-codes';
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes;
type Status = typeof CREATED | typeof OK | typeof NO_CONTENT | typeof NOT_FOUND;

type ResponseData = {
	status: Status;
	data?: string | object;
};

export { Status, ResponseData };
