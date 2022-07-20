module.exports = `
create table if not exists ecommerce_app.product_media (
	product_id					int				primary key		references	ecommerce_app.product	on	update	cascade,
	main_product_image			varchar,
	sec_product_image1			varchar,
	sec_product_image2			varchar,
	sec_product_image3			varchar,
	sec_product_image4			varchar,
	sec_product_image5			varchar,
	product_video				varchar
)`
