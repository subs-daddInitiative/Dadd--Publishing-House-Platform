ALTER TABLE subscriptions
  ADD COLUMN payment_provider ENUM('tap', 'paypal') NOT NULL DEFAULT 'tap' AFTER tap_charge_id,
  ADD COLUMN paypal_order_id VARCHAR(64) NULL AFTER payment_provider;
