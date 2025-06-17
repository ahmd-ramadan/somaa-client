import { PlatformsEnum } from '@/interfaces/analysis.types';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import React, { ReactNode } from 'react';

export const getPlatformIcon = (platform: PlatformsEnum): ReactNode => {
    switch (platform) {
        case PlatformsEnum.FACEBOOK:
            return <Facebook className="w-5 h-5 text-blue-500" />;
        case PlatformsEnum.X:
            return <Twitter className="w-5 h-5 text-blue-400" />;
        case PlatformsEnum.INSTAGRAM:
            return <Instagram className="w-5 h-5 text-pink-500" />;
        case PlatformsEnum.LINKEDIN:
            return <Linkedin className="w-5 h-5 text-blue-600" />;
        case PlatformsEnum.YOUTUBE:
            return <Youtube className="w-5 h-5 text-red-500" />;
        default:
            return null;
    }
};

export const getPlatformName = (platform: PlatformsEnum): string => {
    switch (platform) {
        case PlatformsEnum.FACEBOOK:
            return 'Facebook';
        case PlatformsEnum.X:
            return 'Twitter';
        case PlatformsEnum.INSTAGRAM:
            return 'Instagram';
        case PlatformsEnum.LINKEDIN:
            return 'LinkedIn';
        case PlatformsEnum.YOUTUBE:
            return 'YouTube';
        default:
            return 'Unknown';
    }
}; 