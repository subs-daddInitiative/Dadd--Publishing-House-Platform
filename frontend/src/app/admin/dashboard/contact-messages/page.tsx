import { getAdminContactMessages } from "@/lib/serverApi";
import { MessageActions } from "./MessageActions";
import { SubjectFilter } from "./SubjectFilter";
import styles from "./contact-messages.module.css";

export const metadata = { title: "رسائل التواصل" };

const SUBJECT_LABELS: Record<string, string> = {
  books: "الكتب",
  studies: "الدراسات",
  blogs: "المدونة",
  issues: "مشكلة أو استفسار عام",
};

export default async function ContactMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject } = await searchParams;
  const messages = await getAdminContactMessages(subject);

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>رسائل التواصل</h1>
        <SubjectFilter />
      </div>

      {messages.length === 0 ? (
        <p className={styles.empty}>لا توجد رسائل.</p>
      ) : (
        <ul className={styles.list}>
          {messages.map((message) => (
            <li key={message.id} className={message.is_read ? styles.item : styles.itemUnread}>
              <div className={styles.itemHeader}>
                <span className={styles.name}>{message.name}</span>
                <span className={styles.date}>{message.created_at}</span>
              </div>
              <p className={styles.meta}>
                {message.email}
                {message.phone ? ` — ${message.phone}` : ""}
                {" · "}
                <span className={styles.subjectBadge}>
                  {SUBJECT_LABELS[message.subject] || message.subject}
                </span>
              </p>
              <p className={styles.message}>{message.message}</p>
              <MessageActions id={message.id} isRead={Boolean(message.is_read)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
