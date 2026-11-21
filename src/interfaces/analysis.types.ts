import { ICloudinaryIMage, IDBModel } from "./general.interface";

export enum PlatformsEnum {
    X = 'x',
    INSTAGRAM = 'instagram',
    YOUTUBE = 'youtube',
    TIKTOK = 'tiktok',
    FACEBOOK = 'facebook',
    LINKEDIN = 'linkedin',
}

export enum AnalysisClassifyEnum {
    POSITIVE = 'positive',
    NEGATIVE = 'negative',
    NEUTRAL = 'neutral',
}

export interface IAnalysisModel extends IDBModel {
    url: string;
    tweetType: TweetTypesEnum,
    subAnalysisId: string;
    platform: PlatformsEnum;
    content: IContentData;
    classify: AnalysisClassifyEnum;
    sectorId: string;
    publisher: IPublisherData;
    location?: ILocationData;
    statistics: IStatistics;
    note?: string;
    isFlagged: boolean;
    isHighlighted: boolean;
    isRelated: boolean;
    publishDate?: string | Date;
    addedBy: string;
}

export enum TweetTypesEnum {
    TWEET = 'tweet',
    REPLY = 'reply',
    QUOTE = 'quote'
}

export enum ContentTypesEnum {
    TEXT = 'text',
    VIDEO = "video",
    IMAGE = 'image',
    OTHERS = 'others'
}

export interface IContentData {
    body?: string;
    type: ContentTypesEnum
}

export interface ILocationData {
    region?: string,
    city?: string,
    district?: string
    lat?: number,
    lng?: number,
}

export interface IPublisherData {
    name: string,
    handle?: string,
    avatar: string,
    followers: number,
}

export interface IStatistics {
    reactions: number;
    comments: number;
    shares: number;
    views: number;
    appearance: number,
}

export interface IAnalysisSector {
    _id: string,
    name: string
}

export interface ISubAnalysisData {
    _id: string,
    body: string
}

export interface IAnalysis extends IAnalysisModel {
    addedByData: {
        name: string;
        avatar: ICloudinaryIMage
    }
    publisherData?: IPublisherData
    sectorData: IAnalysisSector
    subAnalysisData:ISubAnalysisData
}

export interface ICreateAnalysisQuery {
    url: string;
    platform: PlatformsEnum;
    classify: AnalysisClassifyEnum;
    location?: ILocationData;
    contentType: ContentTypesEnum;
    sectorId: string;
    subAnalysisId: string;
    note?: string;
    content?: Partial<IContentData>;
    publisher?: Partial<IPublisherData>;
    isFlagged?: boolean;
    isHighlighted?: boolean;
    isRelated?: boolean;
    publishDate?: string | Date;
    tweetType?: TweetTypesEnum;
    statistics?: Partial<IStatistics>;
}

export interface ICreateAnalysisData extends Omit<ICreateAnalysisQuery, 'contentType'> {
    publisher: IPublisherData,
    statistics: IStatistics,   
    content: IContentData,
}