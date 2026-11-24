import { IDBModel } from "./general.interface";

export enum SocialPlatformsEnum {
    X = 'x',
    FACEBOOK = 'facebook',
    INSTAGRAM = 'instagram',
    TIKTOK = 'tiktok',
    YOUTUBE = 'youtube',
    LINKEDIN = 'linkedin',
    THREADS = 'threads',
    REDDIT = 'reddit',
    GOOGLE = 'google'
}

export interface ISocialMediaProfile extends IDBModel {
    platform: SocialPlatformsEnum;
    url: string;
    joinAt?: string;

    userId: string;
    name: string;
    handle: string;
    avatar?: string;
    cover?: string;
    isVerified?: boolean;
    bio?: string;
    gender?: string;
    age?: number;
    location?: {
        lat?: number;
        lng?: number;
        address?: string;
    };

    followers?: number;
    following?: number;
    friends?: number;
    connection?: number;
    subscribers?: number;
    hearts?: number;
    likes?: number;
    views?: number;
    posts?: number;
    media?: number;

    havePostsCount: number;
}
