import FacebookIcon from '@/components/icons/SocialMedia/Facebook';
import InstagramIcon from '@/components/icons/SocialMedia/Instagram';
import LinkedInIcon from '@/components/icons/SocialMedia/LinkedIn';
import TikTokIcon from '@/components/icons/SocialMedia/TikTok';
import XIcon from '@/components/icons/SocialMedia/X';
import YoutubeIcon from '@/components/icons/SocialMedia/Youtube';
import { PlatformsEnum } from '@/interfaces/analysis.types';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import React, { ReactNode } from 'react';

export const getPlatformIcon = (platform: PlatformsEnum): ReactNode => {
    switch (platform) {
        case PlatformsEnum.FACEBOOK:
            return <FacebookIcon width='20px' height='20px'/>;
        case PlatformsEnum.X:
            return <XIcon width='20px' height='20px' />;
        case PlatformsEnum.INSTAGRAM:
            return <InstagramIcon width='20px' height='20px' />;
        case PlatformsEnum.LINKEDIN:
            return <LinkedInIcon  width='20px' height='20px'/>;
        case PlatformsEnum.YOUTUBE:
            return <YoutubeIcon width='20px' height='20px'/>;
        case PlatformsEnum.TIKTOK:
            return <TikTokIcon width='20px' height='20px'/>;
        default:
            return null;
    }
};

export const getPlatformName = (platform: PlatformsEnum): string => {
    switch (platform) {
        case PlatformsEnum.FACEBOOK:
            return 'فيسبوك';
        case PlatformsEnum.X:
            return 'إكس';
        case PlatformsEnum.INSTAGRAM:
            return 'إنستجرام';
        case PlatformsEnum.LINKEDIN:
            return 'لينكدإن';
        case PlatformsEnum.YOUTUBE:
            return 'يوتيوب';
        case PlatformsEnum.TIKTOK:
            return 'تيكتوك';
        default:
            return 'منصة';
    }
}; 