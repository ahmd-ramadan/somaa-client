import FacebookIcon from "@/components/icons/SocialMedia/Facebook";
import { PlatformsNamesEnum } from "./types";
import InstagramIcon from "@/components/icons/SocialMedia/Instagram";
import LinkedInIcon from "@/components/icons/SocialMedia/LinkedIn";
import YoutubeIcon from "@/components/icons/SocialMedia/Youtube";
import RedditIcon from "@/components/icons/SocialMedia/Reddit";
import TikTokIcon from "@/components/icons/SocialMedia/TikTok";
import ThreadsIcon from "@/components/icons/SocialMedia/Threads";
import GoogleIcon from "@/components/icons/SocialMedia/Google";
import { ReactNode } from "react";
import XIcon from "@/components/icons/SocialMedia/X";

export const getPlatformIcon = ({ platform, className}: { platform: PlatformsNamesEnum, className: string }): ReactNode => {
    switch (platform) {
        case PlatformsNamesEnum.FACEBOOK:
            return <FacebookIcon className={className}/>;
        case PlatformsNamesEnum.X:
            return <XIcon className={className} />;
        case PlatformsNamesEnum.INSTAGRAM:
            return <InstagramIcon className={className} />;
        case PlatformsNamesEnum.LINKEDIN:
            return <LinkedInIcon  className={className}/>;
        case PlatformsNamesEnum.YOUTUBE:
            return <YoutubeIcon className={className}/>;
        case PlatformsNamesEnum.TIKTOK:
            return <TikTokIcon className={className}/>;
        case PlatformsNamesEnum.REDDIT:
            return <RedditIcon className={className}/>;
        case PlatformsNamesEnum.GOOGLE:
          return <GoogleIcon className={className}/>;
        case PlatformsNamesEnum.THREADS:
          return <ThreadsIcon className={className}/>; 
          default:
            return null;
    }
};

export const getProfileLink = ({
    platform,
    handle,
  }: {
    platform: PlatformsNamesEnum;
    handle: string;
  }): string | null => {
    switch (platform) {
      case PlatformsNamesEnum.FACEBOOK:
        return `https://www.facebook.com/${handle}`;
      case PlatformsNamesEnum.X:
        return `https://x.com/${handle}`;
      case PlatformsNamesEnum.INSTAGRAM:
        return `https://www.instagram.com/${handle}`;
      case PlatformsNamesEnum.LINKEDIN:
        return `https://www.linkedin.com/in/${handle}`;
      case PlatformsNamesEnum.YOUTUBE:
        return `https://www.youtube.com/${handle.startsWith("channel/") || handle.startsWith("c/") || handle.startsWith("@") ? handle : `@${handle}`}`;
      case PlatformsNamesEnum.TIKTOK:
        return `https://www.tiktok.com/@${handle}`;
      case PlatformsNamesEnum.REDDIT:
        return `https://www.reddit.com/user/${handle}`;
      case PlatformsNamesEnum.GOOGLE:
        return `https://www.google.com/search?q=${encodeURIComponent(handle)}`;
      case PlatformsNamesEnum.THREADS:
        return `https://www.threads.net/@${handle}`;
      default:
        return null;
    }
  };
  