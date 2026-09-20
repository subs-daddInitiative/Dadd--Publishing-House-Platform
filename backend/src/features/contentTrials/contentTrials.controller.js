const {
  listAdmin,
  listPublic,
  findById,
  create,
  update,
  softDelete,
  hasRedeemed,
  redeem,
} = require("./contentTrials.repository");
const { validateTrialPayload } = require("./contentTrials.validation");
const { computeExpiry } = require("../../utils/trialDuration");

async function getAdminTrials(req, res, next) {
  try {
    const trials = await listAdmin();
    res.json({ success: true, data: trials });
  } catch (error) {
    next(error);
  }
}

async function getAdminTrial(req, res, next) {
  try {
    const trial = await findById(req.params.id);
    if (!trial) {
      return res.status(404).json({ success: false, message: "Trial not found" });
    }
    res.json({ success: true, data: trial });
  } catch (error) {
    next(error);
  }
}

async function createTrial(req, res, next) {
  try {
    const { errors, value } = await validateTrialPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const id = await create(value);
    const trial = await findById(id);
    res.status(201).json({ success: true, data: trial });
  } catch (error) {
    next(error);
  }
}

async function updateTrial(req, res, next) {
  try {
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Trial not found" });
    }

    const { errors, value } = await validateTrialPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const updated = await update(req.params.id, value);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

async function deleteTrial(req, res, next) {
  try {
    const existing = await findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Trial not found" });
    }
    await softDelete(req.params.id);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

async function getPublicTrials(req, res, next) {
  try {
    const trials = await listPublic();
    res.json({ success: true, data: trials });
  } catch (error) {
    next(error);
  }
}

function toMysqlDatetime(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

async function redeemTrial(req, res, next) {
  try {
    const trialId = Number(req.body.trial_id);
    if (!trialId) {
      return res.status(400).json({ success: false, message: "trial_id is required" });
    }

    const trial = await findById(trialId);
    if (!trial || !trial.is_active) {
      return res.status(404).json({ success: false, message: "Trial not found" });
    }

    const alreadyRedeemed = await hasRedeemed(trialId, req.subscriber.sub);
    if (alreadyRedeemed) {
      return res.status(409).json({ success: false, message: "You have already redeemed this trial" });
    }

    const startsAt = new Date();
    const endsAt = computeExpiry(trial.duration_value, trial.duration_unit, startsAt);

    const redemption = await redeem(
      trialId,
      req.subscriber.sub,
      toMysqlDatetime(startsAt),
      toMysqlDatetime(endsAt)
    );

    res.status(201).json({ success: true, data: redemption });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAdminTrials,
  getAdminTrial,
  createTrial,
  updateTrial,
  deleteTrial,
  getPublicTrials,
  redeemTrial,
};
