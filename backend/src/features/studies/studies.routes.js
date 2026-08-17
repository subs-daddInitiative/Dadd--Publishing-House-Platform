const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { optionalSubscriberAuth } = require("../../middlewares/optionalSubscriberAuth");
const { studiesUpload } = require("./studiesUpload");
const { createCategoryRepository } = require("../../utils/categoryRepository");
const { createCategoryController } = require("../../utils/categoryController");
const {
  getPublicStudies,
  getPublicStudyBySlug,
  getStudyCategories,
  getAdminStudies,
  getAdminStudyById,
  createStudyHandler,
  updateStudyHandler,
  deleteStudyHandler,
} = require("./studies.controller");

const uploadFields = studiesUpload.fields([
  { name: "cover_image", maxCount: 1 },
  { name: "main_image", maxCount: 1 },
  { name: "pdf_file", maxCount: 1 },
]);
const studyCategories = createCategoryController(createCategoryRepository("studies_categories"));

const publicRouter = Router();
publicRouter.get("/studies", getPublicStudies);
publicRouter.get("/studies-categories", getStudyCategories);
publicRouter.get("/studies/:slug", optionalSubscriberAuth, getPublicStudyBySlug);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/studies", getAdminStudies);
adminRouter.get("/studies/:id", getAdminStudyById);
adminRouter.post("/studies", uploadFields, createStudyHandler);
adminRouter.put("/studies/:id", uploadFields, updateStudyHandler);
adminRouter.delete("/studies/:id", deleteStudyHandler);

adminRouter.get("/studies-categories", studyCategories.list);
adminRouter.post("/studies-categories", studyCategories.create);
adminRouter.put("/studies-categories/:id", studyCategories.update);
adminRouter.delete("/studies-categories/:id", studyCategories.remove);

module.exports = { publicRouter, adminRouter };
