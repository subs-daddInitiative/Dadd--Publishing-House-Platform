const { env } = require("../config/env");

function isConfigured() {
  return Boolean(env.turnstile.secretKey);
}

// Verifies a Cloudflare Turnstile token. Returns true when Turnstile isn't
// configured yet (no secret key set) so the site keeps working with the
// captcha effectively disabled until an admin adds real keys.
async function verifyTurnstileToken(token, remoteIp) {
  if (!isConfigured()) return true;
  if (!token || typeof token !== "string") return false;

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.turnstile.secretKey,
        response: token,
        ...(remoteIp ? { remoteip: remoteIp } : {}),
      }),
    });
    const body = await response.json().catch(() => null);
    return Boolean(body?.success);
  } catch {
    return false;
  }
}

module.exports = { isConfigured, verifyTurnstileToken };
