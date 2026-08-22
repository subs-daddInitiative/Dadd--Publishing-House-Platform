import type { Dictionary } from "@/i18n/getDictionary";
import type { PublicStats } from "@/lib/serverApi";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import styles from "./home.module.css";

type StatsProps = {
  dictionary: Dictionary;
  stats: PublicStats | null;
};

export function Stats({ dictionary, stats }: StatsProps) {
  const items = [
    { key: "books", value: stats?.books ?? 0, label: dictionary.home.statsBooks },
    { key: "studies", value: stats?.studies ?? 0, label: dictionary.home.statsStudies },
    { key: "blogs", value: stats?.blogs ?? 0, label: dictionary.home.statsBlogs },
  ] as const;

  return (
    <section className={styles.statsSection}>
      <div className={`container ${styles.statsGrid}`}>
        {items.map((item, index) => (
          <Reveal key={item.key} className={styles.statCard} delay={index * 120}>
            <span className={styles.statValue}>
              <CountUp value={item.value} />
            </span>
            <span className={styles.statLabel}>{item.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
