const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { optionalSubscriberAuth } = require("../../middlewares/optionalSubscriberAuth");
const { studiesUpload } = require("./studiesUpload");
const { blockAssetUpload } = require("./studiesBlockAssetUpload");
const { compressImages } = require("../../middlewares/compressImage");
const { enforceMediaLimits } = require("../../middlewares/enforceMediaLimits");
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
  uploadBlockAssetHandler,
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
adminRouter.post("/studies", uploadFields, enforceMediaLimits, compressImages, createStudyHandler);
adminRouter.put("/studies/:id", uploadFields, enforceMediaLimits, compressImages, updateStudyHandler);
adminRouter.delete("/studies/:id", deleteStudyHandler);
adminRouter.post("/studies/upload-asset", blockAssetUpload.single("file"), enforceMediaLimits, compressImages, uploadBlockAssetHandler);

adminRouter.get("/studies-categories", studyCategories.list);
adminRouter.post("/studies-categories", studyCategories.create);
adminRouter.put("/studies-categories/:id", studyCategories.update);
adminRouter.delete("/studies-categories/:id", studyCategories.remove);

module.exports = { publicRouter, adminRouter };
