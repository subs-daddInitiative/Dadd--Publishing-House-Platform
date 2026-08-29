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

export type AdminUser = { id: number; name: string; email: string; role: "admin" | "moderator" };

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

export type NewsTickerTarget = "all" | "reader" | "writer";

export type NewsTickerItem = {
  id: number;
  message: string;
  target: NewsTickerTarget;
  is_active?: number;
  sort_order?: number;
};

export async function getPublicNewsTicker(audience: "reader" | "writer"): Promise<NewsTickerItem[]> {
  const result = await backendFetch<NewsTickerItem[]>(`/api/news-ticker?audience=${audience}`);
  return result.success ? result.data : [];
}

export async function getAdminNewsTicker(): Promise<NewsTickerItem[]> {
  const result = await backendFetch<NewsTickerItem[]>("/api/admin/news-ticker");
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
  is_premium: number;
};

export type BlogContentBlock =
  | { id: string; type: "text"; html: string }
  | { id: string; type: "image"; url: string; alt: string; caption: string }
  | { id: string; type: "image_text"; url: string; alt: string; html: string; layout: "image-left" | "image-right" }
  | { id: string; type: "quote"; text: string; author: string }
  | { id: string; type: "tags"; tags: string[] }
  | { id: string; type: "pdf" | "voice" | "video"; url: string | null; label: string; access: "free" | "premium"; locked?: boolean };

export type BlogDetail = BlogSummary & {
  content_blocks: BlogContentBlock[];
  seo_keywords: string | null;
  updated_at: string;
  locked: boolean;
  related: BlogSummary[];
};

