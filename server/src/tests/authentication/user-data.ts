const newUsers: Array<Object> = [
	{
		firstName: 'Ebuka',
		lastName: 'Eze',
		email: 'ebukachibueze5489@gmail.com',
		password: 'EbukaDa1!',
		ipAddress: '168.89.91.45',
		country: 'Nigeria',
		dob: '1999-07-01',
		isVendor: false,
		isCustomer: true,
	},

	{
		firstName: 'Mustapha',
		lastName: 'Mohammed',
		phone: '2348063245973',
		password: '123AishaBaggy9384',
		ipAddress: '198.79.78.23',
		country: 'Nigeria',
		dob: '2000-10-19',
		isVendor: true,
		isCustomer: false,
	},

	{
		firstName: 'Aisha',
		lastName: 'Mohammed',
		phone: '23490253954889',
		password: '236!A15HA04',
		ipAddress: '198.79.78.45',
		country: 'Nigeria',
		dob: '2004-6-23',
		isVendor: false,
		isCustomer: true,
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
		lastName: 'Joyce',
		isVendor: false,
	},

	{
		email: 'mustymomo1019@yahoo.com',
		phone: '2348063243958197',
		isVendor: false,
	},

	{
		dob: '1995-12-31',
		oldPassword: '236!A15HA04',
		newPassword: 'jayafd3245XF*!&$',
		isVendor: true,
		isCustomer: true,
	},
];

export { newUsers, loginUsers, updatedUser, users };
