import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { BlogSummary } from "@/lib/serverApi";
import { Reveal } from "@/components/Reveal";
import { BlogCard } from "@/features/blog/BlogCard";
import blogStyles from "@/features/blog/blog.module.css";
import styles from "./home.module.css";

type BlogsSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
  blogs: BlogSummary[];
};

export function BlogsSection({ locale, dictionary, blogs }: BlogsSectionProps) {
  const [featured, ...restBlogs] = blogs;
  if (!featured) return null;

  const compact = restBlogs.slice(0, 2);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.highlightHeader}>
          <Reveal>
            <h2 className={styles.highlightTitle}>{dictionary.blogPage.title}</h2>
            <p className={styles.highlightSubtitle}>{dictionary.blogPage.subtitle}</p>
          </Reveal>
          <Reveal delay={100}>
            <Link href={`/${locale}/blog`} className={blogStyles.viewAllLink}>
              {dictionary.blogPage.viewAll}
            </Link>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className={blogStyles.bentoGrid}>
            <BlogCard locale={locale} blog={featured} variant="featured" byLabel={dictionary.blogPage.by} />
            {compact.map((blog) => (
              <BlogCard key={blog.id} locale={locale} blog={blog} variant="compact" byLabel={dictionary.blogPage.by} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
