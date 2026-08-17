import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { getCurrentAdmin, getAdminBlogById, backendAssetUrl } from "@/lib/serverApi";
import { BlockRenderer } from "@/features/blog/BlockRenderer";
import { BlogReviewDecision } from "./BlogReviewDecision";
import blogStyles from "@/features/blog/blog.module.css";

export const metadata = { title: "مراجعة مقالة" };

export default async function BlogReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const blog = await getAdminBlogById(id);
  if (!blog) notFound();
  if (blog.review_status !== "pending") redirect("/admin/dashboard/blog-reviews");

  const blocks = blog.content_blocks ? JSON.parse(blog.content_blocks) : [];
  const coverImageUrl = backendAssetUrl(blog.cover_image);

  return (
    <section>
      <h1>{blog.title}</h1>
      {coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverImageUrl} alt="" style={{ maxWidth: "20rem", borderRadius: "0.5rem", marginBottom: "1rem" }} />
      )}
      {blog.excerpt && <p>{blog.excerpt}</p>}

      <div className={blogStyles.page}>
        <BlockRenderer blocks={blocks} lockedFileLabel="" />
      </div>

      <BlogReviewDecision blogId={blog.id} />
    </section>
  );
}
