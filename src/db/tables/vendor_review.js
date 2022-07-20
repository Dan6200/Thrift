module.exports = `
create table if not exists ecommerce_app.vendor_review (
	review_id				serial			primary key,
	vendor_id				int				not	null		references	ecommerce_app.vendor on update cascade,
	customer_id				int				not null		references	ecommerce_app.customer on update cascade,
	transaction_id			int				not null		references	ecommerce_app.transaction on update cascade,
	rating					numeric(3,2)	not null,
	customer_remark			varchar
)
`
