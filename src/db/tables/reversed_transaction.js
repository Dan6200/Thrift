module.exports = `
create table if not exists ecommerce_app.reversed_transaction (
	rev_transaction_id		int			primary	key	references	ecommerce_app.transaction		on	update	cascade,
	rev_trans_timestamp			timestamptz		not null	default	now()	unique
)
`
