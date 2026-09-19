-- Add payment_reference to orders to unblock payment reference tracking.
-- Longer term this is superseded by the `transactions` table (gateway_reference);
-- see DDD refactor plan / issue for details.
alter table public.orders
  add column if not exists payment_reference text;
