"use client";

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { useStore } from "@/components/store/StoreProvider";
import styles from "./books.module.css";

type CartViewProps = {
  locale: Locale;
  dictionary: Dictionary;
  whatsappNumber: string | null;
};

export function CartView({ locale, dictionary, whatsappNumber }: CartViewProps) {
  const { cart, removeFromCart, setQty, cartTotal } = useStore();

  if (cart.length === 0) {
    return (
      <div className={styles.listPage}>
        <h1 className={styles.pageTitle}>{dictionary.cartPage.title}</h1>
        <p className={styles.empty}>{dictionary.cartPage.empty}</p>
        <Link href={`/${locale}/books`} className={styles.postActionPrimary}>
          {dictionary.cartPage.continueShopping}
        </Link>
      </div>
    );
  }

  const currency = cart[0]?.currency || "SAR";
  const summaryLines = cart.map((item) => `- ${item.title} x${item.qty}`).join("\n");
  const message = `${dictionary.cartPage.title}:\n${summaryLines}\n\n${dictionary.cartPage.total}: ${cartTotal.toFixed(2)} ${currency}`;
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`
    : null;

  return (
    <div className={styles.listPage}>
      <h1 className={styles.pageTitle}>{dictionary.cartPage.title}</h1>

      {cart.map((item) => (
        <div key={item.id} className={styles.listItem}>
          <div className={styles.listItemImageWrap}>
            {item.coverImageUrl && (
              <Image src={item.coverImageUrl} alt={item.title} fill sizes="4.5rem" className={styles.listItemImage} />
            )}
          </div>
          <div className={styles.listItemBody}>
            <Link href={`/${locale}/books/${item.slug}`} className={styles.listItemTitle}>
              {item.title}
            </Link>
            <p className={styles.listItemPrice}>
              {item.price !== null ? `${item.price.toFixed(2)} ${item.currency}` : ""}
            </p>
            <div className={styles.qtyStepper}>
              <button type="button" className={styles.qtyButton} onClick={() => setQty(item.id, item.qty - 1)}>
                −
              </button>
              <span>{item.qty}</span>
              <button type="button" className={styles.qtyButton} onClick={() => setQty(item.id, item.qty + 1)}>
                +
              </button>
            </div>
          </div>
          <button type="button" className={styles.removeButton} onClick={() => removeFromCart(item.id)}>
            {dictionary.cartPage.remove}
          </button>
        </div>
      ))}

      <div className={styles.cartSummary}>
        <span className={styles.cartTotalLabel}>
          {dictionary.cartPage.total}: {cartTotal.toFixed(2)} {currency}
        </span>
      </div>

      {whatsappHref && (
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
          {dictionary.cartPage.sendWhatsapp}
        </a>
      )}
    </div>
  );
}
