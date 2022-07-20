modules.export = `
create table if not exists shopping_cart_item (
	items_id				serial			primary	key,
	cart_id					int				not null		references	shopping_cart	on 	update	cascade,
	product_id				int				not null		references	product		on update	cascade,
	product_quantity		int				not null		default	1	check (product_quantity > 0)
);
`
