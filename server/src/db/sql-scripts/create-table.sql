drop table if exists user_account cascade;

create table if not exists user_account (
	user_id					bigserial 			primary key,
	first_name				varchar(30)		not null,
	last_name				varchar(30)		not null,
	email					varchar(320)	unique
	check (email ~* '^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'),			
	phone		 			varchar(40)		unique
	check (phone ~* '^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$'),			
	password				bytea			not null,
	dob						date			not null,
	country					varchar			not null,
	ip_address				varchar,
	check (current_date - dob > 12)
);

create table if not exists customer (
	customer_id			bigserial 		primary key	references	user_account	on	delete	cascade
);

drop table if exists shipping_info cascade;

create table if not exists shipping_info (
	address_id				bigserial			primary key,
	customer_id				bigserial				not null		references	customer	on	delete	cascade,
	recepient_first_name	varchar(30)		not null,
	recepient_last_name		varchar(30)		not null,
	street					varchar			not null,
	postal_code				varchar			not null,
	delivery_contact		varchar			not	null,
	delivery_instructions	varchar,
	is_primary				boolean			not null
);

create table if not exists vendor (
	vendor_id		bigserial 		primary key	references	user_account	on	delete	cascade
);

drop table if exists shop cascade;

create table if not exists shop (
	shop_id					bigserial			primary key,	
	shop_name				varchar				not null 	default 	'My Shop',
	vendor_id 				bigserial			not null 	unique 		references	vendor	on	delete	cascade,
	date_created			date				not null	default		current_date,
	banner_image_path			varchar
);

drop table if exists product cascade;

create table if not exists product (
	product_id			bigserial				primary key,
	title				varchar,
	category			varchar,
	description			varchar,
	list_price			numeric(19,4),
	net_price			numeric(19,4),
	shop_id				bigserial					unique			not null		references	shop		on	delete	restrict,
	quantity_available	int					not null,
	is_flagship			boolean				not null
);

drop table if exists product_media cascade;

create table if not exists product_media (
	product_id					bigserial				primary key		references	product	on	delete	cascade,
	main_product_image			varchar,
	sec_product_image1			varchar,
	sec_product_image2			varchar,
	sec_product_image3			varchar,
	product_video				varchar
);

/* TODO: review this shopping cart functionality to see if it is rigorous enough
	...this is would be a transaction type of operation. */
drop table if exists shopping_cart cascade;

create table if not exists shopping_cart (
	cart_id				bigserial			primary key,
	customer_id			bigserial				not null	references	customer	on	delete	cascade,
	made				timestamptz		not null	default	now()
);

drop table if exists shopping_cart_item cascade;

create table if not exists shopping_cart_item (
	item_id					bigserial			primary	key,
	cart_id					bigserial				not null		references	shopping_cart	on 	delete	cascade,
	product_id				bigserial				not null		references	product		on delete	cascade,
	product_quantity		int				not null		check (product_quantity > 0)
);

drop table if exists transaction cascade;

create table if not exists transaction (
	transaction_id				bigserial			primary	key,
	transaction_timestamp		timestamptz		not null		default	now()	unique,
	customer_id					bigserial				not null		references	customer	on	delete	restrict,
	vendor_id					bigserial				not null		references	vendor	on	delete	restrict,
	transaction_amount			numeric(19,4)	not null,
	foreign key	(vendor_id)		references	vendor		on	delete	restrict,
	check (customer_id <> vendor_id)
);

drop table if exists transaction_item cascade;

create table if not exists transaction_item (
	item_id					bigserial			primary	key,
	product_id				bigserial				not null		references	product		on delete	restrict,
	product_quantity		int				not null		default	1	check (product_quantity > 0)
);

drop table if exists reversed_transaction cascade;

create table if not exists reversed_transaction (
	rev_transaction_id		bigserial			primary	key	references	transaction		on	delete	restrict,
	rev_trans_timestamp			timestamptz		not null	default	now()	unique
);

drop table if exists product_review cascade;

create table if not exists product_review (
	review_id				bigserial			primary key,
	product_id				bigserial				not null	references	product		on	delete	cascade,
	transaction_id			bigserial				not null	references	transaction	on	delete	cascade,
	rating					numeric(3,2)	not null,
	customer_id				bigserial				not	null	references	customer	on	delete	cascade,
	customer_remark			varchar
);

drop table if exists vendor_review cascade;

create table if not exists vendor_review (
	review_id				bigserial			primary key,
	vendor_id				bigserial				not	null		references	vendor on delete cascade,
	customer_id				bigserial				not null		references	customer on delete cascade,
	transaction_id			bigserial				not null		references	transaction on delete cascade,
	rating					numeric(3,2)	not null,
	customer_remark			varchar
);
