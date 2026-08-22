const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { env } = require("../../config/env");
const { parseDurationToMs } = require("../../utils/parseDuration");
const {
  findByEmail,
  findActiveByEmail,
  findById,
  findAuthById,
  createSubscriber,
  updateProfile,
  updatePassword,
} = require("./subscribers.repository");
const {
  validateRegisterPayload,
  validateLoginPayload,
  validateProfilePayload,
  validatePasswordPayload,
} = require("./subscribers.validation");

const SUBSCRIBER_COOKIE = "subscriber_session";

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: parseDurationToMs(env.subscriberJwt.expiresIn),
    path: "/",
  };
}

function signToken(subscriberId) {
  return jwt.sign({ sub: subscriberId, type: "subscriber" }, env.subscriberJwt.secret, {
    expiresIn: env.subscriberJwt.expiresIn,
  });
}

async function register(req, res, next) {
  try {
    const { errors, value } = validateRegisterPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const existing = await findByEmail(value.email);
    if (existing) {
      return res.status(400).json({ success: false, message: "Email is already in use" });
    }

    const passwordHash = await bcrypt.hash(value.password, 12);
    const id = await createSubscriber({
      name: value.name,
      email: value.email,
      passwordHash,
      accountType: value.accountType,
    });

    const token = signToken(id);
    res.cookie(SUBSCRIBER_COOKIE, token, cookieOptions());
    res.status(201).json({
      success: true,
      data: {
        id,
        name: value.name,
        email: value.email,
        account_type: value.accountType,
        current_tier: "none",
        tier_expires_at: null,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { errors, value } = validateLoginPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const subscriber = await findActiveByEmail(value.email);
    if (!subscriber) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(value.password, subscriber.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = signToken(subscriber.id);
    res.cookie(SUBSCRIBER_COOKIE, token, cookieOptions());
    res.json({ success: true, data: { id: subscriber.id, name: subscriber.name, email: subscriber.email } });
  } catch (error) {
    next(error);
  }
}

function logout(req, res) {
  res.clearCookie(SUBSCRIBER_COOKIE, { path: "/" });
  res.json({ success: true, data: null });
}

async function me(req, res, next) {
  try {
    const subscriber = await findById(req.subscriber.sub);
    if (!subscriber) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    res.json({ success: true, data: { subscriber } });
  } catch (error) {
    next(error);
  }
}

async function updateProfileHandler(req, res, next) {
  try {
    const { errors, value } = validateProfilePayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const profileImage = req.file ? `/uploads/subscriber-avatars/${req.file.filename}` : undefined;
    await updateProfile(req.subscriber.sub, { name: value.name, bio: value.bio, profileImage });

    const subscriber = await findById(req.subscriber.sub);
    res.json({ success: true, data: { subscriber } });
  } catch (error) {
    next(error);
  }
}

async function changePasswordHandler(req, res, next) {
  try {
    const { errors, value } = validatePasswordPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const auth = await findAuthById(req.subscriber.sub);
    if (!auth) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const matches = await bcrypt.compare(value.currentPassword, auth.password_hash);
    if (!matches) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    const passwordHash = await bcrypt.hash(value.newPassword, 12);
    await updatePassword(req.subscriber.sub, passwordHash);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  me,
  updateProfileHandler,
  changePasswordHandler,
  SUBSCRIBER_COOKIE,
};
