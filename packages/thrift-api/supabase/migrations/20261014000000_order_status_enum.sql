-- Order status state machine.
-- Replaces the free-text `orders.status` column with a constrained enum so that
-- amendment/cancellation can be guarded by explicit, server-checked states.
-- Existing values in the DB are 'pending', 'processing', and 'failed'; the enum
-- includes those plus the newly-introduced states.
create type public.order_status as enum (
  'pending',
  'processing',
  'failed',
  'cancelled',
  'shipped',
  'delivered',
  'refunded'
);

alter table public.orders
  alter column status drop default,
  alter column status type public.order_status using status::public.order_status,
  alter column status set default 'pending';
