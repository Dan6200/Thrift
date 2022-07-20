module.exports = `
create table if not exists ecommerce_app.product_review (
	review_id				serial			primary key,
	product_id				int				not null	references	ecommerce_app.product		on	update	cascade,
	transaction_id			int				not null	references	ecommerce_app.transaction	on	update	cascade,
	rating					numeric(3,2)	not null,
	customer_id				int				not	null	references	ecommerce_app.customer	on	update	cascade,
	customer_remark			varchar
)
`
