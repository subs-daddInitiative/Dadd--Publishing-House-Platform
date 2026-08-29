const {
  listCategories,
  listPublicBlogs,
  countPublicBlogs,
  findPublicBlogBySlug,
  findRelatedBlogs,
  listAdminBlogs,
  listPendingReview,
  listBySubscriber,
  findByIdForSubscriber,
  findAdminBlogById,
  ensureUniqueSlug,
  createBlog,
  updateBlog,
  softDeleteBlog,
  createWriterSubmission,
  updateWriterSubmission,
  reviewBlog,
} = require("./blogs.repository");
const { validateBlogPayload, validateWriterBlogPayload, validateReviewPayload } = require("./blogs.validation");
const { getSettings } = require("../settings/settings.repository");
const { hasActiveBlogAccess, findById: findSubscriberById } = require("../subscribers/subscribers.repository");
const { assetUrl } = require("./blockAssetUpload");
const { verifyTurnstileToken } = require("../../utils/turnstile");

const PAGE_SIZE = 9;

async function defaultAuthorName() {
  const settings = await getSettings();
  return settings?.site_name || null;
}

async function getPublicBlogs(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const offset = (page - 1) * PAGE_SIZE;
    const premium = ["free", "premium"].includes(req.query.premium) ? req.query.premium : undefined;

    const [items, total] = await Promise.all([
      listPublicBlogs({ limit: PAGE_SIZE, offset, premium }),
      countPublicBlogs({ premium }),
    ]);

    res.json({
      success: true,
      data: { items, total, page, pageSize: PAGE_SIZE, totalPages: Math.ceil(total / PAGE_SIZE) },
    });
  } catch (error) {
    next(error);
  }
}

async function getPublicBlogBySlug(req, res, next) {
  try {
    const blog = await findPublicBlogBySlug(req.params.slug);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    const related = await findRelatedBlogs(blog.category_id, blog.id);

    const entitled = Boolean(req.subscriber) && (await hasActiveBlogAccess(req.subscriber.sub));
    let blocks = blog.content_blocks ? JSON.parse(blog.content_blocks) : [];
    delete blog.content_blocks;

    let locked = false;
    if (blog.is_premium && !entitled) {
      locked = true;
      blocks = [];
    } else {
      blocks = blocks.map((block) => {
        if ((block.type === "pdf" || block.type === "voice") && block.access === "premium" && !entitled) {
          return { ...block, url: null, locked: true };
        }
        return block;
      });
    }

    res.json({ success: true, data: { ...blog, content_blocks: blocks, locked, related } });
  } catch (error) {
    next(error);
  }
}

