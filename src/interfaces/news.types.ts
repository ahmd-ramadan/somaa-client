import { ILoggedInUser } from ".";
import { IDBModel } from "./general.interface";

export interface INewsModel extends IDBModel {
    url: string;
    title: string;
    newspaper: string,
    classify:  NewsClassifyEnum;
    geoClassify: NewsGeographicalClassifyEnum;
    sectorId: string;
    adType: NewsAdTypesEnum,
    pressType: NewsPressTypesEnum,
    isFlagged: boolean,
    isHighlighted: boolean,
    note?: string,
    addedBy: string
}

export interface INews extends INewsModel {
    addedByData: ILoggedInUser,
    sectorData: INewsSector
}

export interface INewsSector {
    _id: string,
    name: string
}

export enum NewsClassifyEnum {
    POSITIVE = 'positive',
    NEGATIVE = 'negative',
    NEUTRAL = 'neutral',
}

export enum NewsGeographicalClassifyEnum {
    LOCAL = 'local',
    ARABIC = 'arabic',
    GLOBAL = 'global',
}

export enum NewsAdTypesEnum {
    ELECTRONIC = 'electronic',
    VISUAL = 'visual',
    RADIO = 'radio',
    PRINT = 'print',
    GLOBAL = 'global',
    ARABIC = 'arabic',
    SOCIAL_MEDIA_PLATFORMS = 'social_media_platforms',
    YOUTUBE = 'youtube',
    OTHER = 'other'
}

export enum NewsPressTypesEnum {
    ARTICLES = 'articles',
    REPORTS = 'reports',
    NEWS = 'news',
    INVESTIGATION = 'investigation',
    INTERVIEWS = 'interviews',
    CARICATURES = 'caricatures'
}

export interface ICreateNewsQuery {
    url: string;
    title: string;
    classify:  NewsClassifyEnum;
    geoClassify: NewsGeographicalClassifyEnum;
    sectorId: string;
    adType: NewsAdTypesEnum,
    pressType: NewsPressTypesEnum,
    isFlagged?: boolean,
    isHighlighted?: boolean,
    note?: string,
    newspaper: string
}

export interface ICreateNewsData extends ICreateNewsQuery{
    addedBy: string
}