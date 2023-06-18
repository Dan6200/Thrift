drop schema if exists public cascade;
create schema if not exists public;

create table if not exists user_accounts (
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
	check (current_date - dob > 12)
);


create table if not exists customers (
	customer_id			bigint 		primary key	references	user_accounts	on	delete	cascade
);


create table if not exists shipping_info (
	address_id				bigserial		primary key,
	customer_id				bigint			not null		references	customers	on	delete	cascade,
	recipient_first_name	varchar(30)		not null,
	recipient_last_name		varchar(30)		not null,
	address					varchar			not null,
	city					varchar			not null,
	state					varchar			not null,
	postal_code				varchar			not null,
	delivery_contact		varchar			not	null,
	delivery_instructions	varchar
);

create table if not exists payment_info (
	address_id				bigserial		primary key,
	customer_id				bigint			not null		references	customers	on	delete	cascade,
	recipient_first_name	varchar(30)		not null,
	recipient_last_name		varchar(30)		not null,
	address					varchar			not null,
	city					varchar			not null,
	state					varchar			not null,
	postal_code				varchar			not null,
	delivery_contact		varchar			not	null,
	delivery_instructions	varchar
);



create table if not exists vendors (
	vendor_id		bigserial 		primary key	references	user_accounts	on	delete	cascade
);


create table if not exists stores (
	store_id				bigserial			primary key,	
	store_name				varchar				not null,
	vendor_id 				bigint				not null 	references	vendors	on	delete	cascade,
	store_page 				jsonb,
	date_created			date				not null	default		current_date
);


create table if not exists products (
	product_id			bigserial			primary key,
	title				varchar,
	category			varchar,
	description			varchar,
	list_price			numeric(19,4),
	net_price			numeric(19,4),
	vendor_id 			bigint				not null,
	store_id			bigint 				not null 		references 	stores on delete cascade,
	list_date			date				not null		default		current_date,
	quantity_available	int					not null
);


create table if not exists product_media (
	product_id					bigint				not null		references	products	on	delete	cascade,
	filename 					varchar 			primary key,
	filepath 					varchar 			not null,
	description					varchar
);


create table if not exists shopping_cart (
	cart_id				bigserial			primary key,
	customer_id			bigint				not null	references	customers	on	delete	cascade,
	made				timestamptz		not null	default	now()
);


create table if not exists shopping_cart_item (
	item_id					bigserial			primary	key,
	cart_id					bigint				not null		references	shopping_cart	on 	delete	cascade,
	product_id				bigint				not null		references	products		on delete	cascade,
	product_quantity		int				not null		check (product_quantity > 0)
);


create table if not exists transaction_details (
	transaction_id				bigserial			primary	key,
	transaction_timestamp		timestamptz			not null		default	now()	unique,
	customer_id					bigint				not null,
	vendor_id					bigint				not null,
	transaction_amount			numeric(19,4)		not null,
	check (customer_id <> vendor_id)
);


create table if not exists purchases (
	item_id					bigserial		primary	key,
	product_id				bigint			not null		references	products		on delete	cascade,
	transaction_id			bigint			not null		references	transaction on delete cascade,
	product_quantity		int				not null		default	1	check (product_quantity > 0)
);


create table if not exists reversed_transaction (
	transaction_id			bigint			primary	key	references	transaction		on	delete	cascade,
	reverse_timestamp		timestamptz		not null	default	now()	unique
);


create table if not exists product_reviews (
	product_id				bigint				primary key references	products		on	delete	cascade,
	transaction_id			bigint				not null	references	transaction	on	delete	cascade,
	rating					numeric(3,2)		not null,
	customer_id				bigint				not	null	references	customers	on	delete	cascade,
	customer_remark			varchar
);


create table if not exists vendor_reviews (
	vendor_id				bigint				primary key 	references	vendors on delete cascade,
	customer_id				bigint				not null		references	customers on delete cascade,
	transaction_id			bigint				not null		references	transaction on delete cascade,
	rating					numeric(3,2)	not null,
	customer_remark			varchar
);


create table if not exists customer_reviews (
	customer_id				bigint				primary key 	references	customers on delete cascade,
	vendor_id				bigint				not null		references	vendors on delete cascade,
	transaction_id			bigint				not null		references	transaction on delete cascade,
	rating					numeric(3,2)	not null,
	vendor_remark			varchar
);
