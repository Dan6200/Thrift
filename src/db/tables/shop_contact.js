module.exports = `
create table if not exists ecommerce_app.shop_contact (
	contact_id				serial		primary key,
	shop_id					int			not null,	
	email					varchar,
	phone					varchar
)
`
