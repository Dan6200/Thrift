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
  customer_id   int   primary key   references   user_accounts   on   delete   restrict
);


create table if not exists shipping_info (
  shipping_info_id        serial        primary   key,
  customer_id             int           not       null    references   customers   on   delete   restrict,
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
  vendor_id   int   primary key   references   user_accounts   on   delete   restrict
);


create table if not exists stores (
  store_id       serial    primary   key,   
  store_name     varchar   not       null,
  vendor_id      int       not       null    references   vendors        on   delete   restrict,
  store_page     jsonb,
  date_created   date      not       null    default      current_date
);


create table if not exists products (
  product_id           serial           primary   key,
  title                varchar,
  category             varchar,
  description          jsonb,
  list_price           numeric(19,4),
  net_price            numeric(19,4),
  vendor_id            int              not       null,
  store_id             int              not       null    references   stores          on   delete   restrict,
  created_at           timestamptz      not       null    default      now(),
  quantity_available   int              not       null
);


create table if not exists product_media (
  product_id    int       not null   references   products   on   delete   restrict,
  filename      varchar   primary    key,
  filepath      varchar   not        null,
  description   varchar
);

create table if not exists product_display_image (
  filename      varchar   primary    key
);


create table if not exists shopping_cart (
  cart_id       serial        primary   key,
  customer_id   int           not       null   references   customers   on   delete   restrict,
  created       timestamptz   not       null   default      now(),
  updated       timestamptz   not       null   default      now()
);


create table if not exists shopping_cart_item (
  item_id      serial   primary   key,
  cart_id      int      not       null   references   shopping_cart   on   delete   restrict,
  product_id   int      not       null   references   products        on   delete   restrict,
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
  product_id       int           not       null   references   products              on        delete   restrict,
  transaction_id   int           not       null   references   transaction_details   on        delete   restrict,
  created          timestamptz   not       null   default      now()                 unique,
  updated          timestamptz   not       null   default      now()                 unique,
  quantity         int           not       null   check        (quantity > 0)
);


create table if not exists product_reviews (
  product_id        int            primary   key     references   products              on   delete   restrict,
  transaction_id    int            not       null    references   transaction_details   on   delete   restrict,
  rating            numeric(3,2)   not       null,
  customer_id       int            not       null    references   customers             on   delete   restrict,
  customer_remark   varchar
);


create table if not exists vendor_reviews (
  vendor_id         int            primary   key     references   vendors               on   delete   restrict,
  customer_id       int            not       null    references   customers             on   delete   restrict,
  transaction_id    int            not       null    references   transaction_details   on   delete   restrict,
  rating            numeric(3,2)   not       null,
  customer_remark   varchar
);


create table if not exists customer_reviews (
  customer_id      int            primary   key     references   customers             on   delete   restrict,
  vendor_id        int            not       null    references   vendors               on   delete   restrict,
  transaction_id   int            not       null    references   transaction_details   on   delete   restrict,
  rating           numeric(3,2)   not       null,
  vendor_remark    varchar
);
