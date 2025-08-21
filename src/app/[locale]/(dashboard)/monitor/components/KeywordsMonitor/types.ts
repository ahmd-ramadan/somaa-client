// Enums matching the backend
export enum MonitorSentimentsEnum {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral'
}

export enum GenderTypesEnum {
  MALE = 'male',
  FEMALE = 'female',
  NOT_DETECT = 'not_detect'
}

export enum MonitorLanguagesEnum {
  ARABIC = 'ar',
  ENGLISH = 'en',
  FRENCH = 'fr',
  GERMAN = 'de',
  ITALIAN = 'it',
  SPANISH = 'es',
  RUSSIAN = 'ru',
  PORTUGUESE = 'pt',
  CHINESE = 'zh',
  JAPANESE = 'ja',
  HINDI = 'hi',
}

export enum KeywordTypesEnum {
  WORD = 'word',
  HASHTAG = 'hashtag',
  USER = 'user'
}

export enum PlatformsNamesEnum {
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

export enum MonitorDateFiltersEnum {
  LAST_DAY = 'last_day',
  LAST_WEEK = 'last_week',
  LAST_MONTH = 'last_month',
  LAST_YEAR = 'last_year',
  ALL_TIME = 'all_time'
}

export enum MonitorSortByEnum {
  LATEST = 'latest',
  TOP = 'top'
}

// Interfaces matching the backend
export interface IKeyword {
  id: string;
  text: string;
  type: KeywordTypesEnum;
}

export interface IPlatformFilter {
  name: PlatformsNamesEnum;
  enabled: boolean;
  sortBy: string;
}

export interface IKeywordsFilters {
  platforms: IPlatformFilter[];
  sortBy: MonitorSortByEnum;
  excludeUsers: string[];
  language: MonitorLanguagesEnum[]; // Changed from string to array
  dateRange: MonitorDateFiltersEnum;
  engagement: string;
  hasMedia: boolean;
  verifiedOnly: boolean;
}

// Monitor result interface matching the backend
export interface IMonitorResult {
  author: {
    name: string;
    handle: string;
    avatar?: string;
    followers?: number;
    following?: number;
    subscribers?: number;
    friends?: number;
    connection?: number;
    isVerified?: boolean;
    gender?: GenderTypesEnum;
    age?: number;
  };
  content: {
    images: string[];
    videos: string[];
    text: string;
  };
  interactions: {
    reactions?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    retweets?: number;
    quotes?: number;
    remixes?: number;
    subscriptions?: number;
    reposts?: number;
    votes?: number;
    views?: number;
    downloads?: number;
    bookmarks?: number;
  };
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
  };
  url: string;
  platform: PlatformsNamesEnum;
  language?: MonitorLanguagesEnum;
  sentiment: MonitorSentimentsEnum;
  publishAt: string;
}

// API request/response interfaces
export interface MonitorByKeywordsRequest {
  keywords: IKeyword[];
  filters: IKeywordsFilters;
}

export interface MonitorByKeywordsResponse {
  success: boolean;
  data: {
    results: IMonitorResult[];
    total: number;
    hasNextPage?: boolean;
    nextCursor?: string;
  };
  message?: string;
}

// Frontend specific interfaces
export interface FollowInterval {
  value: string;
  label: string;
  hours: number;
}

export interface FollowedKeyword {
  id: string;
  query: string;
  filters: IKeywordsFilters;
  interval: string;
  lastUpdate: Date;
  nextUpdate: Date;
  isActive: boolean;
}

// Legacy types for backward compatibility
export type PlatformFilter = IPlatformFilter;
export type KeywordsFilters = IKeywordsFilters;
export type SocialMediaPlatform = PlatformsNamesEnum;
export type SortOption = MonitorSortByEnum; 