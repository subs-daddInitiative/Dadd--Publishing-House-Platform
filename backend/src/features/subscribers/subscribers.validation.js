const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegisterPayload(body) {
  const errors = [];
  const value = {};

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) errors.push("Name is required");
  value.name = name.slice(0, 150);

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !EMAIL_PATTERN.test(email)) errors.push("A valid email is required");
  value.email = email.slice(0, 190);

  const password = typeof body.password === "string" ? body.password : "";
  if (password.length < 8) errors.push("Password must be at least 8 characters");
  value.password = password;

  value.accountType = body.account_type === "writer" ? "writer" : "reader";

  return { errors, value };
}

function validateLoginPayload(body) {
  const errors = [];
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email) errors.push("Email is required");
  if (!password) errors.push("Password is required");

  return { errors, value: { email, password } };
}

function validateProfilePayload(body) {
  const errors = [];
  const value = {};

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) errors.push("Name is required");
  value.name = name.slice(0, 150);

  const bio = typeof body.bio === "string" ? body.bio.trim() : "";
  value.bio = bio.slice(0, 1000);

  return { errors, value };
}

function validatePasswordPayload(body) {
  const errors = [];

  const currentPassword = typeof body.current_password === "string" ? body.current_password : "";
  if (!currentPassword) errors.push("Current password is required");

  const newPassword = typeof body.new_password === "string" ? body.new_password : "";
  if (newPassword.length < 8) errors.push("New password must be at least 8 characters");

  return { errors, value: { currentPassword, newPassword } };
}

module.exports = {
  validateRegisterPayload,
  validateLoginPayload,
  validateProfilePayload,
  validatePasswordPayload,
};
