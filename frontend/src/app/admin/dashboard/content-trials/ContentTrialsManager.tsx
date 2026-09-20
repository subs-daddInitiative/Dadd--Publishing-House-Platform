"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ContentTrial, BlogCategory, StudyCategory } from "@/lib/serverApi";
import styles from "./content-trials.module.css";

type ContentTrialsManagerProps = {
  initialTrials: ContentTrial[];
  blogCategories: BlogCategory[];
  studyCategories: StudyCategory[];
};

type FormState = {
  id: number | null;
  name: string;
  durationValue: number;
  durationUnit: "day" | "week" | "month";
  isActive: boolean;
  selectedBlogCategories: number[];
  selectedStudyCategories: number[];
};

const EMPTY_FORM: FormState = {
  id: null,
  name: "",
  durationValue: 1,
  durationUnit: "week",
  isActive: true,
  selectedBlogCategories: [],
  selectedStudyCategories: [],
};

export function ContentTrialsManager({ initialTrials, blogCategories, studyCategories }: ContentTrialsManagerProps) {
  const router = useRouter();
  const [trials, setTrials] = useState(initialTrials);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function toggleCategory(list: "selectedBlogCategories" | "selectedStudyCategories", id: number) {
    setForm((current) => {
      const set = new Set(current[list]);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...current, [list]: Array.from(set) };
    });
  }

  function startEdit(trial: ContentTrial) {
    setForm({
      id: trial.id,
      name: trial.name,
      durationValue: trial.duration_value,
      durationUnit: trial.duration_unit,
      isActive: Boolean(trial.is_active ?? true),
      selectedBlogCategories: trial.categories.filter((c) => c.category_type === "blogs").map((c) => c.category_id),
      selectedStudyCategories: trial.categories
        .filter((c) => c.category_type === "studies")
        .map((c) => c.category_id),
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const categories = [
      ...form.selectedBlogCategories.map((category_id) => ({ category_type: "blogs", category_id })),
      ...form.selectedStudyCategories.map((category_id) => ({ category_type: "studies", category_id })),
    ];

    const payload = {
      name: form.name,
      duration_value: form.durationValue,
      duration_unit: form.durationUnit,
      is_active: form.isActive,
      sort_order: 0,
      categories,
    };

    const url = form.id ? `/api/admin/content-trials/${form.id}` : "/api/admin/content-trials";
    const response = await fetch(url, {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (result.success) {
      if (form.id) {
        setTrials((current) => current.map((trial) => (trial.id === form.id ? result.data : trial)));
      } else {
        setTrials((current) => [result.data, ...current]);
      }
      setForm(EMPTY_FORM);
      router.refresh();
    } else {
      setStatus("error");
      setErrorMessage(result.message || "فشل حفظ التجربة");
    }
    setStatus("idle");
  }

  async function handleDelete(id: number) {
    setTrials((current) => current.filter((trial) => trial.id !== id));
    await fetch(`/api/admin/content-trials/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.createForm}>
        <div className={styles.field}>
          <label htmlFor="trialName" className={styles.label}>
            اسم التجربة
          </label>
          <input
            id="trialName"
            className={styles.input}
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            maxLength={190}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="trialDurationValue" className={styles.label}>
            المدة
          </label>
          <input
            id="trialDurationValue"
            type="number"
            min={1}
            max={365}
            className={styles.input}
            value={form.durationValue}
            onChange={(event) => setForm((current) => ({ ...current, durationValue: Number(event.target.value) }))}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="trialDurationUnit" className={styles.label}>
            الوحدة
          </label>
          <select
            id="trialDurationUnit"
            className={styles.select}
            value={form.durationUnit}
            onChange={(event) =>
              setForm((current) => ({ ...current, durationUnit: event.target.value as FormState["durationUnit"] }))
            }
          >
            <option value="day">يوم</option>
            <option value="week">أسبوع</option>
            <option value="month">شهر</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
            />{" "}
            مفعّلة
          </label>
        </div>

        <div className={styles.field} style={{ flexBasis: "100%" }}>
          <p className={styles.label}>تصنيفات المدونة</p>
          <div className={styles.checkboxGroup}>
            {blogCategories.map((category) => (
              <label key={category.id} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.selectedBlogCategories.includes(category.id)}
                  onChange={() => toggleCategory("selectedBlogCategories", category.id)}
                />{" "}
                {category.name}
              </label>
            ))}
            {blogCategories.length === 0 && <span className={styles.itemMeta}>لا توجد تصنيفات</span>}
          </div>
        </div>

        <div className={styles.field} style={{ flexBasis: "100%" }}>
          <p className={styles.label}>تصنيفات الدراسات</p>
          <div className={styles.checkboxGroup}>
            {studyCategories.map((category) => (
              <label key={category.id} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.selectedStudyCategories.includes(category.id)}
                  onChange={() => toggleCategory("selectedStudyCategories", category.id)}
                />{" "}
                {category.name}
              </label>
            ))}
            {studyCategories.length === 0 && <span className={styles.itemMeta}>لا توجد تصنيفات</span>}
          </div>
        </div>

        <button type="submit" className={styles.button} disabled={status === "saving"}>
          {status === "saving" ? "جارٍ الحفظ..." : form.id ? "حفظ التعديلات" : "إضافة تجربة"}
        </button>
        {form.id && (
          <button type="button" className={styles.buttonSecondary} onClick={() => setForm(EMPTY_FORM)}>
            إلغاء التعديل
          </button>
        )}
        {status === "error" && <p className={styles.statusError}>{errorMessage}</p>}
      </form>

      {trials.length === 0 ? (
        <p className={styles.empty}>لا توجد تجارب مجانية بعد.</p>
      ) : (
        <ul className={styles.list}>
          {trials.map((trial) => (
            <li key={trial.id} className={styles.item}>
              <div className={styles.itemBody}>
                <p className={styles.itemMessage}>{trial.name}</p>
                <p className={styles.itemMeta}>
                  {trial.duration_value} {trial.duration_unit === "day" ? "يوم" : trial.duration_unit === "week" ? "أسبوع" : "شهر"}
                  {" · "}
                  {trial.is_active ? "مفعّلة" : "غير مفعّلة"}
                  {" · "}
                  {trial.categories.map((c) => `${c.category_type}:${c.category_id}`).join(", ")}
                </p>
              </div>
              <div className={styles.itemActions}>
                <button type="button" className={styles.buttonSecondary} onClick={() => startEdit(trial)}>
                  تعديل
                </button>
                <button type="button" className={styles.buttonDanger} onClick={() => handleDelete(trial.id)}>
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
