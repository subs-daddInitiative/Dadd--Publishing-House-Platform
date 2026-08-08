import type { Dictionary } from "@/i18n/getDictionary";
import type { PublicStats } from "@/lib/serverApi";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { FloatingShapes } from "@/components/FloatingShapes";
import { BookIcon, StudyIcon, BlogIcon } from "./icons";
import styles from "./home.module.css";

type StatsProps = {
  dictionary: Dictionary;
  stats: PublicStats | null;
};

export function Stats({ dictionary, stats }: StatsProps) {
  const items = [
    { key: "books", value: stats?.books ?? 0, label: dictionary.home.statsBooks, Icon: BookIcon },
    { key: "studies", value: stats?.studies ?? 0, label: dictionary.home.statsStudies, Icon: StudyIcon },
    { key: "blogs", value: stats?.blogs ?? 0, label: dictionary.home.statsBlogs, Icon: BlogIcon },
  ] as const;

  return (
    <section className={styles.statsSection}>
      <FloatingShapes />
      <div className={`container ${styles.statsGrid}`}>
        {items.map((item, index) => (
          <Reveal key={item.key} className={`${styles.statCard} hover-lift`} delay={index * 120}>
            <span className={styles.statIconAvatar} aria-hidden="true">
              <item.Icon className={styles.statIcon} />
            </span>
            <span className={styles.statBody}>
              <span className={styles.statValue}>
                <CountUp value={item.value} />
              </span>
              <span className={styles.statLabel}>{item.label}</span>
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
