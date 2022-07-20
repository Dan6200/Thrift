module.exports = `
create table if not exists ecommerce_app.shopping_cart_item (
	items_id				serial			primary	key,
	cart_id					int				not null		references	ecommerce_app.shopping_cart	on 	update	cascade,
	product_id				int				not null		references	ecommerce_app.product		on update	cascade,
	product_quantity		int				not null		default	1	check (product_quantity > 0)
)
`
