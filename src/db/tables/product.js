modules.export = `
create table if not exists product (
	product_id			serial				primary key,
	product_title		varchar,
	product_category	varchar,
	description			varchar,
	list_price			numeric(19,4),
	net_price			numeric(19,4),
	vendor_id			int					not null		references	vendor		on	update	cascade,
	shop_id				int					unique			references	shop		on	update	cascade,
	quantity_available	int					not null,
	is_flagship			boolean				not null
);
`
