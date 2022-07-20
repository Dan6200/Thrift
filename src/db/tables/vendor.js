module.exports = `
create table if not exists ecommerce_app.vendor (
	vendor_id		int 		primary key	references	ecommerce_app.user_account	on	update	cascade
)
`
