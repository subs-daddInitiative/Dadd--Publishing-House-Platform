const { env } = require("../../config/env");
const { listPlans, findPlanById, upsertPlanPrice } = require("./plans.repository");
const { createCharge, retrieveCharge } = require("./tap.client");
const {
  createPendingSubscription,
  attachTapCharge,
  findByTapChargeId,
  findById,
  markSubscriptionResult,
} = require("./subscriptions.repository");
const { findById: findSubscriberById, updateTier, grantContentAccess } = require("../subscribers/subscribers.repository");
const contentAccess = require("../contentAccess/contentAccess.repository");
const studyPurchases = require("../contentAccess/studyPurchases.repository");
const { findLatestBySubscriber } = require("../writerUpgrades/writerUpgrades.repository");

const TIER_LABELS = { beginner: "كاتب مبتدئ", verified: "كاتب موثق" };

function addCycle(date, billingCycle) {
  const result = new Date(date);
  if (billingCycle === "annual") {
    result.setFullYear(result.getFullYear() + 1);
  } else {
    result.setMonth(result.getMonth() + 1);
  }
  return result;
}

function toMysqlDatetime(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

async function getPublicPlans(req, res, next) {
  try {
    const plans = await listPlans();
    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
}

async function checkout(req, res, next) {
  try {
    const planId = Number(req.body.plan_id);
    const locale = typeof req.body.locale === "string" ? req.body.locale : "ar";
    if (!planId) {
      return res.status(400).json({ success: false, message: "plan_id is required" });
    }

    const plan = await findPlanById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }
    if (Number(plan.price) <= 0) {
      return res.status(400).json({ success: false, message: "This plan is not available yet" });
    }

    const subscriber = await findSubscriberById(req.subscriber.sub);
    if (!subscriber) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (subscriber.account_type !== "writer") {
      return res.status(403).json({ success: false, message: "Only writer accounts can subscribe to writer tiers" });
    }
    if (plan.tier === "verified") {
      const latestRequest = await findLatestBySubscriber(subscriber.id);
      if (!latestRequest || latestRequest.status !== "invited") {
        return res.status(403).json({
          success: false,
          message: "You must be invited by a moderator before subscribing to the verified tier",
        });
      }
    }

    const subscriptionId = await createPendingSubscription(subscriber.id, plan.id);

    const charge = await createCharge({
      amount: Number(plan.price),
      currency: plan.currency,
      description: `${TIER_LABELS[plan.tier] || plan.tier} - ${plan.billing_cycle}`,
      customer: {
        first_name: subscriber.name,
        email: subscriber.email,
      },
      metadata: { subscription_id: String(subscriptionId) },
      redirectUrl: `${env.frontendUrl}/${locale}/account/subscribe/result`,
      postUrl: `${env.backendUrl}/api/subscription-webhook`,
    });

    await attachTapCharge(subscriptionId, charge.id);

    res.json({ success: true, data: { redirect_url: charge.transaction?.url, subscription_id: subscriptionId } });
  } catch (error) {
    next(error);
  }
}

// Settles a TAP charge against whichever table it belongs to (writer-tier
// subscription, content-access subscription, or study purchase). Used both
// by the webhook (TAP calling us server-to-server) AND as a fallback from the
// status-check endpoints below - useful when the webhook can't reach us yet
// (e.g. running on localhost without a public tunnel), since the browser
// redirect back from TAP still lets us actively re-verify the charge instead
// of only passively waiting for a callback.
async function settleCharge(chargeId) {
  const charge = await retrieveCharge(chargeId);
  const captured = charge.status === "CAPTURED";

  const subscription = await findByTapChargeId(charge.id);
  if (subscription) {
    if (subscription.status === "pending") {
      if (captured) {
        const plan = await findPlanById(subscription.plan_id);
        const startsAt = new Date();
        const endsAt = addCycle(startsAt, plan.billing_cycle);
        await markSubscriptionResult(subscription.id, "active", toMysqlDatetime(startsAt), toMysqlDatetime(endsAt));
        await updateTier(subscription.subscriber_id, plan.tier, toMysqlDatetime(endsAt));
      } else {
        await markSubscriptionResult(subscription.id, "failed", null, null);
      }
    }
    return true;
  }

  const contentSub = await contentAccess.findByTapChargeId(charge.id);
  if (contentSub) {
    if (contentSub.status === "pending") {
      if (captured) {
        const plan = await contentAccess.findPlanById(contentSub.plan_id);
        const startsAt = new Date();
        const endsAt = addCycle(startsAt, plan.billing_cycle);
        await contentAccess.markResult(contentSub.id, "active", toMysqlDatetime(startsAt), toMysqlDatetime(endsAt));
        await grantContentAccess(contentSub.subscriber_id, plan.category, toMysqlDatetime(endsAt));
      } else {
        await contentAccess.markResult(contentSub.id, "failed", null, null);
      }
    }
    return true;
  }

  const purchase = await studyPurchases.findByTapChargeId(charge.id);
  if (purchase) {
    if (purchase.status === "pending") {
      await studyPurchases.markResult(purchase.id, captured ? "completed" : "failed");
    }
    return true;
  }

  return false;
}

async function webhook(req, res, next) {
  try {
    const chargeId = req.body?.id;
    if (!chargeId) {
      return res.status(400).json({ success: false, message: "Missing charge id" });
    }

    const found = await settleCharge(chargeId);
    if (!found) {
      return res.status(404).json({ success: false, message: "Charge not found" });
    }
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

async function getCheckoutStatus(req, res, next) {
  try {
    const tapId = req.query.tap_id;
    let subscription = tapId
      ? await findByTapChargeId(tapId)
      : await findById(req.params.id, req.subscriber.sub);

    if (!subscription || subscription.subscriber_id !== req.subscriber.sub) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    if (subscription.status === "pending" && tapId) {
      await settleCharge(tapId);
      subscription = await findByTapChargeId(tapId);
    }

    res.json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
}

async function updatePlanPriceHandler(req, res, next) {
  try {
    const plans = Array.isArray(req.body.plans) ? req.body.plans : [];
    const errors = [];

    for (const entry of plans) {
      const tier = entry?.tier;
      const billingCycle = entry?.billing_cycle;
      const price = Number(entry?.price);

      if (!["beginner", "verified"].includes(tier) || !["monthly", "annual"].includes(billingCycle)) {
        errors.push(`Invalid plan: ${tier}/${billingCycle}`);
        continue;
      }
      if (!Number.isFinite(price) || price < 0) {
        errors.push(`Invalid price for ${tier}/${billingCycle}`);
        continue;
      }
      await upsertPlanPrice(tier, billingCycle, price);
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const updated = await listPlans();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicPlans,
  checkout,
  webhook,
  getCheckoutStatus,
  updatePlanPriceHandler,
  settleCharge,
};
