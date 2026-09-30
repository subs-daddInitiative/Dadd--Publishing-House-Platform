const ExcelJS = require("exceljs");
const { createCategoryRepository } = require("../../utils/categoryRepository");
const { validateBlogPayload, STATUSES } = require("./blogs.validation");
const { ensureUniqueSlug, createBlog } = require("./blogs.repository");
const { getSettings } = require("../settings/settings.repository");
const { resolveType, parseLabelledLines, wrapAsHtml, parseTags } = require("../../utils/contentImportParse");
const {
  downloadCoverImage,
  downloadBlockImage,
  downloadBlockPdf,
  downloadBlockAudio,
  downloadBlockVideo,
} = require("./blogsImport.assets");

const BLOGS_SHEET_NAME = "المقالات";
const SECTIONS_SHEET_NAME = "الأقسام";

const blogCategoriesRepo = createCategoryRepository("blogs_categories");

function cellText(row, column) {
  const cell = row.getCell(column);
  const value = cell.value;
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && "text" in value) return String(value.text).trim(); // rich text cell
  if (typeof value === "object" && "result" in value) return String(value.result ?? "").trim(); // formula cell
  return String(value).trim();
}

function parseYesNo(value) {
  const normalized = value.trim().toLowerCase();
  return ["نعم", "true", "1", "yes"].includes(normalized);
}

function normalizeName(name) {
  return name.trim().toLowerCase();
}

function readBlogRows(sheet) {
  const rows = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const key = cellText(row, 1);
    const title = cellText(row, 2);
    if (!key || !title) return; // blank row, or the yellow example note row
    rows.push({
      key,
      title,
      slug: cellText(row, 3),
      authorName: cellText(row, 4),
      categoryName: cellText(row, 5),
      excerpt: cellText(row, 6),
      status: cellText(row, 7),
      isPremium: cellText(row, 8),
      isHighlighted: cellText(row, 9),
      highlightedUntil: cellText(row, 10),
      coverUrl: cellText(row, 11),
      seoKeywords: cellText(row, 12),
    });
  });
  return rows;
}

function readSectionsByPost(sheet) {
  const byPost = new Map();
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const postKey = cellText(row, 1);
    const type = cellText(row, 3);
    if (!postKey || !type) return; // blank row, or the yellow example note row
    const order = Number(cellText(row, 2));
    const content = cellText(row, 4);
    if (!byPost.has(postKey)) byPost.set(postKey, []);
    byPost.get(postKey).push({
      order: Number.isFinite(order) ? order : byPost.get(postKey).length + 1,
      type,
      content,
    });
  });
  for (const sections of byPost.values()) {
    sections.sort((a, b) => a.order - b.order);
  }
  return byPost;
}

// Builds one raw content block from a parsed section row. Returns
// { block } on success, or { warning } when a referenced file couldn't be
// downloaded — the post import still proceeds, just without that section,
// so one bad link doesn't sink the whole post.
async function buildBlock(section, sectionLabel) {
  const internalType = resolveType(section.type);
  if (!internalType) {
    return { warning: `${sectionLabel}: نوع القسم "${section.type}" غير معروف` };
  }

  if (internalType === "text") {
    return { block: { type: "text", html: wrapAsHtml(section.content) } };
  }

  if (internalType === "tags") {
    return { block: { type: "tags", tags: parseTags(section.content) } };
  }

  const fields = parseLabelledLines(section.content);

  if (internalType === "image" || internalType === "image_text") {
    const download = await downloadBlockImage(fields["رابط"]);
    if (download.error) {
      return { warning: `${sectionLabel}: ${download.error}` };
    }
    if (internalType === "image") {
      return {
        block: { type: "image", url: download.path, alt: fields["نص بديل"] || "", caption: fields["تسمية"] || "" },
      };
    }
    return {
      block: {
        type: "image_text",
        url: download.path,
        alt: fields["نص بديل"] || "",
        html: wrapAsHtml(fields["النص"] || ""),
        layout: fields["الاتجاه"] === "يمين" ? "image-right" : "image-left",
      },
    };
  }

  if (internalType === "quote") {
    return { block: { type: "quote", text: fields["النص"] || "", author: fields["القائل"] || "" } };
  }

  const download =
    internalType === "pdf"
      ? await downloadBlockPdf(fields["رابط"])
      : internalType === "voice"
        ? await downloadBlockAudio(fields["رابط"])
        : await downloadBlockVideo(fields["رابط"]);

  if (download.error) {
    return { warning: `${sectionLabel}: ${download.error}` };
  }
  return {
    block: {
      type: internalType,
      url: download.path,
      label: fields["تسمية"] || "",
      access: fields["الوصول"] === "مدفوع" ? "premium" : "free",
    },
  };
}

