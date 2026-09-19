"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TranslationsPanel } from "./admin/TranslationsPanel";
import styles from "./CategoryManager.module.css";

const TRANSLATION_FIELDS = [
  { key: "name", label: "الاسم" },
  { key: "description", label: "الوصف (اختياري)", multiline: true },
];

type Category = { id: number; name: string; slug: string };

type CategoryManagerProps = {
  apiBase: string;
  categories: Category[];
  deleteConfirmText: string;
};

export function CategoryManager({ apiBase, categories, deleteConfirmText }: CategoryManagerProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;

    setStatus("saving");
    setErrorMessage(null);

    const response = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const result = await response.json();

    if (result.success) {
      setName("");
      router.refresh();
    } else {
      setErrorMessage(result.message || "فشلت العملية");
    }
    setStatus("idle");
  }

  function startEditing(category: Category) {
    setEditingId(category.id);
    setEditingName(category.name);
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId || !editingName.trim()) return;

    setStatus("saving");
    setErrorMessage(null);

    const response = await fetch(`${apiBase}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName }),
    });
    const result = await response.json();

    if (result.success) {
      setEditingId(null);
      router.refresh();
    } else {
      setErrorMessage(result.message || "فشلت العملية");
    }
    setStatus("idle");
  }

  async function handleDelete(id: number) {
    if (!window.confirm(deleteConfirmText)) return;
    await fetch(`${apiBase}/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className={styles.wrap}>
      {categories.length === 0 ? (
        <p className={styles.empty}>لا توجد تصنيفات بعد.</p>
      ) : (
        <ul className={styles.list}>
          {categories.map((category) =>
            editingId === category.id ? (
              <li key={category.id} className={styles.item}>
                <form onSubmit={handleUpdate} className={styles.editForm}>
                  <input
                    className={styles.input}
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    autoFocus
                  />
                  <button type="submit" className={styles.button} disabled={status === "saving"}>
                    حفظ
                  </button>
                  <button
                    type="button"
                    className={styles.buttonSecondary}
                    onClick={() => setEditingId(null)}
                  >
                    إلغاء
                  </button>
                </form>
              </li>
            ) : (
              <li key={category.id} className={styles.item}>
                <span className={styles.itemName}>{category.name}</span>
                <div className={styles.actions}>
                  <button type="button" className={styles.buttonSecondary} onClick={() => startEditing(category)}>
                    تعديل
                  </button>
                  <button
                    type="button"
                    className={styles.buttonSecondary}
                    onClick={() => setExpandedId((current) => (current === category.id ? null : category.id))}
                  >
                    {expandedId === category.id ? "إخفاء الترجمات" : "الترجمات"}
                  </button>
                  <button type="button" className={styles.buttonDanger} onClick={() => handleDelete(category.id)}>
                    حذف
                  </button>
                </div>
                {expandedId === category.id && (
                  <div className={styles.translationsWrap}>
                    <TranslationsPanel apiBase={`${apiBase}/${category.id}`} fields={TRANSLATION_FIELDS} />
                  </div>
                )}
              </li>
            )
          )}
        </ul>
      )}

      <form onSubmit={handleCreate} className={styles.createForm}>
        <input
          className={styles.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="اسم التصنيف الجديد"
        />
        <button type="submit" className={styles.button} disabled={status === "saving"}>
          {status === "saving" ? "جارٍ الإضافة..." : "إضافة"}
        </button>
      </form>

      {errorMessage && <p className={styles.statusError}>{errorMessage}</p>}
    </div>
  );
}
