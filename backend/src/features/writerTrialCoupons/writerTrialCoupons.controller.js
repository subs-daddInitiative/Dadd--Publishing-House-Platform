const crypto = require("crypto");
const {
  listCoupons,
  codeExists,
  createCoupon,
  findRedeemableByCode,
  hasSubscriberRedeemed,
  recordRedemption,
} = require("./writerTrialCoupons.repository");
const { findById: findSubscriberById, updateTier } = require("../subscribers/subscribers.repository");

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars (0/O, 1/I)

function generateCode() {
  let code = "";
  const bytes = crypto.randomBytes(8);
  for (let i = 0; i < 8; i += 1) {
    code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return code;
}

async function generateUniqueCode() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = generateCode();
    if (!(await codeExists(code))) return code;
  }
  throw new Error("Could not generate a unique coupon code");
}

async function getAdminCoupons(req, res, next) {
  try {
    const coupons = await listCoupons();
    res.json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
}

async function createCouponHandler(req, res, next) {
  try {
    const months = Number(req.body.months);
    if (!Number.isInteger(months) || months <= 0) {
      return res.status(400).json({ success: false, message: "months must be a positive integer" });
    }

    const maxRedemptionsRaw = req.body.max_redemptions;
    const maxRedemptions =
      maxRedemptionsRaw === undefined || maxRedemptionsRaw === "" ? 1 : Number(maxRedemptionsRaw);
    if (!Number.isInteger(maxRedemptions) || maxRedemptions <= 0) {
      return res.status(400).json({ success: false, message: "max_redemptions must be a positive integer" });
    }

    let code = typeof req.body.code === "string" ? req.body.code.trim().toUpperCase() : "";
    if (code) {
      if (!/^[A-Z0-9-]{3,32}$/.test(code)) {
        return res.status(400).json({ success: false, message: "Invalid coupon code format" });
      }
      if (await codeExists(code)) {
        return res.status(400).json({ success: false, message: "This coupon code already exists" });
      }
    } else {
      code = await generateUniqueCode();
    }

    const id = await createCoupon({ code, months, maxRedemptions, createdBy: req.user.sub });
    const coupons = await listCoupons();
    const created = coupons.find((row) => row.id === id);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
}

async function redeemCouponHandler(req, res, next) {
  try {
    const subscriber = await findSubscriberById(req.subscriber.sub);
    if (!subscriber) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (subscriber.account_type !== "writer") {
      return res.status(403).json({ success: false, message: "Only writer accounts can redeem a free trial" });
    }
    if (subscriber.current_tier !== "none") {
      return res.status(400).json({ success: false, message: "You already have an active writer tier" });
    }
    if (await hasSubscriberRedeemed(subscriber.id)) {
      return res.status(400).json({ success: false, message: "You have already used a free trial coupon" });
    }

    const code = typeof req.body.code === "string" ? req.body.code.trim().toUpperCase() : "";
    if (!code) {
      return res.status(400).json({ success: false, message: "A coupon code is required" });
    }

    const coupon = await findRedeemableByCode(code);
    if (!coupon) {
      return res.status(400).json({ success: false, message: "Invalid or expired coupon code" });
    }

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + coupon.months);

    await updateTier(subscriber.id, "beginner", expiresAt);
    await recordRedemption(coupon.id, subscriber.id);

    res.json({ success: true, data: { current_tier: "beginner", tier_expires_at: expiresAt.toISOString() } });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAdminCoupons, createCouponHandler, redeemCouponHandler };
