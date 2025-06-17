export type Platform = 
    | 'facebook' 
    | 'twitter' 
    | 'instagram' 
    | 'youtube' 
    | 'linkedin' 
    | 'tiktok'
    | 'telegram'
    | 'whatsapp'
    | 'snapchat'
    | 'pinterest'
    | 'reddit'
    | 'medium'
    | 'quora'
    | 'tumblr'
    | 'vimeo'
    | 'twitch'
    | 'discord'
    | 'other';

export type Classification = 'positive' | 'negative' | 'natural';

export type ContentType = 'video' | 'post' | 'photo' | 'media & post' | 'other';

export interface Location {
    region: string;
    city: string;
    neighborhood?: string;
}

export interface Analysis {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Sector {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface MonitoringEntry {
    id: string;
    url: string;
    platform: Platform;
    classification: Classification;
    analysis: Analysis;
    sector: Sector;
    location: Location;
    contentType: ContentType;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface MonitoringFormData {
    url: string;
    platform: Platform;
    classification: Classification;
    analysis: string;
    sector: string;
    location: Location;
    contentType: ContentType;
    notes?: string;
}

export interface MonitoringFilters {
    date?: {
        start?: string;
        end?: string;
    };
    platform?: Platform;
    classification?: Classification;
    analysis?: string;
    sector?: string;
    location?: {
        region?: string;
        city?: string;
        neighborhood?: string;
    };
    contentType?: ContentType;
} 