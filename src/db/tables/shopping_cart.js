module.exports = `
create table if not exists ecommerce_app.shopping_cart (
	cart_id				serial			primary key,
	customer_id			int				not null	references	ecommerce_app.customer	on	update	cascade,
	made				timestamptz		not null	default	now()
)
`
