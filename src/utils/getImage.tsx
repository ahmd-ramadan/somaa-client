import { PlatformsEnum } from "@/interfaces/analysis.types";

export const getImageURL = ({ imageURL, platform }: { imageURL: string, platform: PlatformsEnum }) => {
    if(!imageURL) {
        return '/logo.png'
    } else {
        // if(platform === PlatformsEnum.TIKTOK) return `/api/convert-heic?url=${encodeURIComponent(imageURL)}`;
        if(platform === PlatformsEnum.TIKTOK) return '/logo.png';
        else return imageURL;
    }
} 
