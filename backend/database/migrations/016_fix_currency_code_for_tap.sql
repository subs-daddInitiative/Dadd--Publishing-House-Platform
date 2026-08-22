ALTER TABLE books MODIFY COLUMN currency VARCHAR(6) NOT NULL DEFAULT 'USD';
ALTER TABLE studies MODIFY COLUMN currency VARCHAR(6) NOT NULL DEFAULT 'USD';
ALTER TABLE subscription_plans MODIFY COLUMN currency VARCHAR(6) NOT NULL DEFAULT 'USD';
ALTER TABLE content_subscription_plans MODIFY COLUMN currency VARCHAR(6) NOT NULL DEFAULT 'USD';
ALTER TABLE study_purchases MODIFY COLUMN currency VARCHAR(6) NOT NULL DEFAULT 'USD';

UPDATE books SET currency = 'USD' WHERE currency = '$';
UPDATE studies SET currency = 'USD' WHERE currency = '$';
UPDATE subscription_plans SET currency = 'USD' WHERE currency = '$';
UPDATE content_subscription_plans SET currency = 'USD' WHERE currency = '$';
UPDATE study_purchases SET currency = 'USD' WHERE currency = '$';
