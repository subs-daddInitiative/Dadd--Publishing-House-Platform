const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { env } = require("../../config/env");
const { findActiveAdminByEmail, touchLastLogin } = require("./auth.repository");

class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password");
    this.status = 401;
  }
}

async function login(email, password) {
  const user = await findActiveAdminByEmail(email);
  if (!user) throw new InvalidCredentialsError();

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) throw new InvalidCredentialsError();

  await touchLastLogin(user.id);

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

module.exports = { login, InvalidCredentialsError };
