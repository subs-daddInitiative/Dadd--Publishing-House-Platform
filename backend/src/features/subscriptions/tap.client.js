const { env } = require("../../config/env");

async function tapRequest(path, options = {}) {
  const response = await fetch(`${env.tap.baseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${env.tap.secretKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(body?.errors?.[0]?.description || "TAP request failed");
    error.status = 502;
    error.tapResponse = body;
    throw error;
  }
  return body;
}

async function createCharge({ amount, currency, customer, description, redirectUrl, postUrl, metadata }) {
  return tapRequest("/charges", {
    method: "POST",
    body: JSON.stringify({
      amount,
      currency,
      customer_initiated: true,
      threeDSecure: true,
      save_card: false,
      description,
      metadata,
      source: { id: "src_all" },
      customer,
      redirect: { url: redirectUrl },
      post: { url: postUrl },
    }),
  });
}

async function retrieveCharge(chargeId) {
  return tapRequest(`/charges/${chargeId}`, { method: "GET" });
}

module.exports = { createCharge, retrieveCharge };
