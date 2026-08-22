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
  const items = blogs.slice(0, 3);
  if (items.length === 0) return null;

  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <div className={styles.highlightHeader}>
          <Reveal>
            <h2 className={styles.highlightTitle}>{dictionary.blogPage.title}</h2>
            <p className={styles.highlightSubtitle}>{dictionary.blogPage.subtitle}</p>
          </Reveal>
          <Reveal delay={100} className={styles.blogHeaderActions}>
            <Link href={`/${locale}/subscribe`} className={`${styles.primaryAction} hover-lift`}>
              {dictionary.blogPage.subscribeCta}
            </Link>
            <Link href={`/${locale}/blog`} className={blogStyles.viewAllLink}>
              {dictionary.blogPage.viewAll}
            </Link>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className={blogStyles.postsList}>
            {items.map((blog) => (
              <BlogCard
                key={blog.id}
                locale={locale}
                blog={blog}
                byLabel={dictionary.blogPage.by}
                favoriteLabel={dictionary.booksPage.favorite}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
