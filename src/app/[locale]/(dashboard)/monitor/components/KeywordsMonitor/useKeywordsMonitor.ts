import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  IMonitorResult,
  IKeywordsFilters, 
  IPlatformFilter, 
  FollowedKeyword, 
  FollowInterval,
  PlatformsNamesEnum,
  MonitorSortByEnum,
  MonitorDateFiltersEnum,
  IKeyword,
  MonitorByKeywordsRequest,
  MonitorByKeywordsResponse
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

const FOLLOW_INTERVALS: FollowInterval[] = [
  { value: '1h', label: '1 Hour', hours: 1 },
  { value: '3h', label: '3 Hours', hours: 3 },
  { value: '6h', label: '6 Hours', hours: 6 },
  { value: '12h', label: '12 Hours', hours: 12 },
  { value: '1d', label: '1 Day', hours: 24 },
  { value: '3d', label: '3 Days', hours: 72 },
  { value: '1w', label: '1 Week', hours: 168 },
  { value: '1m', label: '1 Month', hours: 720 },
  { value: '1y', label: '1 Year', hours: 8760 }
];

const DEFAULT_PLATFORMS: IPlatformFilter[] = [
  { name: PlatformsNamesEnum.X, enabled: true, sortBy: 'latest' },
  { name: PlatformsNamesEnum.FACEBOOK, enabled: true, sortBy: 'latest' },
  { name: PlatformsNamesEnum.INSTAGRAM, enabled: true, sortBy: 'latest' },
  { name: PlatformsNamesEnum.LINKEDIN, enabled: true, sortBy: 'latest' },
  { name: PlatformsNamesEnum.YOUTUBE, enabled: true, sortBy: 'latest' },
  { name: PlatformsNamesEnum.TIKTOK, enabled: true, sortBy: 'latest' },
  { name: PlatformsNamesEnum.REDDIT, enabled: true, sortBy: 'latest' },
  { name: PlatformsNamesEnum.THREADS, enabled: true, sortBy: 'latest' },
  { name: PlatformsNamesEnum.GOOGLE, enabled: true, sortBy: 'latest' }
];

const DEFAULT_FILTERS: IKeywordsFilters = {
  platforms: DEFAULT_PLATFORMS,
  sortBy: MonitorSortByEnum.LATEST,
  excludeUsers: [],
  language: [],
  dateRange: MonitorDateFiltersEnum.ALL_TIME,
  engagement: 'all',
  hasMedia: false,
  verifiedOnly: false
};

export function useKeywordsMonitor() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IMonitorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<IKeywordsFilters>(DEFAULT_FILTERS);
  const [followedKeywords, setFollowedKeywords] = useState<FollowedKeyword[]>([]);

  // Load followed keywords from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('followedKeywords');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFollowedKeywords(parsed.map((item: any) => ({
          ...item,
          lastUpdate: new Date(item.lastUpdate),
          nextUpdate: new Date(item.nextUpdate)
        })));
      } catch (e) {
        console.error('Failed to parse followed keywords:', e);
      }
    }
  }, []);

  // Save followed keywords to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('followedKeywords', JSON.stringify(followedKeywords));
  }, [followedKeywords]);

  // Schedule updates for followed keywords
  useEffect(() => {
    const intervals = followedKeywords
      .filter(kw => kw.isActive)
      .map(kw => {
        const interval = FOLLOW_INTERVALS.find(i => i.value === kw.interval);
        if (!interval) return null;
        
        const now = new Date();
        const timeUntilNext = kw.nextUpdate.getTime() - now.getTime();
        
        if (timeUntilNext <= 0) {
          // Update immediately if overdue
          return setTimeout(() => updateFollowedKeyword(kw.id), 0);
        } else {
          // Schedule for next update
          return setTimeout(() => updateFollowedKeyword(kw.id), timeUntilNext);
        }
      })
      .filter(Boolean);

    return () => {
      intervals.forEach(interval => {
        if (interval) clearTimeout(interval);
      });
    };
  }, [followedKeywords]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Create keywords array from the query
      const keywords: IKeyword[] = [
        {
          id: Date.now().toString(),
          text: query.trim(),
          type: 'word' as any // You might want to detect if it's a hashtag or user
        }
      ];

      const requestData: MonitorByKeywordsRequest = {
        keywords,
        filters
      };

      const response = await axios.post<MonitorByKeywordsResponse>(
        `${API_BASE_URL}/monitor/keywords`,
        requestData
      );

      if (response.data.success) {
        setResults(response.data.data.results);
        setDataSource('multiple');
        
        // Add to search history if not already present
        if (!searchHistory.includes(query.trim())) {
          setSearchHistory(prev => [query.trim(), ...prev.slice(0, 9)]);
        }
      } else {
        setError(response.data.message || 'Failed to fetch results');
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to fetch results. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [query, filters, searchHistory]);

  const followKeyword = useCallback((interval: string) => {
    if (!query.trim()) return;

    const newFollowed: FollowedKeyword = {
      id: Date.now().toString(),
      query: query.trim(),
      filters: { ...filters },
      interval,
      lastUpdate: new Date(),
      nextUpdate: calculateNextUpdate(interval),
      isActive: true
    };

    setFollowedKeywords(prev => [...prev, newFollowed]);
  }, [query, filters]);

  const unfollowKeyword = useCallback((id: string) => {
    setFollowedKeywords(prev => prev.filter(kw => kw.id !== id));
  }, []);

  const updateFollowedKeyword = useCallback(async (id: string) => {
    const keyword = followedKeywords.find(kw => kw.id === id);
    if (!keyword || !keyword.isActive) return;

    try {
      const keywords: IKeyword[] = [
        {
          id: keyword.id,
          text: keyword.query,
          type: 'word' as any
        }
      ];

      const requestData: MonitorByKeywordsRequest = {
        keywords,
        filters: keyword.filters
      };

      const response = await axios.post<MonitorByKeywordsResponse>(
        `${API_BASE_URL}/monitor/keywords`,
        requestData
      );

      if (response.data.success) {
        // Update the keyword with new timestamps
        setFollowedKeywords(prev => prev.map(kw => 
          kw.id === id 
            ? {
                ...kw,
                lastUpdate: new Date(),
                nextUpdate: calculateNextUpdate(kw.interval)
              }
            : kw
        ));
      }
    } catch (err) {
      console.error('Failed to update followed keyword:', err);
    }
  }, [followedKeywords]);

  const calculateNextUpdate = (interval: string): Date => {
    const intervalObj = FOLLOW_INTERVALS.find(i => i.value === interval);
    if (!intervalObj) return new Date();
    
    const next = new Date();
    next.setHours(next.getHours() + intervalObj.hours);
    return next;
  };

  return {
    query,
    setQuery,
    results, 
    loading,
    error,
    searchHistory,
    dataSource,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    followedKeywords,
    followKeyword,
    unfollowKeyword,
    handleSearch,
    followIntervals: FOLLOW_INTERVALS
  };
} 