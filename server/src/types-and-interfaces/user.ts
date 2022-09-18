interface UserData {
	first_name: string;
	last_name: string;
	email: string | null;
	phone: string | null;
	password: Buffer;
	dob: Date;
	country: string;
	is_vendor: boolean;
	is_customer: boolean;
	ip_address: string | null;
}

export { UserData };
