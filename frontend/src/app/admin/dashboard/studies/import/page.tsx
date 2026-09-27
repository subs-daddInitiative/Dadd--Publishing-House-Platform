import { StudiesImportForm } from "./StudiesImportForm";
import styles from "../studies.module.css";

export const metadata = { title: "استيراد دراسات من Excel" };

export default function StudiesImportPage() {
  return (
    <section>
      <h1>استيراد دراسات من Excel</h1>
      <p className={styles.itemMeta}>
        ارفع ملف Excel بنفس تنسيق القالب لإنشاء عدة دراسات دفعة واحدة، بأقسامها الكاملة (نص، صور، اقتباسات،
        ملفات...).
      </p>
      <p style={{ marginBottom: "1.25rem" }}>
        <a href="/templates/study_import_template.xlsx" className={styles.buttonSecondary} download>
          تنزيل قالب Excel الفارغ
        </a>
      </p>
      <StudiesImportForm />
    </section>
  );
}
