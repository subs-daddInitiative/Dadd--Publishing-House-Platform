const { env } = require("../../config/env");

let cachedToken = null;
let cachedTokenExpiresAt = 0;

function isConfigured() {
  return Boolean(env.paypal.clientId && env.paypal.clientSecret);
}

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedTokenExpiresAt) return cachedToken;

  const credentials = Buffer.from(`${env.paypal.clientId}:${env.paypal.clientSecret}`).toString("base64");
  const response = await fetch(`${env.paypal.baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(body?.error_description || "PayPal authentication failed");
    error.status = 502;
    throw error;
  }

  cachedToken = body.access_token;
  cachedTokenExpiresAt = Date.now() + (Number(body.expires_in) - 60) * 1000;
  return cachedToken;
}

async function paypalRequest(path, options = {}) {
  const token = await getAccessToken();
  const response = await fetch(`${env.paypal.baseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(body?.message || body?.details?.[0]?.description || "PayPal request failed");
    error.status = 502;
    error.paypalResponse = body;
    throw error;
  }
  return body;
}

async function createOrder({ amount, currency, description, returnUrl, cancelUrl }) {
  return paypalRequest("/v2/checkout/orders", {
    method: "POST",
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: currency, value: Number(amount).toFixed(2) },
          description,
        },
      ],
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
      },
    }),
  });
}

async function captureOrder(orderId) {
  return paypalRequest(`/v2/checkout/orders/${orderId}/capture`, { method: "POST" });
}

module.exports = { isConfigured, createOrder, captureOrder };
