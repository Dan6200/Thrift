modules.export = `
create table if not exists transaction (
	transaction_id				serial			primary	key,
	transaction_timestamp		timestamptz		not null		default	now()	unique,
	transacted_items_id			int				not null		references shopping_cart	on update	cascade,
	customer_id					int				not null		references	customer	on	update	cascade,
	vendor_id					int				not null		check (customer_id <> vendor_id),
	transaction_amount			numeric(19,4)	not null,
	foreign key	(vendor_id)		references	vendor		on	update	cascade
);
`
