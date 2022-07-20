modules.export = `
create table if not exists shopping_cart (
	cart_id				serial			primary key,
	customer_id			int				not null	references	customer	on	update	cascade,
	made				timestamptz		not null	default	now()
);
`
