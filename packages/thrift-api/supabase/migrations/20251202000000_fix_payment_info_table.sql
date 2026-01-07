-- Rename payment_token to authorization_code
ALTER TABLE payment_info RENAME COLUMN payment_token TO authorization_code;

-- Add email (often needed for Paystack recurring charges)
ALTER TABLE payment_info ADD COLUMN email varchar(320);

-- Add card details for UI display
ALTER TABLE payment_info ADD COLUMN last4 varchar(4);
ALTER TABLE payment_info ADD COLUMN brand varchar(20); -- e.g. 'visa', 'mastercard'
ALTER TABLE payment_info ADD COLUMN exp_month varchar(2);
ALTER TABLE payment_info ADD COLUMN exp_year varchar(4);

-- Make authorization_code unique to prevent duplicates (globally, or per user)
-- There was likely a constraint on (customer_id, payment_token). 
-- Postgres usually handles column renames in constraints automatically.
-- We can add a global unique constraint on authorization_code if desired, 
-- but strictly speaking a token belongs to one email/customer combo on Paystack.
ALTER TABLE payment_info ADD CONSTRAINT payment_info_authorization_code_key UNIQUE (authorization_code);