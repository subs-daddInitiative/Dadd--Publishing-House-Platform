import type { NewsTickerItem } from "@/lib/serverApi";
import styles from "./NewsTicker.module.css";

type NewsTickerProps = {
  items: NewsTickerItem[];
};

function TickerSegment({ items, hidden }: { items: NewsTickerItem[]; hidden?: boolean }) {
  return (
    <span className={styles.segment} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <span key={item.id} className={styles.item}>
          {item.message}
        </span>
      ))}
    </span>
  );
}

export function NewsTicker({ items }: NewsTickerProps) {
  if (items.length === 0) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.track}>
        <TickerSegment items={items} />
        <TickerSegment items={items} hidden />
      </div>
    </div>
  );
}
