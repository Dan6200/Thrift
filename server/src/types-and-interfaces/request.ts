import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

interface RequestWithPayload extends Request {
	user: RequestUserPayload;
}

interface RequestUserPayload extends JwtPayload {
	userId: string;
	phone?: string;
	email?: string;
}

export { RequestWithPayload, RequestUserPayload };
