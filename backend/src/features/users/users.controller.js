const bcrypt = require("bcrypt");
const {
  listModerators,
  findByEmail,
  createModerator,
  findModeratorById,
  softDeleteUser,
} = require("./users.repository");
const { validateModeratorPayload } = require("./users.validation");

async function getModerators(req, res, next) {
  try {
    const moderators = await listModerators();
    res.json({ success: true, data: moderators });
  } catch (error) {
    next(error);
  }
}

async function createModeratorHandler(req, res, next) {
  try {
    const { errors, value } = validateModeratorPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const existing = await findByEmail(value.email);
    if (existing) {
      return res.status(400).json({ success: false, message: "Email is already in use" });
    }

    const passwordHash = await bcrypt.hash(value.password, 12);
    const id = await createModerator({ name: value.name, email: value.email, passwordHash });
    res.status(201).json({ success: true, data: { id, name: value.name, email: value.email } });
  } catch (error) {
    next(error);
  }
}

async function deleteModeratorHandler(req, res, next) {
  try {
    const existing = await findModeratorById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Moderator not found" });
    }
    await softDeleteUser(req.params.id);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

module.exports = { getModerators, createModeratorHandler, deleteModeratorHandler };
