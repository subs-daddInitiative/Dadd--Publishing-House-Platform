import type { Dictionary } from "@/i18n/getDictionary";
import type { Banner } from "@/lib/serverApi";
import { Reveal } from "@/components/Reveal";
import { BannerSlider } from "./BannerSlider";
import styles from "./home.module.css";

type BannersProps = {
  dictionary: Dictionary;
  banners: Banner[];
  backendUrl: string;
};

export function Banners({ dictionary, banners, backendUrl }: BannersProps) {
  if (banners.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal as="h2" className={styles.sectionTitleAccent}>
          {dictionary.home.announcementsTitle}
        </Reveal>
        <Reveal delay={150}>
          <BannerSlider
            banners={banners}
            backendUrl={backendUrl}
            prevLabel={dictionary.home.previousSlide}
            nextLabel={dictionary.home.nextSlide}
          />
        </Reveal>
      </div>
    </section>
  );
}
