import "server-only";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; message: string; errors?: string[] };

async function backendFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  return response.json();
}

export type AdminUser = { id: number; name: string; email: string; role: string };

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const result = await backendFetch<{ user: AdminUser }>("/api/auth/me");
  return result.success ? result.data.user : null;
}

export type SocialLink = { platform: string; url: string; is_active: number };

export type PublicSettings = {
  siteName: string;
  logo: string | null;
  callNumber: string | null;
  whatsappNumber: string | null;
  aboutText: string | null;
  socialLinks: SocialLink[];
};

export async function getPublicSettings(): Promise<PublicSettings | null> {
  const result = await backendFetch<PublicSettings>("/api/settings");
  return result.success ? result.data : null;
}

export type Banner = {
  id: number;
  title: string | null;
  description: string | null;
  image: string;
  link_url: string | null;
  is_active: number;
};

export async function getPublicBanners(): Promise<Banner[]> {
  const result = await backendFetch<Banner[]>("/api/banners");
  return result.success ? result.data : [];
}

export type AboutFeature = {
  id: number;
  icon: string | null;
  title: string;
  description: string | null;
};

export async function getPublicAboutFeatures(): Promise<AboutFeature[]> {
  const result = await backendFetch<AboutFeature[]>("/api/about-features");
  return result.success ? result.data : [];
}

export async function getAdminAboutFeatures(): Promise<AboutFeature[]> {
  const result = await backendFetch<AboutFeature[]>("/api/admin/about-features");
  return result.success ? result.data : [];
}

export type Settings = PublicSettings & {
  id: number;
  site_name: string;
  call_number: string | null;
  whatsapp_number: string | null;
  about_text: string | null;
};

export async function getAdminSettings(): Promise<Settings | null> {
  const [settingsResult, linksResult] = await Promise.all([
    backendFetch<Omit<Settings, "socialLinks">>("/api/admin/settings"),
    backendFetch<SocialLink[]>("/api/admin/settings/social-links"),
  ]);

  if (!settingsResult.success) return null;

  return {
    ...settingsResult.data,
    socialLinks: linksResult.success ? linksResult.data : [],
  };
}

export async function getAdminBanners(): Promise<Banner[]> {
  const result = await backendFetch<Banner[]>("/api/admin/banners");
  return result.success ? result.data : [];
}

export type PublicStats = { books: number; studies: number; blogs: number };

export async function getPublicStats(): Promise<PublicStats | null> {
  const result = await backendFetch<PublicStats>("/api/stats");
  return result.success ? result.data : null;
}

export function backendAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return `${BACKEND_URL}${path}`;
}

export type ContactSubject = "books" | "studies" | "blogs" | "issues";

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: ContactSubject;
  message: string;
  is_read: number;
  created_at: string;
};

export async function getAdminContactMessages(subject?: string): Promise<ContactMessage[]> {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  const result = await backendFetch<ContactMessage[]>(`/api/admin/contact-messages${query}`);
  return result.success ? result.data : [];
}

export async function getUnreadContactCount(): Promise<number> {
  const result = await backendFetch<{ count: number }>("/api/admin/contact-messages/unread-count");
  return result.success ? result.data.count : 0;
}

export type BlogCategory = { id: number; name: string; slug: string };

export type BlogSummary = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  category_name: string | null;
  category_slug: string | null;
  author_name: string | null;
};

export type BlogDetail = BlogSummary & {
  content: string | null;
  updated_at: string;
  related: BlogSummary[];
};

export type BlogListResult = {
  items: BlogSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function getPublicBlogs(page = 1): Promise<BlogListResult> {
  const result = await backendFetch<BlogListResult>(`/api/blogs?page=${page}`);
  return result.success ? result.data : { items: [], total: 0, page: 1, pageSize: 9, totalPages: 0 };
}

export async function getPublicBlogBySlug(slug: string): Promise<BlogDetail | null> {
  const result = await backendFetch<BlogDetail>(`/api/blogs/${encodeURIComponent(slug)}`);
  return result.success ? result.data : null;
}

export async function getPublicBlogCategories(): Promise<BlogCategory[]> {
  const result = await backendFetch<BlogCategory[]>("/api/blogs-categories");
  return result.success ? result.data : [];
}

export type AdminBlogSummary = {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published";
  cover_image: string | null;
  published_at: string | null;
  updated_at: string;
  category_name: string | null;
};

export type AdminBlogDetail = {
  id: number;
  category_id: number | null;
  author_id: number | null;
  author_name: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function getAdminBlogs(): Promise<AdminBlogSummary[]> {
  const result = await backendFetch<AdminBlogSummary[]>("/api/admin/blogs");
  return result.success ? result.data : [];
}

export async function getAdminBlogById(id: string): Promise<AdminBlogDetail | null> {
  const result = await backendFetch<AdminBlogDetail>(`/api/admin/blogs/${id}`);
  return result.success ? result.data : null;
}

export type StudyCategory = { id: number; name: string; slug: string };

export type StudySummary = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  author: string | null;
  cover_image: string | null;
  published_at: string | null;
  category_name: string | null;
  category_slug: string | null;
};

export type StudyDetail = StudySummary & {
  category_id: number | null;
  main_image: string | null;
  content_intro: string | null;
  content_body: string | null;
  pdf_file: string | null;
  updated_at: string;
  related: StudySummary[];
};

export type StudyListResult = {
  items: StudySummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type StudySort = "newest" | "oldest";

export async function getPublicStudies(options: {
  page?: number;
  category?: string;
  sort?: StudySort;
} = {}): Promise<StudyListResult> {
  const { page = 1, category, sort } = options;
  const params = new URLSearchParams({ page: String(page) });
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort);

  const result = await backendFetch<StudyListResult>(`/api/studies?${params.toString()}`);
  return result.success ? result.data : { items: [], total: 0, page: 1, pageSize: 9, totalPages: 0 };
}

export async function getPublicStudyBySlug(slug: string): Promise<StudyDetail | null> {
  const result = await backendFetch<StudyDetail>(`/api/studies/${encodeURIComponent(slug)}`);
  return result.success ? result.data : null;
}

export async function getPublicStudyCategories(): Promise<StudyCategory[]> {
  const result = await backendFetch<StudyCategory[]>("/api/studies-categories");
  return result.success ? result.data : [];
}

export type AdminStudySummary = {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published";
  cover_image: string | null;
  published_at: string | null;
  updated_at: string;
  category_name: string | null;
};

export type AdminStudyDetail = {
  id: number;
  category_id: number | null;
  title: string;
  slug: string;
  author: string | null;
  description: string | null;
  content_intro: string | null;
  content_body: string | null;
  cover_image: string | null;
  main_image: string | null;
  pdf_file: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function getAdminStudies(): Promise<AdminStudySummary[]> {
  const result = await backendFetch<AdminStudySummary[]>("/api/admin/studies");
  return result.success ? result.data : [];
}

export async function getAdminStudyById(id: string): Promise<AdminStudyDetail | null> {
  const result = await backendFetch<AdminStudyDetail>(`/api/admin/studies/${id}`);
  return result.success ? result.data : null;
}
