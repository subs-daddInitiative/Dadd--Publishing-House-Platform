const {
  listCategories,
  listPublicStudies,
  countPublicStudies,
  findPublicStudyBySlug,
  findRelatedStudies,
  listAdminStudies,
  countActiveHighlightedStudies,
  findAdminStudyById,
  ensureUniqueSlug,
  createStudy,
  updateStudy,
  softDeleteStudy,
} = require("./studies.repository");
const { validateStudyPayload } = require("./studies.validation");
const { hasActiveStudiesAccess } = require("../subscribers/subscribers.repository");
const { findCompletedPurchase } = require("../contentAccess/studyPurchases.repository");
const { assetUrl } = require("./studiesBlockAssetUpload");

const PAGE_SIZE = 9;
const SORTS = ["newest", "oldest"];

function filePath(file) {
  return `/uploads/studies/${file.filename}`;
}

function pdfPath(file) {
  return `/uploads/studies-pdfs/${file.filename}`;
}

async function getPublicStudies(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const offset = (page - 1) * PAGE_SIZE;
    const categorySlug = typeof req.query.category === "string" ? req.query.category : undefined;
    const sort = SORTS.includes(req.query.sort) ? req.query.sort : "newest";

    const [items, total] = await Promise.all([
      listPublicStudies({ limit: PAGE_SIZE, offset, categorySlug, sort }),
      countPublicStudies({ categorySlug }),
    ]);

    res.json({
      success: true,
      data: { items, total, page, pageSize: PAGE_SIZE, totalPages: Math.ceil(total / PAGE_SIZE) },
    });
  } catch (error) {
    next(error);
  }
}

async function getPublicStudyBySlug(req, res, next) {
  try {
    const study = await findPublicStudyBySlug(req.params.slug);
    if (!study) {
      return res.status(404).json({ success: false, message: "Study not found" });
    }
    const related = await findRelatedStudies(study.category_id, study.id);

    let blocks = study.content_blocks ? JSON.parse(study.content_blocks) : [];
    delete study.content_blocks;

    let entitled = false;
    if (study.is_premium && req.subscriber) {
      entitled =
        (await hasActiveStudiesAccess(req.subscriber.sub)) ||
        Boolean(await findCompletedPurchase(req.subscriber.sub, study.id));
    }

    let locked = false;
    if (study.is_premium && !entitled) {
      locked = true;
      study.content_intro = null;
      study.content_body = null;
      study.pdf_file = null;
      blocks = [];
    } else {
      blocks = blocks.map((block) => {
        if ((block.type === "pdf" || block.type === "voice") && block.access === "premium" && !entitled) {
          return { ...block, url: null, locked: true };
        }
        return block;
      });
    }

    res.json({ success: true, data: { ...study, content_blocks: blocks, locked, related } });
  } catch (error) {
    next(error);
  }
}

async function getStudyCategories(req, res, next) {
  try {
    const categories = await listCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
}

async function getAdminStudies(req, res, next) {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : undefined;
    const premium = ["free", "premium"].includes(req.query.premium) ? req.query.premium : undefined;
    const highlighted = req.query.highlighted === "1" ? "1" : undefined;
    const studies = await listAdminStudies({ search, premium, highlighted });
    res.json({ success: true, data: studies });
  } catch (error) {
    next(error);
  }
}

async function getHighlightedStudiesCountHandler(req, res, next) {
  try {
    const count = await countActiveHighlightedStudies();
    res.json({ success: true, data: { count } });
  } catch (error) {
    next(error);
  }
}

async function uploadBlockAssetHandler(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    res.status(201).json({ success: true, data: { url: assetUrl(req.file) } });
  } catch (error) {
    next(error);
  }
}

async function getAdminStudyById(req, res, next) {
  try {
    const study = await findAdminStudyById(req.params.id);
    if (!study) {
      return res.status(404).json({ success: false, message: "Study not found" });
    }
    res.json({ success: true, data: study });
  } catch (error) {
    next(error);
  }
}

async function createStudyHandler(req, res, next) {
  try {
    const { errors, value } = validateStudyPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const slug = await ensureUniqueSlug(value.slug || value.title);
    const coverFile = req.files?.cover_image?.[0];
    const mainFile = req.files?.main_image?.[0];
    const pdfFile = req.files?.pdf_file?.[0];

    const id = await createStudy({
      ...value,
      slug,
      cover_image: coverFile ? filePath(coverFile) : null,
      main_image: mainFile ? filePath(mainFile) : null,
      pdf_file: pdfFile ? pdfPath(pdfFile) : null,
    });
    const study = await findAdminStudyById(id);
    res.status(201).json({ success: true, data: study });
  } catch (error) {
    next(error);
  }
}

async function updateStudyHandler(req, res, next) {
  try {
    const existing = await findAdminStudyById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Study not found" });
    }

    const { errors, value } = validateStudyPayload(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    if (value.slug !== undefined) {
      value.slug = await ensureUniqueSlug(value.slug, existing.id);
    }

    const coverFile = req.files?.cover_image?.[0];
    const mainFile = req.files?.main_image?.[0];
    const pdfFile = req.files?.pdf_file?.[0];

    if (coverFile) value.cover_image = filePath(coverFile);
    if (mainFile) value.main_image = filePath(mainFile);
    if (pdfFile) value.pdf_file = pdfPath(pdfFile);

    const updated = await updateStudy(req.params.id, value);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

async function deleteStudyHandler(req, res, next) {
  try {
    const existing = await findAdminStudyById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Study not found" });
    }
    await softDeleteStudy(req.params.id);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicStudies,
  getPublicStudyBySlug,
  getStudyCategories,
  getAdminStudies,
  getHighlightedStudiesCountHandler,
  getAdminStudyById,
  createStudyHandler,
  updateStudyHandler,
  deleteStudyHandler,
  uploadBlockAssetHandler,
};
