module.exports = `
create table if not exists ecommerce_app.transaction (
	transaction_id				serial			primary	key,
	transaction_timestamp		timestamptz		not null		default	now()	unique,
	transacted_items_id			int				not null		references ecommerce_app.shopping_cart	on update	cascade,
	customer_id					int				not null		references	ecommerce_app.customer	on	update	cascade,
	vendor_id					int				not null		check (customer_id <> vendor_id),
	transaction_amount			numeric(19,4)	not null,
	foreign key	(vendor_id)		references	ecommerce_app.vendor		on	update	cascade
)
`
