"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import Link from "next/link";
import styles from "./join.module.css";

type RequestType = "volunteer" | "complaint" | "suggestion";
type ParticipationType = "individual" | "institution";

const INTEREST_GROUPS: { titleKey: keyof Dictionary["joinPage"]; areas: { key: string; labelKey: keyof Dictionary["joinPage"] }[] }[] = [
  {
    titleKey: "interestsGroupCreative",
    areas: [
      { key: "childrens_literature", labelKey: "interestChildrensLiterature" },
      { key: "translation", labelKey: "interestTranslation" },
      { key: "writing", labelKey: "interestWriting" },
      { key: "proofreading", labelKey: "interestProofreading" },
      { key: "research", labelKey: "interestResearch" },
      { key: "design", labelKey: "interestDesign" },
      { key: "audio", labelKey: "interestAudio" },
      { key: "wikipedia", labelKey: "interestWikipedia" },
    ],
  },
  {
    titleKey: "interestsGroupTechnical",
    areas: [
      { key: "web_development", labelKey: "interestWebDevelopment" },
      { key: "digital_marketing", labelKey: "interestDigitalMarketing" },
      { key: "coordination", labelKey: "interestCoordination" },
    ],
  },
  {
    titleKey: "interestsGroupPartnership",
    areas: [
      { key: "partnerships", labelKey: "interestPartnerships" },
      { key: "donations", labelKey: "interestDonations" },
      { key: "other", labelKey: "interestOther" },
    ],
  },
];

const INSTITUTION_TYPE_KEYS = [
  "institutionTypeNgo",
  "institutionTypeSchool",
  "institutionTypeUniversity",
  "institutionTypeCompany",
  "institutionTypeMedia",
  "institutionTypeOther",
] as const;

type JoinFormProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function JoinForm({ locale, dictionary }: JoinFormProps) {
  const t = dictionary.joinPage;

  const [requestType, setRequestType] = useState<RequestType>("volunteer");
  const [participationType, setParticipationType] = useState<ParticipationType>("individual");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [institutionWebsite, setInstitutionWebsite] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [interestAreas, setInterestAreas] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function toggleArea(key: string) {
    setInterestAreas((current) => (current.includes(key) ? current.filter((a) => a !== key) : [...current, key]));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!privacyAccepted) {
      setStatus("error");
      setErrorMessage(t.privacyLabel);
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const response = await fetch("/api/join-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_type: requestType,
        participation_type: requestType === "volunteer" ? participationType : undefined,
        institution_name: participationType === "institution" ? institutionName : undefined,
        institution_type: participationType === "institution" ? institutionType : undefined,
        institution_website: participationType === "institution" ? institutionWebsite : undefined,
        full_name: fullName,
        email,
        phone,
        location,
        interest_areas: requestType === "volunteer" ? interestAreas : undefined,
        message,
        newsletter_opt_in: newsletterOptIn,
        privacy_accepted: privacyAccepted,
      }),
    });

    let result: { success: boolean; message?: string } | null = null;
    try {
      result = await response.json();
    } catch {
      result = null;
    }

    if (result?.success) {
      setStatus("success");
      setFullName("");
      setEmail("");
      setPhone("");
      setLocation("");
      setInterestAreas([]);
      setMessage("");
      setInstitutionName("");
      setInstitutionType("");
      setInstitutionWebsite("");
      setNewsletterOptIn(false);
      setPrivacyAccepted(false);
    } else {
      setStatus("error");
      setErrorMessage(result?.message || t.errorGeneric);
    }
  }

  if (status === "success") {
    return <p className={styles.successText}>{t.successMessage}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>{t.requestTypeLabel}</label>
        <div className={styles.choiceRow}>
          {(["volunteer", "complaint", "suggestion"] as RequestType[]).map((type) => (
            <label key={type} className={styles.choiceOption}>
              <input
                type="radio"
                name="requestType"
                checked={requestType === type}
                onChange={() => setRequestType(type)}
              />{" "}
              {type === "volunteer" ? t.requestTypeVolunteer : type === "complaint" ? t.requestTypeComplaint : t.requestTypeSuggestion}
            </label>
          ))}
        </div>
      </div>

      {requestType === "volunteer" && (
        <>
          <div className={styles.field}>
            <label className={styles.label}>{t.participationTypeLabel}</label>
            <div className={styles.choiceRow}>
              <label className={styles.choiceOption}>
                <input
                  type="radio"
                  name="participationType"
                  checked={participationType === "individual"}
                  onChange={() => setParticipationType("individual")}
                />{" "}
                {t.participationIndividual}
              </label>
              <label className={styles.choiceOption}>
                <input
                  type="radio"
                  name="participationType"
                  checked={participationType === "institution"}
                  onChange={() => setParticipationType("institution")}
                />{" "}
                {t.participationInstitution}
              </label>
            </div>
          </div>

          {participationType === "institution" && (
            <div className={styles.subSection}>
              <h3 className={styles.subSectionTitle}>{t.institutionSectionTitle}</h3>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="institutionName">
                  {t.institutionNameLabel}
                </label>
                <input
                  id="institutionName"
                  className={styles.input}
                  value={institutionName}
                  onChange={(event) => setInstitutionName(event.target.value)}
                  required
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="institutionType">
                    {t.institutionTypeLabel}
                  </label>
                  <select
                    id="institutionType"
                    className={styles.input}
                    value={institutionType}
                    onChange={(event) => setInstitutionType(event.target.value)}
                  >
                    <option value="">{t.institutionTypePlaceholder}</option>
                    {INSTITUTION_TYPE_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {t[key]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="institutionWebsite">
                    {t.institutionWebsiteLabel}
                  </label>
                  <input
                    id="institutionWebsite"
                    className={styles.input}
                    value={institutionWebsite}
                    onChange={(event) => setInstitutionWebsite(event.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className={styles.subSection}>
        <h3 className={styles.subSectionTitle}>{t.personalSectionTitle}</h3>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="fullName">
              {t.fullNameLabel}
            </label>
            <input
              id="fullName"
              className={styles.input}
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              {t.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="phone">
              {t.phoneLabel}
            </label>
            <input id="phone" className={styles.input} value={phone} onChange={(event) => setPhone(event.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="location">
              {t.locationLabel}
            </label>
            <input
              id="location"
              className={styles.input}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>
        </div>
      </div>

      {requestType === "volunteer" && (
        <div className={styles.subSection}>
          <h3 className={styles.subSectionTitle}>{t.interestsSectionTitle}</h3>
          {INTEREST_GROUPS.map((group) => (
            <div key={group.titleKey} className={styles.interestGroup}>
              <p className={styles.interestGroupTitle}>{t[group.titleKey]}</p>
              <div className={styles.interestGrid}>
                {group.areas.map((area) => (
                  <label key={area.key} className={styles.choiceOption}>
                    <input
                      type="checkbox"
                      checked={interestAreas.includes(area.key)}
                      onChange={() => toggleArea(area.key)}
                    />{" "}
                    {t[area.labelKey]}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="message">
          {requestType === "volunteer" ? t.messageLabel : t.messageLabelRequired}
        </label>
        <textarea
          id="message"
          className={styles.textarea}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required={requestType !== "volunteer"}
        />
      </div>

      <label className={styles.choiceOption}>
        <input
          type="checkbox"
          checked={newsletterOptIn}
          onChange={(event) => setNewsletterOptIn(event.target.checked)}
        />{" "}
        {t.newsletterLabel}
      </label>

      <label className={styles.choiceOption}>
        <input
          type="checkbox"
          checked={privacyAccepted}
          onChange={(event) => setPrivacyAccepted(event.target.checked)}
          required
        />{" "}
        {t.privacyLabel}{" "}
        <Link href={`/${locale}/privacy`} target="_blank" className={styles.inlineLink}>
          {dictionary.footer.privacyLink}
        </Link>{" "}
        {t.privacyAnd}{" "}
        <Link href={`/${locale}/terms`} target="_blank" className={styles.inlineLink}>
          {dictionary.footer.termsLink}
        </Link>
      </label>

      <button type="submit" className={styles.submitButton} disabled={status === "submitting"}>
        {status === "submitting" ? t.submitting : t.submitButton}
      </button>

      {status === "error" && <p className={styles.errorText}>{errorMessage}</p>}
    </form>
  );
}
