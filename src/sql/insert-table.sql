insert into  ecommerce_app.user_account (
	first_name,
	last_name,
	initials,
	email,
	phone,
	password_hash,
	ip_address,
	country,
	dob
) values (
	'ebuka',
	'eze',
	'ee',
	'ebukachibueze5489@gmail.com',
	'2349063459623',
	'\xDEADDEED',
	'168.89.91.45',
	'nigeria',
	'1999-07-01'
);
/*

insert into  user_account (
	first_name,
	last_name,
	initials,
	email,
	phone,
	password_hash,
	ip_address,
	country,
	dob
) values (
	'mustapha',
	'mohammed',
	'mm',
	'mustymomo2423@gmail.com',
	'2348063245973',
	'\xDEADBEEF',
	'198.79.78.23',
	'nigeria',
	'2000-10-19'
);



create table if not exists customer (
	customer_id			int 		primary key,
	preferred_currency	varchar		not null,
	foreign	key	(customer_id)	references	user_account	on	update	cascade
);



insert into  customer values (
	1,
	'NGN'
);



create table if not exists shipping_address (
	customer_id				int				primary key		references	customer	on	update	cascade,
	-- Set default value with frontend
	first_name				varchar(30)		not null,
	last_name				varchar(30)		not null,
	initials				char(2)			not null,
	street					varchar			not null,
	postal_code				varchar			not null,
	delivery_contact		varchar			not	null,
	delivery_instructions	varchar			not	null,
	isdefault				boolean			not null
);



insert into  shipping_address (
	customer_id,
	recepient_first_name,
	recepient_last_name,
	recepient_initials,
	street,
	postal_code,
	delivery_contact,
	delivery_instructions,
	is_default
) values (
	1,
	'ebuka',
	'eze',
	'ee',
	'#24 justice yakubu street, gwagalada',
	'100330',
	'234703553900',
	'If I am not home leave it with the security guard on #25 justice yakubu street, give me a call after delivery',
	true
);



create table if not exists vendor (
	vendor_id		int 		primary key	references	user_account	on	update	cascade
);



insert into vendor values (2);



create table if not exists shop (
	shop_id					serial			primary key,	
	shop_name				varchar			not null,
	shop_owner				int				references	vendor	on	update	cascade,
	date_created			date			not null		default		current_date,
	street					varchar,
	postal_code				varchar,
	banner_image			varchar
);



insert into shop (
	shop_name, 
	shop_owner,
	street,
	postal_code
) values (
	'mustyelectronics',
	2,
	'Wuye',
	100245
);



create table if not exists product (
	product_id			serial				primary key,
	product_title		varchar,
	description			varchar,
	list_price			numeric(19,4),
	net_price			numeric(19,4),
	vendor_id			int					not null		references	vendor		on	update	cascade,
	shop_id				int					unique			references	shop		on	update	cascade,
	product_category	varchar,
	quantity_available	int					not null,
	is_flagship			boolean				not null
);



insert into  product (
	product_title,
	product_category,
	description,
	list_price,
	net_price,
	vendor_id,
	shop_id,
	quantity_available,
	is_flagship
) values (
	'Lightning fast adaptor cable',
	'Electronic Accessories',
	'Cable charges super fast, use this cable for your android and iOS smart phones',
	23.99,
	20.99,
	2,
	1,
	23,
	true
);



create table if not exists shopping_cart (
	cart_id				serial			primary key,
	customer_id			int				not null	references	customer	on	update	cascade,
	made				timestamptz		not null	default	now()
);



insert into shopping_cart (customer_id) values (1);



create table if not exists shopping_cart_item (
	items_id				serial			primary	key,
	cart_id					int				not null		references	shopping_cart	on 	update	cascade,
	product_id				int				not null		references	product		on update	cascade,
	product_quantity		int				not null		default	1	check (product_quantity > 0)
);



insert into shopping_cart_item (
	cart_id,
	product_id,
	product_quantity
) values (
	1,
	1,
	3
);



create table if not exists transaction (
	transaction_id				serial			primary	key,
	transaction_timestamp		timestamptz		not null		default	now()	unique,
	transacted_items_id			int				not null		references shopping_cart	on update	cascade,
	customer_id					int				not null		references	customer	on	update	cascade,
	vendor_id					int				not null		check (customer_id <> vendor_id),
	transaction_amount			numeric(19,4)	not null,
	foreign key	(vendor_id)		references	vendor		on	update	cascade
);

insert into transaction (
	transacted_items_id,
	customer_id,
	vendor_id,
	transaction_amount
) values (
	1,
	1,
	2,
	(select sum(net_price * product_quantity) from product join shopping_cart_item using (product_id))
);


create table if not exists reverse_transaction (
	transaction_id				int			primary	key	references	transaction		on	update	cascade,
	rev_trans_timestamp			timestamptz		not null	default	now()	unique
);


insert into reversed_transaction (transaction_id) values (1);

create table if not exists product_review (
	review_id				serial			primary key,
	product_id				int				not null	references	product		on	update	cascade,
	transaction_id			int				not null	references	transaction	on	update	cascade,
	rating					numeric(2,1)	not null,
	customer_id				int				not	null	references	customer	on	update	cascade,
	customer_remark			varchar
);
*/
