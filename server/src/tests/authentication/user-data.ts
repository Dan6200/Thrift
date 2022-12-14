// cspell:disable
interface user {
	first_name?: string;
	last_name?: string;
	email?: string;
	phone?: string;
	password?: string;
	dob?: string;
	country?: string;
	ip_address?: string;
}

const newUsers: Array<user> = [
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

const loginUsers: Array<user> = [
	{ email: 'ebukachibueze5489@gmail.com', password: 'EbukaDa1!' },
	{ phone: '2348063245973', password: '123AishaBaggy9384' },
	{ phone: '234902539488', password: '236!A15HA04' },
];

const updateUser: object[][] = [
	[{ ip_address: '198.79.78.45', country: 'Ghana' }],
	[{ dob: '1995-12-31', phone: '+2348073249250' }],
	[{ last_name: 'Buhari' }],
];

const updateUserPassword: object[][] = [
	[{ password: 'EbukaDa1!', new_password: 'jayafd3245XF*!&$' }],
	[{ password: '123AishaBaggy9384', new_password: '2t295AishaBaby$<5%>!' }],
	[{ password: '236!A15HA04', new_password: 'sgsdlaWEWRsdf23@#%#@' }],
];

export { newUsers, loginUsers, updateUser, updateUserPassword };
