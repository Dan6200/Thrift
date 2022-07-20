modules.export = `
create table if not exists shop_contact (
	contact_id				serial		primary key,
	shop_id					int			not null,	
	email					varchar,
	phone					varchar
);
`
