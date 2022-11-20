// cspell:disable
const newUsers: Array<object> = [
	{
		first_name: 'Ebuka',
		last_name: 'Eze',
		email: 'ebukachibueze5489@gmail.com',
		phone: '+2348063249250',
		password: 'EbukaDa1!',
		dob: '1999-07-01',
		country: 'Nigeria',
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
		ip_address: '198.79.78.45',
	},
];

const loginUsers: Array<object> = [
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
];

interface Users {
	userData: object;
	set(field: string, data: string | object): Promise<void>;
	reset(field: string): Promise<void>;
	get(field: string): Promise<Array<string>>;
}

const userDataTesting: Users = {
	userData: {},
	async set(field, data) {
		this.userData[field].push(data);
	},
	async reset(field) {
		this.userData[field] = [];
	},
	async get(field) {
		return this.userData[field];
	},
};

const updateUser: Array<object> = [
	{
		dob: '1995-12-31',
		country: 'Ghana',
	},
];

const updateUserPassword: Array<object> = [
	/* TODO: since it runs for each function, this should not work */
	{ password: 'EbukaDa1!', new_password: 'jayafd3245XF*!&$' },
	{ password: '123AishaBaggy9384', new_password: '2t295AishaBaby$<5%>!' },
	{ password: '236!A15HA04', new_password: 'sgsdlaWEWRsdf23@#%#@' },
];

export {
	newUsers,
	loginUsers,
	updateUser,
	updateUserPassword,
	userDataTesting,
	Users,
};
