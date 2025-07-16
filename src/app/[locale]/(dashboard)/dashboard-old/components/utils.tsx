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
            return <FacebookIcon className='w-5 h-5'/>;
        case PlatformsEnum.X:
            return <XIcon className='w-5 h-5' />;
        case PlatformsEnum.INSTAGRAM:
            return <InstagramIcon className='w-5 h-5' />;
        case PlatformsEnum.LINKEDIN:
            return <LinkedInIcon  className='w-5 h-5'/>;
        case PlatformsEnum.YOUTUBE:
            return <YoutubeIcon className='w-5 h-5'/>;
        case PlatformsEnum.TIKTOK:
            return <TikTokIcon className='w-5 h-5'/>;
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