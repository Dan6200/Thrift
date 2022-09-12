// DB Schema:
//	   address_id				serial			primary key,
//	   customer_id				int				not null		references	user_account	on	delete	cascade,
//	   recepient_first_name	varchar(30)		not null,
//	   recepient_last_name		varchar(30)		not null,
//	   street					varchar			not null,
//	   postal_code				varchar			not null,
//	   delivery_contact		varchar			not	null,
//	   delivery_instructions	varchar,
//	   is_default				boolean			not null
//
const newShippingData = [
	{
		recepient_first_name: 'John',
		recepient_last_name: 'Doe',
		street: '24 Street',
		postal_code: '123435',
		delivery_contact: '23460581795',
		delivery_instructions: 'Call me before you arrive!',
		is_default: true,
	},
];

const updateShippingData = [
	{ recepient_first_name: 'Jane', delivery_contact: '234957292623654' },
];

export { newShippingData, updateShippingData };
