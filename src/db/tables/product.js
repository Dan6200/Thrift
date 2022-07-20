module.exports = `
create table if not exists ecommerce_app.product (
	product_id			serial				primary key,
	product_title		varchar,
	product_category	varchar,
	description			varchar,
	list_price			numeric(19,4),
	net_price			numeric(19,4),
	vendor_id			int					not null		references	ecommerce_app.vendor		on	update	cascade,
	shop_id				int					unique			references	ecommerce_app.shop		on	update	cascade,
	quantity_available	int					not null,
	is_flagship			boolean				not null
)
`
