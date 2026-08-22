ALTER TABLE books MODIFY COLUMN currency VARCHAR(6) NOT NULL DEFAULT '$';
ALTER TABLE studies MODIFY COLUMN currency VARCHAR(6) NOT NULL DEFAULT '$';
ALTER TABLE subscription_plans MODIFY COLUMN currency VARCHAR(6) NOT NULL DEFAULT '$';
ALTER TABLE content_subscription_plans MODIFY COLUMN currency VARCHAR(6) NOT NULL DEFAULT '$';
ALTER TABLE study_purchases MODIFY COLUMN currency VARCHAR(6) NOT NULL DEFAULT '$';

UPDATE books SET currency = '$' WHERE currency = 'SAR';
UPDATE studies SET currency = '$' WHERE currency = 'SAR';
UPDATE subscription_plans SET currency = '$' WHERE currency = 'SAR';
UPDATE content_subscription_plans SET currency = '$' WHERE currency = 'SAR';
UPDATE study_purchases SET currency = '$' WHERE currency = 'SAR';
