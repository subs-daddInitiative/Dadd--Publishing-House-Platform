import { ContentImportForm } from "@/components/admin/ContentImportForm";
import styles from "../blogs.module.css";

export const metadata = { title: "استيراد مقالات من Excel" };

export default function BlogsImportPage() {
  return (
    <section>
      <h1>استيراد مقالات من Excel</h1>
      <p className={styles.itemMeta}>
        ارفع ملف Excel واحد أو أكثر بنفس تنسيق القالب لإنشاء عدة مقالات دفعة واحدة، بأقسامها الكاملة (نص، صور،
        اقتباسات، ملفات...). إذا فشل ملف أو أكثر ستظهر النتيجة لكل ملف على حدة.
      </p>
      <p style={{ marginBottom: "1.25rem" }}>
        <a href="/templates/blog_import_template.xlsx" className={styles.buttonSecondary} download>
          تنزيل قالب Excel الفارغ
        </a>
      </p>
      <ContentImportForm
        endpoint="/api/admin/blogs/import"
        editBasePath="/admin/dashboard/blogs"
        itemLabel="مقالة"
      />
    </section>
  );
}