export type BlogListResult = {
  items: BlogSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function getPublicBlogs(
  options: { page?: number; premium?: "free" | "premium" } = {}
): Promise<BlogListResult> {
  const { page = 1, premium } = options;
  const params = new URLSearchParams({ page: String(page) });
  if (premium) params.set("premium", premium);

  const result = await backendFetch<BlogListResult>(`/api/blogs?${params.toString()}`);
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
  review_status: "none" | "pending" | "approved" | "rejected";
  is_premium: number;
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
  content_blocks: string | null;
  seo_keywords: string | null;
  cover_image: string | null;
  status: "draft" | "published";
  review_status: "none" | "pending" | "approved" | "rejected";
  review_reason: string | null;
  is_premium: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function getAdminBlogs(options: { search?: string; premium?: "free" | "premium" } = {}): Promise<AdminBlogSummary[]> {
  const params = new URLSearchParams();
  if (options.search) params.set("search", options.search);
  if (options.premium) params.set("premium", options.premium);
  const query = params.toString();
  const result = await backendFetch<AdminBlogSummary[]>(`/api/admin/blogs${query ? `?${query}` : ""}`);
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
  is_premium: number;
  price: string | null;
  currency: string;
};

export type StudyDetail = StudySummary & {
  category_id: number | null;
  main_image: string | null;
  content_intro: string | null;
  content_body: string | null;
  pdf_file: string | null;
  updated_at: string;
  locked: boolean;
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
  is_premium: number;
  price: string | null;
  currency: string;
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

export type BookCategory = { id: number; name: string; slug: string };

export type BookExternalLink = { id: number; label: string; url: string };

export type BookSummary = {
  id: number;
  title: string;
  slug: string;
  author: string | null;
  description: string | null;
  price: string | null;
  currency: string;
  pricing_tier_id: number | null;
  pricing_tier_name: string | null;
  rating: string | null;
  reviews_count: number;
  cover_image: string | null;
  published_at: string | null;
  category_name: string | null;
  category_slug: string | null;
};

export type BookDetail = BookSummary & {
  category_id: number | null;
  pdf_file: string | null;
  updated_at: string;
  external_links: BookExternalLink[];
  related: BookSummary[];
};

export type BookListResult = {
  items: BookSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type BookSort = "newest" | "oldest" | "price_asc" | "price_desc";

export async function getPublicBooks(options: {
  page?: number;
  category?: string;
  sort?: BookSort;
} = {}): Promise<BookListResult> {
  const { page = 1, category, sort } = options;
  const params = new URLSearchParams({ page: String(page) });
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort);

  const result = await backendFetch<BookListResult>(`/api/books?${params.toString()}`);
  return result.success ? result.data : { items: [], total: 0, page: 1, pageSize: 12, totalPages: 0 };
}

export async function getPublicBookBySlug(slug: string): Promise<BookDetail | null> {
  const result = await backendFetch<BookDetail>(`/api/books/${encodeURIComponent(slug)}`);
  return result.success ? result.data : null;
}

export async function getPublicBookCategories(): Promise<BookCategory[]> {
  const result = await backendFetch<BookCategory[]>("/api/books-categories");
  return result.success ? result.data : [];
}

export type AdminBookSummary = {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published";
  price: string | null;
  currency: string;
  pricing_tier_id: number | null;
  pricing_tier_name: string | null;
  cover_image: string | null;
  published_at: string | null;
  updated_at: string;
  category_name: string | null;
};

export type AdminBookDetail = {
  id: number;
  category_id: number | null;
  title: string;
  slug: string;
  author: string | null;
  description: string | null;
  price: string | null;
  currency: string;
  pricing_tier_id: number | null;
  pricing_tier_name: string | null;
  rating: string | null;
  reviews_count: number;
  cover_image: string | null;
  pdf_file: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  external_links: BookExternalLink[];
};

export async function getAdminBooks(): Promise<AdminBookSummary[]> {
  const result = await backendFetch<AdminBookSummary[]>("/api/admin/books");
  return result.success ? result.data : [];
}

export async function getAdminBookById(id: string): Promise<AdminBookDetail | null> {
  const result = await backendFetch<AdminBookDetail>(`/api/admin/books/${id}`);
  return result.success ? result.data : null;
}

export type BookPricingTier = {
  id: number;
  tier_key: string;
  name: string;
  price: string;
  currency: string;
  sort_order: number;
};

export async function getPublicBookPricingTiers(): Promise<BookPricingTier[]> {
  const result = await backendFetch<BookPricingTier[]>("/api/book-pricing-tiers");
  return result.success ? result.data : [];
}

export async function getAdminBookPricingTiers(): Promise<BookPricingTier[]> {
  const result = await backendFetch<BookPricingTier[]>("/api/admin/book-pricing-tiers");
  return result.success ? result.data : [];
}

export type Moderator = {
  id: number;
  name: string;
  email: string;
  is_active: number;
  last_login_at: string | null;
  created_at: string;
};

export async function getAdminModerators(): Promise<Moderator[]> {
  const result = await backendFetch<Moderator[]>("/api/admin/users");
  return result.success ? result.data : [];
}

export type Subscriber = {
  id: number;
  name: string;
  bio: string | null;
  profile_image: string | null;
  email: string;
  account_type: "reader" | "writer";
  current_tier: "none" | "beginner" | "verified";
  tier_expires_at: string | null;
  blog_access_expires_at: string | null;
  studies_access_expires_at: string | null;
  created_at: string;
};

export async function getCurrentSubscriber(): Promise<Subscriber | null> {
  const result = await backendFetch<{ subscriber: Subscriber }>("/api/subscriber/me");
  return result.success ? result.data.subscriber : null;
}

export type SubscriptionTier = "beginner" | "verified";
export type BillingCycle = "monthly" | "annual";

export type SubscriptionPlan = {
  id: number;
  tier: SubscriptionTier;
  billing_cycle: BillingCycle;
  price: string;
  currency: string;
};

export async function getPublicSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const result = await backendFetch<SubscriptionPlan[]>("/api/subscription-plans");
  return result.success ? result.data : [];
}

export type PaymentMethods = { tap: boolean; paypal: boolean };

export async function getPaymentMethods(): Promise<PaymentMethods> {
  const result = await backendFetch<PaymentMethods>("/api/payment-methods");
  return result.success ? result.data : { tap: false, paypal: false };
}

export type ContentAccessCategory = "blogs" | "studies";

export type ContentAccessPlan = {
  id: number;
  category: ContentAccessCategory;
  billing_cycle: BillingCycle;
  price: string;
  currency: string;
};

export async function getPublicContentAccessPlans(): Promise<ContentAccessPlan[]> {
  const result = await backendFetch<ContentAccessPlan[]>("/api/content-access-plans");
  return result.success ? result.data : [];
}

export type WriterUpgradeRequest = {
  id: number;
  subscriber_id: number;
  status: "pending" | "invited" | "rejected";
  created_at: string;
  name: string;
  email: string;
  current_tier: "none" | "beginner" | "verified";
};

export async function getPendingWriterUpgradeRequests(): Promise<WriterUpgradeRequest[]> {
  const result = await backendFetch<WriterUpgradeRequest[]>("/api/admin/writer-upgrade-requests");
  return result.success ? result.data : [];
}

export type WriterTrialCoupon = {
  id: number;
  code: string;
  months: number;
  max_redemptions: number;
  redemptions_count: number;
  is_active: number;
  created_at: string;
};

export async function getAdminWriterTrialCoupons(): Promise<WriterTrialCoupon[]> {
  const result = await backendFetch<WriterTrialCoupon[]>("/api/admin/writer-trial-coupons");
  return result.success ? result.data : [];
}

export type WriterUpgradeStatus = {
  status: "pending" | "invited" | "rejected";
  reason: string | null;
  decided_at: string | null;
  next_eligible_at: string | null;
} | null;

export async function getWriterUpgradeStatus(): Promise<WriterUpgradeStatus> {
  const result = await backendFetch<WriterUpgradeStatus>("/api/subscriber/writer-upgrade/status");
  return result.success ? result.data : null;
}

export type WriterBlogSummary = {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published";
  review_status: "none" | "pending" | "approved" | "rejected";
  review_reason: string | null;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
};

export type WriterBlogDetail = {
  id: number;
  category_id: number | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content_blocks: string | null;
  cover_image: string | null;
  status: "draft" | "published";
  review_status: "none" | "pending" | "approved" | "rejected";
  review_reason: string | null;
};

export async function getWriterBlogs(): Promise<WriterBlogSummary[]> {
  const result = await backendFetch<WriterBlogSummary[]>("/api/subscriber/blogs");
  return result.success ? result.data : [];
}

export async function getWriterBlogById(id: string): Promise<WriterBlogDetail | null> {
  const result = await backendFetch<WriterBlogDetail>(`/api/subscriber/blogs/${id}`);
  return result.success ? result.data : null;
}

export type PendingReviewBlog = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  created_at: string;
  category_name: string | null;
  writer_name: string;
  writer_email: string;
};

export async function getPendingReviewBlogs(): Promise<PendingReviewBlog[]> {
  const result = await backendFetch<PendingReviewBlog[]>("/api/admin/blogs/pending-review");
  return result.success ? result.data : [];
}

export type FavoriteItem = {
  id: number;
  title: string;
  slug: string;
  cover_image: string | null;
  created_at: string;
};

export type FavoritesResult = {
  blogs: FavoriteItem[];
  studies: FavoriteItem[];
};

export async function getSubscriberFavorites(): Promise<FavoritesResult> {
  const result = await backendFetch<FavoritesResult>("/api/subscriber/favorites");
  return result.success ? result.data : { blogs: [], studies: [] };
}
