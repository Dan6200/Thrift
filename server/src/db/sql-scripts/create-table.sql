drop schema if exists public cascade;
create schema if not exists public;

create table if not exists user_accounts (
  user_id      serial                    primary    key,
  first_name   varchar(30)               not        null,
	check				 (first_name ~* '^[a-zA-Z]+$'),
  last_name    varchar(30)               not        null,
	check				 (last_name ~* '^[a-zA-Z]+$'),
  email        varchar(320)              unique,
  check        (email ~* '^(([^<> ()[\]\\.,;:\s@"]+(\.[^< > ()[\]\\.,;'
							 ':\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1'
							 ',3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'),  
  phone        varchar(40)               unique,
  check        (phone ~* '^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$'),  
	check				 (email is not null and phone is not null 
							 or email is null and phone is not null 
							 or email is not null and phone is null),
  password     bytea                     not        null,
  dob          date                      not        null,
  country      varchar                   not        null 			default  		'Nigeria',
  check        (current_date - dob > 12)
);


create table if not exists customers (
  customer_id   int   primary key   references   user_accounts   on   delete   cascade
);


create table if not exists shipping_info (
  shipping_info_id        serial        primary   key,
  customer_id             int           not       null    references   customers   on   delete   cascade,
  recipient_first_name    varchar(30)   not       null,
  recipient_last_name     varchar(30)   not       null,
  address                 varchar       not       null,
  city                    varchar       not       null,
  state                   varchar       not       null,
  postal_code             varchar       not       null,
  country									varchar       not       null,
  delivery_contact        varchar       not       null,
  delivery_instructions   jsonb
);

create table if not exists payment_info (
);



create table if not exists vendors (
  vendor_id   int   primary key   references   user_accounts   on   delete   cascade
);


create table if not exists stores (
  store_id       serial    primary   key,   
  store_name     varchar   not       null,
  vendor_id      int       not       null    references   vendors        on   delete   cascade,
  store_page     jsonb,
  date_created   date      not       null    default      current_date
);

create table if not exists categories (
	category_id					serial					primary 	key,
	category_name 			varchar
);

create table if not exists subcategories (
	subcategory_id			serial				primary 		key,
	category_id 				int						not 				null		references		categories			on 		delete	cascade,
	subcategory_name		varchar
);

insert into categories(category_name) values ('Electronics');
insert into categories(category_name) values ('Clothing');
insert into subcategories(category_id, subcategory_name) values ((select category_id from categories where category_name = 'Electronics'), 'Computers');
insert into subcategories(category_id, subcategory_name) values ((select category_id from categories where category_name = 'Clothing'), 'Women''s Fashion');

create table if not exists products (
  product_id           serial           primary   key,
  title                varchar,
  description          jsonb,
  list_price           numeric(19,4),
  net_price            numeric(19,4),
  vendor_id            int              not       null    references			vendors         on   delete   cascade,
  store_id             int              not       null    references			stores          on   delete   cascade,
  category_id          int           		not    		null    references   		categories      on   delete   cascade,
  subcategory_id       int           		not    		null    references   		subcategories   on   delete   cascade,
  created_at           timestamptz      not       null    default      		now(),
  quantity_available   int              not       null
);

create table if not exists product_media (
  product_id					int					not null   references   products   on   delete   cascade,
  filename						varchar			primary    key,
  filepath						varchar			not        null,
  description					varchar,
	is_display_image		boolean			default		 false,
	is_landing_image		boolean			default		 false,
	is_video 						boolean			default		 false
);

CREATE OR REPLACE FUNCTION product_media_display_landing_trigger () 
RETURNS TRIGGER AS $$
DECLARE
    r RECORD;
BEGIN 
    IF (TG_OP='INSERT' OR TG_OP='UPDATE') THEN
        IF NEW.is_display_image=true THEN
            FOR r IN (SELECT * FROM product_media WHERE is_display_image=true AND filename != NEW.filename) LOOP
                r.is_display_image := false;
            END LOOP;
        END IF;
        IF NEW.is_landing_image=true THEN
            FOR r IN (SELECT * FROM product_media WHERE is_landing_image=true AND filename != NEW.filename) LOOP
                r.is_landing_image := false;
            END LOOP;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_media_display_landing
BEFORE INSERT OR UPDATE ON product_media
FOR EACH ROW EXECUTE FUNCTION product_media_display_landing_trigger();

create table if not exists shopping_cart (
  cart_id       serial        primary   key,
  customer_id   int           not       null   references   customers   on   delete   cascade,
  created       timestamptz   not       null   default      now(),
  updated       timestamptz   not       null   default      now()
);

create table if not exists shopping_cart_item (
  item_id      serial   primary   key,
  cart_id      int      not       null   references   shopping_cart   on   delete   cascade,
  product_id   int      not       null   references   products        on   delete   cascade,
  quantity     int      not       null   check        (quantity > 0)
);

create table if not exists transaction_details (
  transaction_id   serial           primary      key,
  customer_id      int              not          null,
  vendor_id        int              not          null,
  total_amount     numeric(19,4)    not          null,
  created          timestamptz      not          null    default   now()   unique,
  updated          timestamptz      not          null    default   now()   unique,
  check            (customer_id <>  vendor_id)
);

create table if not exists purchases (
  item_id          serial        primary   key,
  product_id       int           not       null   references   products              on        delete   cascade,
  transaction_id   int           not       null   references   transaction_details   on        delete   cascade,
  created          timestamptz   not       null   default      now()                 unique,
  updated          timestamptz   not       null   default      now()                 unique,
  quantity         int           not       null   check        (quantity > 0)
);

create table if not exists product_reviews (
  product_id        int            primary   key     references   products              on   delete   cascade,
  transaction_id    int            not       null    references   transaction_details   on   delete   cascade,
  rating            numeric(3,2)   not       null,
  customer_id       int            not       null    references   customers             on   delete   cascade,
  customer_remark   varchar
);

create table if not exists vendor_reviews (
  vendor_id         int            primary   key     references   vendors               on   delete   cascade,
  customer_id       int            not       null    references   customers             on   delete   cascade,
  transaction_id    int            not       null    references   transaction_details   on   delete   cascade,
  rating            numeric(3,2)   not       null,
  customer_remark   varchar
);

create table if not exists customer_reviews (
  customer_id      int            primary   key     references   customers             on   delete   cascade,
  vendor_id        int            not       null    references   vendors               on   delete   cascade,
  transaction_id   int            not       null    references   transaction_details   on   delete   cascade,
  rating           numeric(3,2)   not       null,
  vendor_remark    varchar
);
