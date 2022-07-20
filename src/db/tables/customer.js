module.exports = `create table if not exists ecommerce_app.customer (
	customer_id			int 		primary key,
	preferred_currency	varchar		not null,
	foreign	key	(customer_id)	references	ecommerce_app.user_account	on	update	cascade
)
`
