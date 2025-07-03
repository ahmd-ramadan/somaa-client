import { PlatformsEnum } from '@/types/platforms';
import { formatDistanceToNowStrict } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

// export const getPlatformIcon = (platform: PlatformsEnum) => {
//     switch (platform) {
//         case PlatformsEnum.FACEBOOK:
//             return <Facebook className="w-5 h-5 text-blue-500" />;
//         case PlatformsEnum.TWITTER:
//             return <Twitter className="w-5 h-5 text-blue-400" />;
//         case PlatformsEnum.INSTAGRAM:
//             return <Instagram className="w-5 h-5 text-pink-500" />;
//         case PlatformsEnum.LINKEDIN:
//             return <Linkedin className="w-5 h-5 text-blue-600" />;
//         case PlatformsEnum.YOUTUBE:
//             return <Youtube className="w-5 h-5 text-red-500" />;
//         default:
//             return null;
//     }
// };

// export const getPlatformName = (platform: PlatformsEnum) => {
//     switch (platform) {
//         case PlatformsEnum.FACEBOOK:
//             return 'Facebook';
//         case PlatformsEnum.TWITTER:
//             return 'Twitter';
//         case PlatformsEnum.INSTAGRAM:
//             return 'Instagram';
//         case PlatformsEnum.LINKEDIN:
//             return 'LinkedIn';
//         case PlatformsEnum.YOUTUBE:
//             return 'YouTube';
//         default:
//             return 'Unknown';
//     }
// }; 

export const formatDistanceToNow = ({ date, locale }: { date: string, locale: string }): string  => {
    return formatDistanceToNowStrict(date, { 
        addSuffix: true,
        locale: locale === 'ar' ? arSA : enUS 
    })
}