async function importBlogsFromWorkbook(buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const blogsSheet = workbook.getWorksheet(BLOGS_SHEET_NAME);
  const sectionsSheet = workbook.getWorksheet(SECTIONS_SHEET_NAME);
  if (!blogsSheet || !sectionsSheet) {
    return {
      success: false,
      message: `الملف يجب أن يحتوي على ورقتين باسم "${BLOGS_SHEET_NAME}" و"${SECTIONS_SHEET_NAME}" — استخدم القالب المرفق.`,
    };
  }

  const categories = await blogCategoriesRepo.list();
  const categoryIdByName = new Map(categories.map((category) => [normalizeName(category.name), category.id]));
  const settings = await getSettings();
  const fallbackAuthorName = settings?.site_name || null;

  const blogRows = readBlogRows(blogsSheet);
  const sectionsByPost = readSectionsByPost(sectionsSheet);

  if (blogRows.length === 0) {
    return { success: false, message: `لم يتم العثور على أي صفوف بيانات في ورقة "${BLOGS_SHEET_NAME}".` };
  }

  const results = [];

  for (const row of blogRows) {
    const warnings = [];
    try {
      const sections = sectionsByPost.get(row.key) || [];
      const blocks = [];
      for (let i = 0; i < sections.length; i += 1) {
        const outcome = await buildBlock(sections[i], `القسم رقم ${i + 1}`);
        if (outcome.block) blocks.push(outcome.block);
        if (outcome.warning) warnings.push(outcome.warning);
      }

      let coverImage = null;
      if (row.coverUrl) {
        const download = await downloadCoverImage(row.coverUrl);
        if (download.path) coverImage = download.path;
        else warnings.push(`صورة الغلاف: ${download.error}`);
      }

      const categoryId = row.categoryName ? categoryIdByName.get(normalizeName(row.categoryName)) ?? null : null;
      if (row.categoryName && categoryId === null) {
        warnings.push(`لم يتم العثور على تصنيف باسم "${row.categoryName}" — تم حفظ المقالة بلا تصنيف`);
      }

      const body = {
        title: row.title,
        slug: row.slug || undefined,
        author_name: row.authorName || fallbackAuthorName || "",
        category_id: categoryId ?? "",
        excerpt: row.excerpt,
        status: STATUSES.includes(row.status) ? row.status : "draft",
        is_premium: parseYesNo(row.isPremium),
        is_highlighted: parseYesNo(row.isHighlighted),
        highlighted_until: row.isHighlighted && row.highlightedUntil ? row.highlightedUntil : "",
        content_blocks: JSON.stringify(blocks),
        seo_keywords: row.seoKeywords,
      };

      const { errors, value } = validateBlogPayload(body);
      if (errors.length > 0) {
        results.push({ key: row.key, title: row.title, status: "error", message: errors.join("، ") });
        continue;
      }

      const slug = await ensureUniqueSlug(value.slug || value.title);
      const id = await createBlog({ ...value, slug, cover_image: coverImage, author_id: null });

      results.push({
        key: row.key,
        title: row.title,
        status: "created",
        id,
        warnings: warnings.length > 0 ? warnings : undefined,
      });
    } catch (error) {
      results.push({ key: row.key, title: row.title, status: "error", message: error.message });
    }
  }

  return { success: true, results };
}

module.exports = { importBlogsFromWorkbook };
