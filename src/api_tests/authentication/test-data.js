const newUsers = [
{
	first_name	:'Ebuka',
	last_name	:'Eze',
	initials	:'EE',
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
	initials	: 'MM',
	phone		: '2348063245973',
	password	: '123AishaBaggy9384',
	ip_address	: '198.79.78.23',
	country		: 'Nigeria',
	dob			: '2000-10-19',
	is_vendor	: true,
	is_customer	: false,
},
]

const users = [{
	email		:'ebukachibueze5489@gmail.com',
	password	:'EbukaDa1!',
},
{
	phone		: '2348063245973',
	password	: '123AishaBaggy9384',
},
]

module.exports = {
	newUsers,
	users
}
