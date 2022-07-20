modules.export = `
create table if not exists reversed_transaction (
	rev_transaction_id		int			primary	key	references	transaction		on	update	cascade,
	rev_trans_timestamp			timestamptz		not null	default	now()	unique
);
`
