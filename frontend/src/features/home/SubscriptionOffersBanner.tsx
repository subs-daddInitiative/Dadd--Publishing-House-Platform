import type { Dictionary } from "@/i18n/getDictionary";
import type { Banner } from "@/lib/serverApi";
import { Reveal } from "@/components/Reveal";
import { BannerSlider } from "./BannerSlider";
import styles from "./home.module.css";

type SubscriptionOffersBannerProps = {
  dictionary: Dictionary;
  banners: Banner[];
  backendUrl: string;
};

export function SubscriptionOffersBanner({ dictionary, banners, backendUrl }: SubscriptionOffersBannerProps) {
  if (banners.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal delay={150}>
          <BannerSlider
            banners={banners}
            backendUrl={backendUrl}
            prevLabel={dictionary.home.previousSlide}
            nextLabel={dictionary.home.nextSlide}
            variant="strip"
          />
        </Reveal>
      </div>
    </section>
  );
}
