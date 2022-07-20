modules.export = `
create table if not exists product_review (
	review_id				serial			primary key,
	product_id				int				not null	references	product		on	update	cascade,
	transaction_id			int				not null	references	transaction	on	update	cascade,
	rating					numeric(3,2)	not null,
	customer_id				int				not	null	references	customer	on	update	cascade,
	customer_remark			varchar
);
`
