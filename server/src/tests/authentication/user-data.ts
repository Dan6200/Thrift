// Note do not convert to camelCase, keep at hyphen-separated.
// For efficiency and to reduce complexity when sending the data to the database.
// Programmatically converting to hyphen-separated for a large table can be expensive
const newUsers: Array<Object> = [
	{
		first_name: 'Ebuka',
		last_name: 'Eze',
		email: 'ebukachibueze5489@gmail.com',
		phone: null,
		password: 'EbukaDa1!',
		dob: '1999-07-01',
		country: 'Nigeria',
		ipAddress: '168.89.91.45',
		is_vendor: false,
		is_customer: true,
	},

	{
		first_name: 'Mustapha',
		last_name: 'Mohammed',
		email: null,
		phone: '2348063245973',
		password: '123AishaBaggy9384',
		dob: '2000-10-19',
		country: 'Nigeria',
		ip_address: '198.79.78.23',
		is_vendor: true,
		is_customer: false,
	},

	{
		first_name: 'Aisha',
		last_name: 'Mohammed',
		email: null,
		phone: '23490253954889',
		password: '236!A15HA04',
		dob: '2004-6-23',
		country: 'Nigeria',
		ip_address: '198.79.78.45',
		is_vendor: false,
		is_customer: true,
	},
];

const loginUsers: Array<Array<Object>> = [
	[
		{
			email: 'ebukachibueze5489@gmail.com',
			password: 'EbukaDa1!',
		},

		{
			phone: '2348063245973',
			password: '123AishaBaggy9384',
		},

		{
			phone: '23490253954889',
			password: '236!A15HA04',
		},
	],

	[
		{
			email: 'ebukachibueze5489@gmail.com',
			password: 'EbukaDa1!',
		},

		{
			phone: '2348063243958197',
			password: '123AishaBaggy9384',
		},

		{
			phone: '23490253954889',
			password: 'jayafd3245XF*!&$',
		},

		{
			email: 'mustymomo1019@yahoo.com',
			password: '123AishaBaggy9384',
		},
	],
];

interface Users {
	_user: string[];
	push(token: string): Promise<void>;
	clear(): Promise<void>;
	getUserTokens(): Promise<Array<string>>;
}

const users: Users = {
	_user: [],
	async push(data) {
		this._user.push(data);
	},
	async clear() {
		this._user = [];
	},
	async getUserTokens() {
		return this._user;
	},
};

const updatedUser: Array<Object> = [
	{
		dob: '1995-12-31',
		last_name: 'Joyce',
		is_vendor: false,
	},

	{
		email: 'mustymomo1019@yahoo.com',
		phone: '2348063243958197',
		is_vendor: false,
	},

	{
		dob: '1995-12-31',
		old_password: '236!A15HA04',
		new_password: 'jayafd3245XF*!&$',
		is_vendor: true,
		is_customer: true,
	},
];

export { newUsers, loginUsers, updatedUser, users };
