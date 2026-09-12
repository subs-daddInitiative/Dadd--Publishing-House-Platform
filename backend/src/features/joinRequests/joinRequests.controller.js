const {
  createRequest,
  listRequests,
  countUnread,
  findRequestById,
  markAsRead,
  softDeleteRequest,
} = require("./joinRequests.repository");
const { validateJoinRequestPayload } = require("./joinRequests.validation");

async function submitRequest(req, res, next) {
  try {
    const { errors, value } = validateJoinRequestPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    await createRequest(value);
    res.status(201).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

async function getRequests(req, res, next) {
  try {
    const requestType = typeof req.query.request_type === "string" ? req.query.request_type : undefined;
    const status = ["read", "unread"].includes(req.query.status) ? req.query.status : undefined;
    const requests = await listRequests({ requestType, status });
    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
}

async function getUnreadCount(req, res, next) {
  try {
    const count = await countUnread();
    res.json({ success: true, data: { count } });
  } catch (error) {
    next(error);
  }
}

async function markRequestAsRead(req, res, next) {
  try {
    const existing = await findRequestById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    await markAsRead(req.params.id);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

async function deleteRequest(req, res, next) {
  try {
    const existing = await findRequestById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    await softDeleteRequest(req.params.id);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

module.exports = { submitRequest, getRequests, getUnreadCount, markRequestAsRead, deleteRequest };
