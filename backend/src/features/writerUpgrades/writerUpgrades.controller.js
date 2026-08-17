const {
  findLatestBySubscriber,
  createRequest,
  listPending,
  findById,
  decide,
} = require("./writerUpgrades.repository");
const { findById: findSubscriberById } = require("../subscribers/subscribers.repository");

const COOLDOWN_DAYS = 30;

async function requestUpgrade(req, res, next) {
  try {
    const subscriber = await findSubscriberById(req.subscriber.sub);
    if (!subscriber) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (subscriber.account_type !== "writer") {
      return res.status(403).json({ success: false, message: "Only writer accounts can request this upgrade" });
    }
    if (subscriber.current_tier !== "beginner") {
      return res.status(400).json({ success: false, message: "Subscribe as a beginner writer first" });
    }

    const latest = await findLatestBySubscriber(subscriber.id);
    if (latest) {
      if (latest.status === "pending") {
        return res.status(400).json({ success: false, message: "You already have a pending request" });
      }
      if (latest.status === "invited") {
        return res.status(400).json({ success: false, message: "You have already been invited to upgrade" });
      }
      if (latest.status === "rejected") {
        const cooldownEnds = new Date(latest.decided_at);
        cooldownEnds.setDate(cooldownEnds.getDate() + COOLDOWN_DAYS);
        if (cooldownEnds > new Date()) {
          return res.status(400).json({
            success: false,
            message: "You must wait before requesting again",
            errors: [cooldownEnds.toISOString()],
          });
        }
      }
    }

    const id = await createRequest(subscriber.id);
    res.status(201).json({ success: true, data: { id, status: "pending" } });
  } catch (error) {
    next(error);
  }
}

async function getStatus(req, res, next) {
  try {
    const latest = await findLatestBySubscriber(req.subscriber.sub);
    if (!latest) {
      return res.json({ success: true, data: null });
    }

    let nextEligibleAt = null;
    if (latest.status === "rejected" && latest.decided_at) {
      const cooldownEnds = new Date(latest.decided_at);
      cooldownEnds.setDate(cooldownEnds.getDate() + COOLDOWN_DAYS);
      nextEligibleAt = cooldownEnds.toISOString();
    }

    res.json({
      success: true,
      data: {
        status: latest.status,
        reason: latest.reason,
        decided_at: latest.decided_at,
        next_eligible_at: nextEligibleAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getPendingRequests(req, res, next) {
  try {
    const pending = await listPending();
    res.json({ success: true, data: pending });
  } catch (error) {
    next(error);
  }
}

async function decideHandler(req, res, next) {
  try {
    const decision = req.body.decision;
    const reason = typeof req.body.reason === "string" ? req.body.reason.trim().slice(0, 500) : "";

    if (!["invited", "rejected"].includes(decision)) {
      return res.status(400).json({ success: false, message: "decision must be 'invited' or 'rejected'" });
    }
    if (decision === "rejected" && !reason) {
      return res.status(400).json({ success: false, message: "A reason is required to reject" });
    }

    const request = await findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: "This request was already decided" });
    }

    await decide(request.id, decision, reason, req.user.sub);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

module.exports = { requestUpgrade, getStatus, getPendingRequests, decideHandler };
