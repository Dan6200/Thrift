modules.export = `
create table if not exists vendor (
	vendor_id		int 		primary key	references	user_account	on	update	cascade
);
`
