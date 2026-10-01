// Splits a study's content blocks into reader pages.
//
// - If the editor inserted at least one "page_break" block, only those markers
//   decide where pages end (the manual split overrides the automatic one).
// - Otherwise a study with enough sections is split automatically every
//   AUTO_PAGE_SIZE sections, and a study shorter than AUTO_PAGE_MIN_SECTIONS
//   stays a single page.
// The markers themselves are removed; every remaining block gets a 1-based `page`.
const AUTO_PAGE_MIN_SECTIONS = 10;
const AUTO_PAGE_SIZE = 8;
const MIN_LAST_PAGE_SECTIONS = 3;
const PAGE_BREAK_TYPE = "page_break";

function paginateManually(blocks) {
  const paged = [];
  let page = 1;
  let blocksOnPage = 0;

  for (const block of blocks) {
    if (block.type === PAGE_BREAK_TYPE) {
      // Leading or repeated breaks would only create empty pages.
      if (blocksOnPage > 0) {
        page += 1;
        blocksOnPage = 0;
      }
      continue;
    }
    paged.push({ ...block, page });
    blocksOnPage += 1;
  }

  return { blocks: paged, totalPages: blocksOnPage > 0 || page === 1 ? page : page - 1 };
}

function paginateAutomatically(blocks) {
  if (blocks.length < AUTO_PAGE_MIN_SECTIONS) {
    return { blocks: blocks.map((block) => ({ ...block, page: 1 })), totalPages: 1 };
  }

  let totalPages = Math.ceil(blocks.length / AUTO_PAGE_SIZE);
  const lastPageSize = blocks.length - (totalPages - 1) * AUTO_PAGE_SIZE;
  // A tiny trailing page reads badly, so fold it into the previous one.
  if (totalPages > 1 && lastPageSize < MIN_LAST_PAGE_SECTIONS) totalPages -= 1;

  return {
    blocks: blocks.map((block, index) => ({
      ...block,
      page: Math.min(Math.floor(index / AUTO_PAGE_SIZE) + 1, totalPages),
    })),
    totalPages,
  };
}

function paginateBlocks(blocks) {
  const hasManualBreak = blocks.some((block) => block.type === PAGE_BREAK_TYPE);
  return hasManualBreak ? paginateManually(blocks) : paginateAutomatically(blocks);
}

module.exports = { paginateBlocks };
