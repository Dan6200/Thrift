import { Request } from 'express';
import Joi from 'joi';
import { JwtPayload } from 'jsonwebtoken';

const UserDataSchema = Joi.object({
	first_name: Joi.string().alphanum().min(3).max(30).required(),
	last_name: Joi.string().alphanum().min(3).max(30).required(),
	password: Joi.binary().required(),
	email: Joi.string().regex().required(),
});

class UserData {
	constructor(dbUserData: any) {
		if (dbUserData) {
			this.first_name = dbUserData.first_name;
			this.last_name = dbUserData.last_name;
			this.email = dbUserData.email;
			this.phone = dbUserData.phone;
			this.password = dbUserData.password;
			this.ip_address = dbUserData.ip_address;
			this.country = dbUserData.country;
			this.dob = dbUserData.dob;
			this.is_vendor = dbUserData.is_vendor;
			this.is_customer = dbUserData.is_customer;
		}
	}
	first_name: string;
	last_name: string;
	email: string | null;
	phone: string | null;
	password: ArrayBuffer;
	ip_address: string | null;
	country: string;
	dob: Date;
	is_vendor: boolean;
	is_customer: boolean;
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
