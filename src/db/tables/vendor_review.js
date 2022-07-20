modules.export = `
create table if not exists vendor_review (
	review_id				serial			primary key,
	vendor_id				int				not	null		references	vendor on update cascade,
	customer_id				int				not null		references	customer on update cascade,
	transaction_id			int				not null		references	transaction on update cascade,
	rating					numeric(3,2)	not null,
	customer_remark			varchar
);
`
