"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Subscriber } from "@/lib/serverApi";
import styles from "./subscribers.module.css";

type ProfileViewProps = {
  dictionary: Dictionary;
  subscriber: Subscriber;
  profileImageUrl: string | null;
};

type Status = "idle" | "saving" | "saved" | "error";

export function ProfileView({ dictionary, subscriber, profileImageUrl }: ProfileViewProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(subscriber.name);
  const [bio, setBio] = useState(subscriber.bio || "");
  const [preview, setPreview] = useState<string | null>(profileImageUrl);
  const [file, setFile] = useState<File | null>(null);
  const [profileStatus, setProfileStatus] = useState<Status>("idle");
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<Status>("idle");
  const [passwordError, setPasswordError] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleProfileSubmit(event: FormEvent) {
    event.preventDefault();
    setProfileStatus("saving");
    setProfileError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (file) formData.append("profile_image", file);

      const response = await fetch("/api/subscriber/profile", { method: "PUT", body: formData });
      let result: { success: boolean; message?: string } | null = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (result?.success) {
        setProfileStatus("saved");
        router.refresh();
      } else {
        setProfileStatus("error");
        setProfileError(result?.message || dictionary.authPage.errorGeneric);
      }
    } catch {
      setProfileStatus("error");
      setProfileError(dictionary.authPage.errorGeneric);
    }
  }

  async function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault();
    setPasswordStatus("saving");
    setPasswordError("");

    try {
      const response = await fetch("/api/subscriber/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      let result: { success: boolean; message?: string } | null = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (result?.success) {
        setPasswordStatus("saved");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setPasswordStatus("error");
        setPasswordError(result?.message || dictionary.authPage.errorGeneric);
      }
    } catch {
      setPasswordStatus("error");
      setPasswordError(dictionary.authPage.errorGeneric);
    }
  }

  return (
    <div className={styles.accountPage}>
      <h1 className={styles.accountTitle}>{dictionary.accountPage.navProfile}</h1>

      <form className={styles.accountCard} onSubmit={handleProfileSubmit}>
        <button
          type="button"
          className={styles.avatarButton}
          onClick={() => fileInputRef.current?.click()}
          aria-label={dictionary.accountPage.changePhoto}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className={styles.avatarImage} />
          ) : (
            <span className={styles.avatarFallback} aria-hidden="true">
              {subscriber.name.charAt(0)}
            </span>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className={styles.hiddenFileInput}
          onChange={handleFileChange}
        />

        <label className={styles.formLabel} htmlFor="profile-name">
          {dictionary.accountPage.nameLabel}
        </label>
        <input
          id="profile-name"
          type="text"
          className={styles.formInput}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <div style={{ height: "0.75rem" }} />

        <label className={styles.formLabel} htmlFor="profile-email">
          {dictionary.accountPage.emailLabel}
        </label>
        <input id="profile-email" type="email" className={styles.formInput} value={subscriber.email} disabled readOnly />

        <div style={{ height: "0.75rem" }} />

        <label className={styles.formLabel} htmlFor="profile-bio">
          {dictionary.accountPage.bioLabel}
        </label>
        <textarea
          id="profile-bio"
          className={styles.formTextarea}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          rows={4}
          maxLength={1000}
        />

        <div style={{ height: "0.75rem" }} />

        <button type="submit" className={styles.planButton} disabled={profileStatus === "saving"}>
          {dictionary.accountPage.saveProfile}
        </button>
        {profileStatus === "saved" && <p className={styles.formStatusSuccess}>{dictionary.accountPage.savedMessage}</p>}
        {profileError && <p className={styles.formStatusError}>{profileError}</p>}
      </form>

      <h2 className={styles.accountTitle}>{dictionary.accountPage.changePasswordTitle}</h2>
      <form className={styles.accountCard} onSubmit={handlePasswordSubmit}>
        <label className={styles.formLabel} htmlFor="current-password">
          {dictionary.accountPage.currentPasswordLabel}
        </label>
        <input
          id="current-password"
          type="password"
          className={styles.formInput}
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          required
        />

        <div style={{ height: "0.75rem" }} />

        <label className={styles.formLabel} htmlFor="new-password">
          {dictionary.accountPage.newPasswordLabel}
        </label>
        <input
          id="new-password"
          type="password"
          className={styles.formInput}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          required
          minLength={8}
        />

        <div style={{ height: "0.75rem" }} />

        <button type="submit" className={styles.planButton} disabled={passwordStatus === "saving"}>
          {dictionary.accountPage.changePasswordButton}
        </button>
        {passwordStatus === "saved" && <p className={styles.formStatusSuccess}>{dictionary.accountPage.savedMessage}</p>}
        {passwordError && <p className={styles.formStatusError}>{passwordError}</p>}
      </form>
    </div>
  );
}
