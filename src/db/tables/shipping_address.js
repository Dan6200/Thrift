module.exports = `
create table if not exists ecommerce_app.shipping_address (
	address_id				serial			primary key,
	customer_id				int				not null		references	ecommerce_app.customer	on	update	cascade,
	recepient_first_name	varchar(30)		not null,
	recepient_last_name		varchar(30)		not null,
	recepient_initials		char(2)			not null,
	street					varchar			not null,
	postal_code				varchar			not null,
	delivery_contact		varchar			not	null,
	delivery_instructions	varchar			not	null,
	is_default				boolean			not null
)
`
