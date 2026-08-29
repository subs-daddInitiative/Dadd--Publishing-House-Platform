"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./MobileNav.module.css";

type NavItem = { href: string; label: string };

type MobileNavProps = {
  navItems: NavItem[];
  openLabel: string;
  closeLabel: string;
};

export function MobileNav({ navItems, openLabel, closeLabel }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={styles.hamburgerButton}
        aria-label={openLabel}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className={styles.hamburgerLine} aria-hidden="true" />
        <span className={styles.hamburgerLine} aria-hidden="true" />
        <span className={styles.hamburgerLine} aria-hidden="true" />
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <nav className={styles.drawer} aria-label={openLabel} onClick={(event) => event.stopPropagation()}>
            <button type="button" className={styles.closeButton} aria-label={closeLabel} onClick={() => setOpen(false)}>
              ×
            </button>
            <ul className={styles.drawerList}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.drawerLink} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
