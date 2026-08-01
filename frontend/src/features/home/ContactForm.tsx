"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/i18n/getDictionary";
import { SendIcon } from "./icons";
import styles from "./home.module.css";

type ContactFormProps = {
  dictionary: Dictionary;
};

const SUBJECTS = ["books", "studies", "blogs", "issues"] as const;

export function ContactForm({ dictionary }: ContactFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const subjectLabels: Record<(typeof SUBJECTS)[number], string> = {
    books: dictionary.home.subjectBooks,
    studies: dictionary.home.subjectStudies,
    blogs: dictionary.home.subjectBlogs,
    issues: dictionary.home.subjectIssues,
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          subject,
          message,
        }),
      });
      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.contactForm}>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label htmlFor="contact-first-name" className={styles.formLabel}>
            {dictionary.home.contactFormFirstName}
          </label>
          <input
            id="contact-first-name"
            className={styles.formInput}
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>
        <div className={styles.formField}>
          <label htmlFor="contact-last-name" className={styles.formLabel}>
            {dictionary.home.contactFormLastName}
          </label>
          <input
            id="contact-last-name"
            className={styles.formInput}
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>
      </div>

      <div className={styles.formField}>
        <label htmlFor="contact-email" className={styles.formLabel}>
          {dictionary.home.contactFormEmail}
        </label>
        <input
          id="contact-email"
          type="email"
          className={styles.formInput}
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className={styles.formField}>
        <label htmlFor="contact-phone" className={styles.formLabel}>
          {dictionary.home.contactFormPhone}
        </label>
        <input
          id="contact-phone"
          className={styles.formInput}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>
      <div className={styles.formField}>
        <label htmlFor="contact-subject" className={styles.formLabel}>
          {dictionary.home.contactFormSubject}
        </label>
        <select
          id="contact-subject"
          className={styles.formInput}
          required
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
        >
          <option value="" disabled>
            {dictionary.home.contactFormSubjectPlaceholder}
          </option>
          {SUBJECTS.map((key) => (
            <option key={key} value={key}>
              {subjectLabels[key]}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.formField}>
        <label htmlFor="contact-message" className={styles.formLabel}>
          {dictionary.home.contactFormMessage}
        </label>
        <textarea
          id="contact-message"
          className={styles.formTextarea}
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>

      <button
        type="submit"
        className={`${styles.formSubmit} hover-lift`}
        disabled={status === "submitting"}
      >
        {status === "submitting" ? dictionary.home.contactFormSubmitting : dictionary.home.contactFormSubmit}
        <SendIcon className={styles.formSubmitIcon} />
      </button>

      {status === "success" && <p className={styles.formStatusOk}>{dictionary.home.contactFormSuccess}</p>}
      {status === "error" && <p className={styles.formStatusError}>{dictionary.home.contactFormError}</p>}
    </form>
  );
}
