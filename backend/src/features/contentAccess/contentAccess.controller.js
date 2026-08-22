const { env } = require("../../config/env");
const { listPlans, findPlanById, upsertPlanPrice, createPendingAccessSubscription, attachTapCharge, findByTapChargeId, markResult } =
  require("./contentAccess.repository");
const studyPurchases = require("./studyPurchases.repository");
const { createCharge } = require("../subscriptions/tap.client");
const { settleCharge } = require("../subscriptions/subscriptions.controller");
const { findById: findSubscriberById } = require("../subscribers/subscribers.repository");
const { findStudyById } = require("../studies/studies.repository");

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

const CATEGORY_LABELS = { blogs: "اشتراك المدونة المميزة", studies: "اشتراك الدراسات المميزة" };

async function getContentPlans(req, res, next) {
  try {
    const plans = await listPlans();
    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
}

async function checkoutAccess(req, res, next) {
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

    const subscriptionId = await createPendingAccessSubscription(subscriber.id, plan.id);

    const charge = await createCharge({
      amount: Number(plan.price),
      currency: plan.currency,
      description: `${CATEGORY_LABELS[plan.category] || plan.category} - ${plan.billing_cycle}`,
      customer: { first_name: subscriber.name, email: subscriber.email },
      metadata: { content_access_subscription_id: String(subscriptionId) },
      redirectUrl: `${env.frontendUrl}/${locale}/account/subscribe/result`,
      postUrl: `${env.backendUrl}/api/subscription-webhook`,
    });

    await attachTapCharge(subscriptionId, charge.id);

    res.json({ success: true, data: { redirect_url: charge.transaction?.url, subscription_id: subscriptionId } });
  } catch (error) {
    next(error);
  }
}

async function purchaseStudy(req, res, next) {
  try {
    const studyId = Number(req.params.id);
    const locale = typeof req.body.locale === "string" ? req.body.locale : "ar";

    const study = await findStudyById(studyId);
    if (!study) {
      return res.status(404).json({ success: false, message: "Study not found" });
    }
    if (!study.is_premium || Number(study.price) <= 0) {
      return res.status(400).json({ success: false, message: "This study is not available for purchase" });
    }

    const subscriber = await findSubscriberById(req.subscriber.sub);
    if (!subscriber) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const existing = await studyPurchases.findCompletedPurchase(subscriber.id, study.id);
    if (existing) {
      return res.status(400).json({ success: false, message: "You already own this study" });
    }

    const purchaseId = await studyPurchases.createPendingPurchase(
      subscriber.id,
      study.id,
      study.price,
      study.currency
    );

    const charge = await createCharge({
      amount: Number(study.price),
      currency: study.currency,
      description: `شراء دراسة: ${study.title}`,
      customer: { first_name: subscriber.name, email: subscriber.email },
      metadata: { study_purchase_id: String(purchaseId) },
      redirectUrl: `${env.frontendUrl}/${locale}/account/subscribe/result`,
      postUrl: `${env.backendUrl}/api/subscription-webhook`,
    });

    await studyPurchases.attachTapCharge(purchaseId, charge.id);

    res.json({ success: true, data: { redirect_url: charge.transaction?.url, purchase_id: purchaseId } });
  } catch (error) {
    next(error);
  }
}

async function getAccessStatus(req, res, next) {
  try {
    const tapId = req.query.tap_id;
    if (!tapId) {
      return res.status(400).json({ success: false, message: "tap_id is required" });
    }

    let subscription = await findByTapChargeId(tapId);
    if (subscription && subscription.subscriber_id === req.subscriber.sub) {
      if (subscription.status === "pending") {
        await settleCharge(tapId);
        subscription = await findByTapChargeId(tapId);
      }
      return res.json({ success: true, data: { type: "content_access", status: subscription.status } });
    }

    let purchase = await studyPurchases.findByTapChargeId(tapId);
    if (purchase && purchase.subscriber_id === req.subscriber.sub) {
      if (purchase.status === "pending") {
        await settleCharge(tapId);
        purchase = await studyPurchases.findByTapChargeId(tapId);
      }
      return res.json({ success: true, data: { type: "study_purchase", status: purchase.status } });
    }

    res.status(404).json({ success: false, message: "Not found" });
  } catch (error) {
    next(error);
  }
}

async function updatePlanPriceHandler(req, res, next) {
  try {
    const plans = Array.isArray(req.body.plans) ? req.body.plans : [];
    const errors = [];

    for (const entry of plans) {
      const category = entry?.category;
      const billingCycle = entry?.billing_cycle;
      const price = Number(entry?.price);

      if (!["blogs", "studies"].includes(category) || !["monthly", "annual"].includes(billingCycle)) {
        errors.push(`Invalid plan: ${category}/${billingCycle}`);
        continue;
      }
      if (!Number.isFinite(price) || price < 0) {
        errors.push(`Invalid price for ${category}/${billingCycle}`);
        continue;
      }
      await upsertPlanPrice(category, billingCycle, price);
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
  getContentPlans,
  checkoutAccess,
  purchaseStudy,
  getAccessStatus,
  updatePlanPriceHandler,
  addCycle,
  toMysqlDatetime,
  markResult,
};
