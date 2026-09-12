import { redirect } from "next/navigation";
import { getCurrentAdmin, getAdminContactMessages, getAdminJoinRequests } from "@/lib/serverApi";
import { MessageActions } from "./MessageActions";
import { JoinRequestActions } from "./JoinRequestActions";
import { SubjectFilter } from "./SubjectFilter";
import { JoinRequestsFilter } from "./JoinRequestsFilter";
import styles from "./contact-messages.module.css";

export const metadata = { title: "رسائل التواصل" };

const SUBJECT_LABELS: Record<string, string> = {
  books: "الكتب",
  studies: "الدراسات",
  blogs: "المدونة",
  issues: "مشكلة أو استفسار عام",
};

const REQUEST_TYPE_LABELS: Record<string, string> = {
  volunteer: "طلب انضمام كمتطوع",
  complaint: "شكوى",
  suggestion: "اقتراح",
};

const PARTICIPATION_LABELS: Record<string, string> = {
  individual: "متطوع فردي",
  institution: "ممثل جهة",
};

const INTEREST_LABELS: Record<string, string> = {
  childrens_literature: "أدب الأطفال",
  translation: "الترجمة",
  writing: "الكتابة والتأليف",
  proofreading: "التدقيق اللغوي",
  research: "البحث",
  design: "الرسم والتصميم",
  audio: "الأداء الصوتي",
  wikipedia: "ويكيبيديا",
  web_development: "تطوير الويب",
  digital_marketing: "التسويق الرقمي",
  coordination: "التنسيق الإداري",
  partnerships: "الشراكات المؤسسية",
  donations: "التبرعات",
  other: "أخرى",
};

function parseInterestAreas(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function ContactMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{
    subject?: string;
    message_status?: string;
    request_type?: string;
    request_status?: string;
  }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "admin") redirect("/admin/dashboard");

  const { subject, message_status, request_type, request_status } = await searchParams;
  const messageStatus = message_status === "read" || message_status === "unread" ? message_status : undefined;
  const requestStatus = request_status === "read" || request_status === "unread" ? request_status : undefined;

  const [messages, joinRequests] = await Promise.all([
    getAdminContactMessages({ subject, status: messageStatus }),
    getAdminJoinRequests({ requestType: request_type, status: requestStatus }),
  ]);

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

      <h2 className={styles.sectionTitle}>طلبات الانضمام والشكاوى والاقتراحات</h2>
      <JoinRequestsFilter />
      {joinRequests.length === 0 ? (
        <p className={styles.empty}>لا توجد طلبات بعد.</p>
      ) : (
        <ul className={styles.list}>
          {joinRequests.map((request) => {
            const interestAreas = parseInterestAreas(request.interest_areas);
            return (
              <li key={request.id} className={request.is_read ? styles.item : styles.itemUnread}>
                <div className={styles.itemHeader}>
                  <span className={styles.name}>{request.full_name}</span>
                  <span className={styles.date}>{request.created_at}</span>
                </div>
                <p className={styles.meta}>
                  {request.email}
                  {request.phone ? ` — ${request.phone}` : ""}
                  {request.location ? ` — ${request.location}` : ""}
                  {" · "}
                  <span className={styles.subjectBadge}>
                    {REQUEST_TYPE_LABELS[request.request_type] || request.request_type}
                  </span>
                  {request.participation_type && (
                    <>
                      {" "}
                      <span className={styles.subjectBadge}>{PARTICIPATION_LABELS[request.participation_type]}</span>
                    </>
                  )}
                </p>
                {request.institution_name && (
                  <p className={styles.meta}>
                    الجهة: {request.institution_name}
                    {request.institution_type ? ` (${request.institution_type})` : ""}
                    {request.institution_website ? ` — ${request.institution_website}` : ""}
                  </p>
                )}
                {interestAreas.length > 0 && (
                  <p className={styles.meta}>
                    مجالات الاهتمام: {interestAreas.map((area) => INTEREST_LABELS[area] || area).join("، ")}
                  </p>
                )}
                {request.message && <p className={styles.message}>{request.message}</p>}
                {request.newsletter_opt_in ? <p className={styles.meta}>مشترك في النشرة البريدية</p> : null}
                <JoinRequestActions id={request.id} isRead={Boolean(request.is_read)} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
