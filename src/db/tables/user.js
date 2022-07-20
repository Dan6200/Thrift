module.exports = `create table if not exists user_account (
	user_id					serial 			primary key,
	first_name				varchar(30)		not null,
	last_name				varchar(30)		not null,
	initials				char(2)			not null,
	email					varchar(320)	unique
	check (email ~* '^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'),			
	phone		 			varchar(40)		unique,			
	password_hash			bytea			not null,
	ip_address				varchar			not null,
	country					varchar			not null,
	dob						date			not null
	check (current_date - dob > 17)
);
`
