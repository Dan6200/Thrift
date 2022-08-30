import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

interface UserData {
	userId: string;
	first_name?: string;
	last_name?: string;
	email?: string;
	phone?: string;
	password?: Buffer;
	ip_address?: string;
	country?: string;
	dob?: Date;
	is_vendor?: boolean;
	is_customer?: boolean;
}

interface RequestWithPayload extends Request {
	user: UserPayload;
}

interface UserPayload extends JwtPayload {
	userId: string;
	phone?: string;
	email?: string;
}

export { RequestWithPayload, UserData, UserPayload };
