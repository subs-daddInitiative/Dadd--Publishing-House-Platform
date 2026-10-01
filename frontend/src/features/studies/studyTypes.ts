// Keys must match STUDY_TYPES in backend/src/features/studies/studies.validation.js.
export const STUDY_TYPE_KEYS = ["analytical_study", "report", "policy_brief", "research_paper"] as const;

export type StudyTypeKey = (typeof STUDY_TYPE_KEYS)[number];

// Admin dashboard labels (the dashboard is Arabic-only); visitors see dictionary.studiesPage.studyTypes.
export const STUDY_TYPE_ADMIN_LABELS: Record<StudyTypeKey, string> = {
  analytical_study: "دراسة تحليلية",
  report: "تقرير",
  policy_brief: "موجز سياسات",
  research_paper: "ورقة بحثية",
};

export function isStudyTypeKey(value: string | null | undefined): value is StudyTypeKey {
  return (STUDY_TYPE_KEYS as readonly string[]).includes(value ?? "");
}
