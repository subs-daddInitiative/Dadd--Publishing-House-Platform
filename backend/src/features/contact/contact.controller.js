const {
  createMessage,
  listMessages,
  countUnread,
  findMessageById,
  markAsRead,
  softDeleteMessage,
} = require("./contact.repository");
const { validateContactMessagePayload } = require("./contact.validation");

async function submitMessage(req, res, next) {
  try {
    const { errors, value } = validateContactMessagePayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    await createMessage(value);
    res.status(201).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

async function getMessages(req, res, next) {
  try {
    const subject = typeof req.query.subject === "string" ? req.query.subject : undefined;
    const status = ["read", "unread"].includes(req.query.status) ? req.query.status : undefined;
    const messages = await listMessages({ subject, status });
    res.json({ success: true, data: messages });
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

async function markMessageAsRead(req, res, next) {
  try {
    const existing = await findMessageById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    await markAsRead(req.params.id);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

async function deleteMessage(req, res, next) {
  try {
    const existing = await findMessageById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    await softDeleteMessage(req.params.id);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

module.exports = { submitMessage, getMessages, getUnreadCount, markMessageAsRead, deleteMessage };
