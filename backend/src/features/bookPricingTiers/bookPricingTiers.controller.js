const { listTiers, updateTier } = require("./bookPricingTiers.repository");

async function getPublicTiers(req, res, next) {
  try {
    const tiers = await listTiers();
    res.json({ success: true, data: tiers });
  } catch (error) {
    next(error);
  }
}

async function getAdminTiers(req, res, next) {
  try {
    const tiers = await listTiers();
    res.json({ success: true, data: tiers });
  } catch (error) {
    next(error);
  }
}

async function updateTiersHandler(req, res, next) {
  try {
    const tiers = Array.isArray(req.body) ? req.body : [];
    if (tiers.length === 0) {
      return res.status(400).json({ success: false, message: "No tiers provided" });
    }

    const errors = [];
    for (const tier of tiers) {
      const id = Number(tier.id);
      const name = typeof tier.name === "string" ? tier.name.trim().slice(0, 100) : "";
      const price = Number(tier.price);
      const currency = typeof tier.currency === "string" ? tier.currency.trim().slice(0, 6) || "USD" : "USD";

      if (!Number.isInteger(id) || id <= 0) {
        errors.push("Invalid tier id");
        continue;
      }
      if (!name) {
        errors.push(`Tier ${id}: name is required`);
        continue;
      }
      if (!Number.isFinite(price) || price < 0) {
        errors.push(`Tier ${id}: price must be a non-negative number`);
        continue;
      }

      await updateTier(id, { name, price, currency });
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const updated = await listTiers();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

module.exports = { getPublicTiers, getAdminTiers, updateTiersHandler };
