modules.export = `
create table if not exists shop (
	shop_id					serial			primary key,	
	shop_name				varchar			not null,
	shop_owner				int				references	vendor	on	update	cascade,
	date_created			date			not null		default		current_date,
	street					varchar,
	postal_code				varchar,
	banner_image			varchar
);
`
