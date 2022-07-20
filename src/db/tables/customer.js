modules.export = `create table if not exists customer (
	customer_id			int 		primary key,
	preferred_currency	varchar		not null,
	foreign	key	(customer_id)	references	user_account	on	update	cascade
);
`
