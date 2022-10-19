/*
	product_id			bigserial				primary key,
	title				varchar,
	category			varchar,
	description			varchar,
	list_price			numeric(19,4),
	net_price			numeric(19,4),
	shop_id				bigserial					unique			not null		references	shop		on	delete	restrict,
	quantity_available	int					not null,
	is_flagship			boolean				not null
	*/
