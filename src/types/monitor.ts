// Import the new types from the KeywordsMonitor component
export * from '@/app/[locale]/(dashboard)/monitor/components/KeywordsMonitor/types';

// Legacy interfaces for backward compatibility
export interface SocialMediaPost {
  id: string;
  platform: string; // Which platform this post is from
  username: string;
  displayName: string;
  content: string;
  timestamp: string;
  likes: string;
  retweets?: string; // Twitter specific
  shares?: string; // Facebook, LinkedIn specific
  comments: string;
  replies?: string; // Twitter specific
  media?: string[];
  avatar?: string;
  url?: string;
  viewCount?: string;
  isVerified?: boolean;
  // Platform specific fields
  platformSpecific?: {
    [key: string]: any;
  };
}

// Keep Tweet for backward compatibility
export type Tweet = SocialMediaPost;

export interface SocialMediaResponse {
  success: boolean;
  data: {
    posts: SocialMediaPost[];
    query: string;
    total: number;
    hasNextPage?: boolean;
    nextCursor?: string;
    source?: string;
    platform?: string;
  };
}

// Keep TweetResponse for backward compatibility
export type TweetResponse = SocialMediaResponse;

export type MonitorTab = 'keywords' | 'profile' | 'url'; 