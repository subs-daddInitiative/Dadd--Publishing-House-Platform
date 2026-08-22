"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import styles from "./subscribers.module.css";

type AuthFormProps = {
  locale: Locale;
  dictionary: Dictionary;
  mode: "register" | "login";
};

export function AuthForm({ locale, dictionary, mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"reader" | "writer">("reader");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const path = mode === "register" ? "/api/subscriber/register" : "/api/subscriber/login";
    const body =
      mode === "register" ? { name, email, password, account_type: accountType } : { email, password };

    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      let result: { success: boolean; message?: string } | null = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (result?.success) {
        router.push(`/${locale}/account`);
        router.refresh();
      } else {
        setStatus("error");
        setErrorMessage(result?.message || dictionary.authPage.errorGeneric);
      }
    } catch {
      setStatus("error");
      setErrorMessage(dictionary.authPage.errorGeneric);
    }
  }

  return (
    <div className={styles.authPage}>
      <h1 className={styles.authTitle}>
        {mode === "register" ? dictionary.authPage.registerTitle : dictionary.authPage.loginTitle}
      </h1>
      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <>
            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="name">
                {dictionary.authPage.nameLabel}
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>{dictionary.authPage.accountTypeLabel}</label>
              <div className={styles.accountTypeChoice}>
                <label>
                  <input
                    type="radio"
                    name="accountType"
                    checked={accountType === "reader"}
                    onChange={() => setAccountType("reader")}
                  />{" "}
                  {dictionary.authPage.accountTypeReader}
                </label>
                <label>
                  <input
                    type="radio"
                    name="accountType"
                    checked={accountType === "writer"}
                    onChange={() => setAccountType("writer")}
                  />{" "}
                  {dictionary.authPage.accountTypeWriter}
                </label>
              </div>
            </div>
          </>
        )}

        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="email">
            {dictionary.authPage.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="password">
            {dictionary.authPage.passwordLabel}
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={styles.formInput}
          />
        </div>

        <button type="submit" className={styles.formSubmit} disabled={status === "submitting"}>
          {status === "submitting"
            ? dictionary.authPage.submitting
            : mode === "register"
              ? dictionary.authPage.submitRegister
              : dictionary.authPage.submitLogin}
        </button>

        {status === "error" && <p className={styles.formStatusError}>{errorMessage}</p>}
      </form>

      <p className={styles.formSwitch}>
        {mode === "register" ? (
          <>
            {dictionary.authPage.haveAccount}{" "}
            <Link href={`/${locale}/login`}>{dictionary.authPage.switchToLogin}</Link>
          </>
        ) : (
          <>
            {dictionary.authPage.noAccount}{" "}
            <Link href={`/${locale}/register`}>{dictionary.authPage.switchToRegister}</Link>
          </>
        )}
      </p>
    </div>
  );
}
