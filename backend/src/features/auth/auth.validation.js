function validateLoginPayload(body) {
  const errors = [];
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email) errors.push("Email is required");
  if (!password) errors.push("Password is required");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Email is invalid");
  }

  return { errors, value: { email, password } };
}

module.exports = { validateLoginPayload };
