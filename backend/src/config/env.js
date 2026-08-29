require("dotenv").config();

function required(name) {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
  clientOrigin: required("CLIENT_ORIGIN"),
  db: {
    host: required("DB_HOST"),
    port: Number(process.env.DB_PORT) || 3306,
    user: required("DB_USER"),
    password: process.env.DB_PASSWORD || "",
    database: required("DB_NAME"),
  },
  jwt: {
    secret: required("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
  subscriberJwt: {
    secret: process.env.SUBSCRIBER_JWT_SECRET || required("JWT_SECRET"),
    expiresIn: process.env.SUBSCRIBER_JWT_EXPIRES_IN || "30d",
  },
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  backendUrl: process.env.BACKEND_URL || "http://localhost:4000",
  tap: {
    secretKey: process.env.TAP_SECRET_KEY || "",
    baseUrl: process.env.TAP_BASE_URL || "https://api.tap.company/v2",
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || "",
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
    baseUrl: process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com",
  },
  turnstile: {
    secretKey: process.env.TURNSTILE_SECRET_KEY || "",
  },
};

module.exports = { env };
