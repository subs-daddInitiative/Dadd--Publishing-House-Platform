import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  SnapchatIcon,
  LinkedinIcon,
} from "@/features/home/icons";

export const PLATFORM_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  snapchat: "Snapchat",
  linkedin: "LinkedIn",
};

export const PLATFORM_ICONS: Record<string, typeof FacebookIcon> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TiktokIcon,
  snapchat: SnapchatIcon,
  linkedin: LinkedinIcon,
};