async function getBlogCategories(req, res, next) {
  try {
    const categories = await listCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
}

async function getAdminBlogs(req, res, next) {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : undefined;
    const premium = ["free", "premium"].includes(req.query.premium) ? req.query.premium : undefined;
    const blogs = await listAdminBlogs({ search, premium });
    res.json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
}

async function getAdminBlogById(req, res, next) {
  try {
    const blog = await findAdminBlogById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
}

async function createBlogHandler(req, res, next) {
  try {
    const { errors, value } = validateBlogPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const slug = await ensureUniqueSlug(value.slug || value.title);
    const coverImage = req.file ? `/uploads/blogs/${req.file.filename}` : null;

    const id = await createBlog({
      ...value,
      slug,
      cover_image: coverImage,
      author_id: req.user.sub,
      author_name: value.author_name || (await defaultAuthorName()),
    });
    const blog = await findAdminBlogById(id);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
}

async function updateBlogHandler(req, res, next) {
  try {
    const existing = await findAdminBlogById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const { errors, value } = validateBlogPayload(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    if (value.slug !== undefined) {
      value.slug = await ensureUniqueSlug(value.slug, existing.id);
    }

    if (value.author_name !== undefined && value.author_name === "") {
      value.author_name = await defaultAuthorName();
    }

    if (req.file) {
      value.cover_image = `/uploads/blogs/${req.file.filename}`;
    }

    const updated = await updateBlog(req.params.id, value);
    res.json({ success: true, data: updated });
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

async function requireWriter(req, res) {
  const subscriber = await findSubscriberById(req.subscriber.sub);
  if (!subscriber) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return null;
  }
  if (subscriber.account_type !== "writer") {
    res.status(403).json({ success: false, message: "Only writer accounts can submit blogs" });
    return null;
  }
  return subscriber;
}

async function requireActiveWriter(req, res) {
  const subscriber = await requireWriter(req, res);
  if (!subscriber) return null;

  const tierExpired = subscriber.tier_expires_at && new Date(subscriber.tier_expires_at) < new Date();
  if (subscriber.current_tier === "none" || tierExpired) {
    res.status(403).json({
      success: false,
      message: "You need an active writer subscription (or free trial) to submit blogs",
    });
    return null;
  }
  return subscriber;
}

async function submitWriterBlogHandler(req, res, next) {
  try {
    const subscriber = await requireActiveWriter(req, res);
    if (!subscriber) return;

    const captchaOk = await verifyTurnstileToken(req.body.turnstile_token, req.ip);
    if (!captchaOk) {
      return res.status(400).json({ success: false, message: "CAPTCHA verification failed" });
    }

    const { errors, value } = validateWriterBlogPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const slug = await ensureUniqueSlug(value.title);
    const coverImage = req.file ? `/uploads/blogs/${req.file.filename}` : null;

    const id = await createWriterSubmission({
      ...value,
      slug,
      cover_image: coverImage,
      subscriber_id: subscriber.id,
      author_name: subscriber.name,
    });
    const blog = await findByIdForSubscriber(id, subscriber.id);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
}

async function listWriterBlogsHandler(req, res, next) {
  try {
    const subscriber = await requireWriter(req, res);
    if (!subscriber) return;

    const blogs = await listBySubscriber(subscriber.id);
    res.json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
}

async function getWriterBlogByIdHandler(req, res, next) {
  try {
    const subscriber = await requireWriter(req, res);
    if (!subscriber) return;

    const blog = await findByIdForSubscriber(req.params.id, subscriber.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
}

async function updateWriterBlogHandler(req, res, next) {
  try {
    const subscriber = await requireActiveWriter(req, res);
    if (!subscriber) return;

    const existing = await findByIdForSubscriber(req.params.id, subscriber.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    if (existing.review_status === "approved") {
      return res.status(400).json({ success: false, message: "Published blogs can no longer be edited here" });
    }

    const { errors, value } = validateWriterBlogPayload(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    if (req.file) {
      value.cover_image = `/uploads/blogs/${req.file.filename}`;
    }

    const updated = await updateWriterSubmission(existing.id, value, existing.review_status === "rejected");
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

async function getPendingReviewBlogsHandler(req, res, next) {
  try {
    const pending = await listPendingReview();
    res.json({ success: true, data: pending });
  } catch (error) {
    next(error);
  }
}

async function reviewBlogHandler(req, res, next) {
  try {
    const { errors, value } = validateReviewPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const existing = await findAdminBlogById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    if (existing.review_status !== "pending") {
      return res.status(400).json({ success: false, message: "This blog was already reviewed" });
    }

    await reviewBlog(existing.id, {
      decision: value.decision,
      isPremium: value.isPremium,
      reason: value.reason,
      reviewerId: req.user.sub,
    });

    const updated = await findAdminBlogById(existing.id);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

async function deleteBlogHandler(req, res, next) {
  try {
    const existing = await findAdminBlogById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    await softDeleteBlog(req.params.id);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicBlogs,
  getPublicBlogBySlug,
  getBlogCategories,
  getAdminBlogs,
  getAdminBlogById,
  createBlogHandler,
  updateBlogHandler,
  deleteBlogHandler,
  uploadBlockAssetHandler,
  submitWriterBlogHandler,
  listWriterBlogsHandler,
  getWriterBlogByIdHandler,
  updateWriterBlogHandler,
  getPendingReviewBlogsHandler,
  reviewBlogHandler,
};
