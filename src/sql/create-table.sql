create table if not exists user_account (
	user_id					serial 			primary key,
	first_name				varchar(30)		not null,
	last_name				varchar(30)		not null,
	initials				char(2)			not null,
	email					varchar(320)	unique
	check (email ~* '^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'),			
	phone		 			varchar(40)		unique,			
	password				bytea			not null,
	ip_address				varchar			not null,
	country					varchar			not null,
	dob						date			not null,
	is_vendor				boolean			not null,
	is_customer				boolean			not null,
	check (current_date - dob > 11)
);

create table if not exists customer (
	customer_id			int 		primary key	references	user_account	on	delete	cascade
);

create table if not exists shipping_info (
	address_id				serial			primary key,
	customer_id				int				not null		references	customer	on	delete	cascade,
	recepient_first_name	varchar(30)		not null,
	recepient_last_name		varchar(30)		not null,
	recepient_initials		char(2)			not null,
	street					varchar			not null,
	postal_code				varchar			not null,
	delivery_contact		varchar			not	null,
	delivery_instructions	varchar,
	is_default				boolean			not null
);

create table if not exists vendor (
	vendor_id		int 		primary key	references	user_account	on	delete	cascade
);

create table if not exists shop (
	shop_id					serial			primary key,	
	shop_name				varchar			not null,
	shop_owner				int				references	vendor	on	delete	cascade,
	date_created			date			not null		default		current_date,
	street					varchar,
	postal_code				varchar,
	banner_image			varchar
);

create table if not exists shop_contact (
	contact_id				serial		primary key,
	shop_id					int			not null,	
	email					varchar,
	phone					varchar
);

create table if not exists product (
	product_id			serial				primary key,
	product_title		varchar,
	product_category	varchar,
	description			varchar,
	list_price			numeric(19,4),
	net_price			numeric(19,4),
	vendor_id			int					not null		references	vendor		on	delete	cascade,
	shop_id				int					unique			references	shop		on	delete	cascade,
	quantity_available	int					not null,
	is_flagship			boolean				not null
);

/* TODO: review this shopping cart functionality to see if it is rigorous enough
	...this is would be a transaction type of operation. */
create table if not exists shopping_cart (
	cart_id				serial			primary key,
	customer_id			int				not null	references	customer	on	delete	cascade,
	made				timestamptz		not null	default	now()
);

create table if not exists shopping_cart_item (
	items_id				serial			primary	key,
	cart_id					int				not null		references	shopping_cart	on 	delete	cascade,
	product_id				int				not null		references	product		on delete	cascade,
	product_quantity		int				not null		default	1	check (product_quantity > 0)
);

create table if not exists transaction (
	transaction_id				serial			primary	key,
	transaction_timestamp		timestamptz		not null		default	now()	unique,
	transacted_items_id			int				not null		references shopping_cart	on delete	cascade,
	customer_id					int				not null		references	customer	on	delete	cascade,
	vendor_id					int				not null,
	transaction_amount			numeric(19,4)	not null,
	foreign key	(vendor_id)		references	vendor		on	delete	cascade,
	check (customer_id <> vendor_id)
);

create table if not exists reversed_transaction (
	rev_transaction_id		int			primary	key	references	transaction		on	delete	cascade,
	rev_trans_timestamp			timestamptz		not null	default	now()	unique
);

create table if not exists product_review (
	review_id				serial			primary key,
	product_id				int				not null	references	product		on	delete	cascade,
	transaction_id			int				not null	references	transaction	on	delete	cascade,
	rating					numeric(3,2)	not null,
	customer_id				int				not	null	references	customer	on	delete	cascade,
	customer_remark			varchar
);

create table if not exists vendor_review (
	review_id				serial			primary key,
	vendor_id				int				not	null		references	vendor on delete cascade,
	customer_id				int				not null		references	customer on delete cascade,
	transaction_id			int				not null		references	transaction on delete cascade,
	rating					numeric(3,2)	not null,
	customer_remark			varchar
);

create table if not exists product_media (
	product_id					int				primary key		references	product	on	delete	cascade,
	main_product_image			varchar,
	sec_product_image1			varchar,
	sec_product_image2			varchar,
	sec_product_image3			varchar,
	sec_product_image4			varchar,
	sec_product_image5			varchar,
	product_video				varchar
);
