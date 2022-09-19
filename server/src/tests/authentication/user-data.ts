// Note do not convert to camelCase, keep at hyphen-separated.
// For efficiency and to reduce complexity when sending the data to the database.
// Programmatically converting to hyphen-separated for a large table can be expensive
const newUsers: Array<Object> = [
	{
		first_name: 'Ebuka',
		last_name: 'Eze',
		email: 'ebukachibueze5489@gmail.com',
		phone: '+2348063249250',
		password: 'EbukaDa1!',
		dob: '1999-07-01',
		country: 'Nigeria',
		is_vendor: false,
		is_customer: true,
		ip_address: '168.89.91.45',
	},

	{
		first_name: 'Mustapha',
		last_name: 'Mohammed',
		email: 'mustymomo1019@outlook.com',
		phone: '2348063245973',
		password: '123AishaBaggy9384',
		dob: '2000-10-19',
		country: 'Nigeria',
		is_vendor: true,
		is_customer: false,
		ip_address: '198.79.78.23',
	},

	{
		first_name: 'Aisha',
		last_name: 'Mohammed',
		email: 'aishamomo@school.edu',
		phone: '234902539488',
		password: '236!A15HA04',
		dob: '2004-6-23',
		country: 'Nigeria',
		is_vendor: false,
		is_customer: true,
		ip_address: '198.79.78.45',
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
			phone: '234902539488',
			password: '236!A15HA04',
		},
	],

	[
		{
			email: 'ebukachibueze5489@gmail.com',
			password: 'EbukaDa1!',
		},

		{
			phone: '2348063248197',
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

const updateUser: Array<Object> = [
	{
		dob: '1995-12-31',
		last_name: 'Joyce',
		is_vendor: false,
	},

	{
		email: 'mustymomo1019@yahoo.com',
		phone: '2348063248197',
		is_vendor: false,
	},

	{
		dob: '1995-12-31',
		is_vendor: true,
		is_customer: true,
	},
];

const updateUserPassword: Array<Object> = [
	{ password: '236!A15HA04', new_password: 'jayafd3245XF*!&$' },
	{ password: '123AishaBaggy9384', new_password: '2t295AishaBaby$<5%>!' },
	{ password: '236!A15HA04', new_password: 'sgsdlaWEWRsdf23@#%#@' },
];

export { newUsers, loginUsers, updateUser, updateUserPassword, users };
