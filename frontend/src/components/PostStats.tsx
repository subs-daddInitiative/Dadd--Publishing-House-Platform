import type { PostStat } from "@/lib/serverApi";
import styles from "./PostStats.module.css";

type PostStatsProps = {
  stats: PostStat[];
};

export function PostStats({ stats }: PostStatsProps) {
  if (stats.length === 0) return null;

  return (
    <div className={styles.strip}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.item}>
          <span className={styles.number}>{stat.number}</span>
          <span className={styles.title}>{stat.title}</span>
        </div>
      ))}
    </div>
  );
}
