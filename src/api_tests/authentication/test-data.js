const newUsers = [
	{
		first_name	:'Ebuka',
		last_name	:'Eze',
		email		:'ebukachibueze5489@gmail.com',
		password	:'EbukaDa1!',
		ip_address	:'168.89.91.45',
		country		:'Nigeria',
		dob			:'1999-07-01',
		is_vendor	: false,
		is_customer	: true,
	},

	{
		first_name	: 'Mustapha',
		last_name	: 'Mohammed',
		phone		: '2348063245973',
		password	: '123AishaBaggy9384',
		ip_address	: '198.79.78.23',
		country		: 'Nigeria',
		dob			: '2000-10-19',
		is_vendor	: true,
		is_customer	: false,
	},

	{
		first_name	: 'Aisha',
		last_name	: 'Mohammed',
		phone		: '23490253954889',
		password	: '236!A15HA04',
		ip_address	: '198.79.78.45',
		country		: 'Nigeria',
		dob			: '2004-6-23',
		is_vendor	: false,
		is_customer	: true,
	},

]

const loginUsers = [
	[
		{
			email		:'ebukachibueze5489@gmail.com',
			password	:'EbukaDa1!',
		},

		{
			phone		: '2348063245973',
			password	: '123AishaBaggy9384',
		},

		{
			phone		: '23490253954889',
			password	: '236!A15HA04',
		},
	],

	[
		{
			email		:'ebukachibueze5489@gmail.com',
			password	:'EbukaDa1!',
		},

		{
			phone		: '2348063243958197',
			password	: '123AishaBaggy9384',
		},

		{
			phone		: '23490253954889',
			password	: 'jayafd3245XF*!&$',
		},

		{
			email		:	'mustymomo1019@yahoo.com',
			password	: '123AishaBaggy9384',
		}
	],
]

let user = {}

const updatedUser = [
	{
		dob			:	'1995-12-31',
		last_name	:	'Joyce',
		is_vendor	:	false,
	},
	
	{
		email		:	'mustymomo1019@yahoo.com',
		phone		:	'2348063243958197',
		is_vendor	:	false,
	},

	{
		dob				:	'1995-12-31',
		old_password	: 	'236!A15HA04',
		new_password	:	'jayafd3245XF*!&$',
		is_vendor		:	true,
		is_customer		:	true,
	},
]

module.exports = {
	newUsers,
	loginUsers,
	updatedUser,
	user,
}
