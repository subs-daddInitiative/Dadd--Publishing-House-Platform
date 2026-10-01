// Page 1 keeps the clean base URL; later pages add ?page=N.
export function studyPageHref(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}
