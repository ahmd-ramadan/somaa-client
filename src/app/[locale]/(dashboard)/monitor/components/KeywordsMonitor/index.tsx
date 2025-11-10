'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import KeywordsFilters from './KeywordsFilters';
import KeywordsResults from './KeywordsResults';
import KeywordsActions from './KeywordsActions';
import { RootState } from '@/lib/store';
import { IKeywordsFilters, PlatformsNamesEnum, MonitorSortByEnum, MonitorDateFiltersEnum, MonitorLanguagesEnum } from './types';

export default function KeywordsMonitor() {
  const t = useTranslations('Monitor.keywords');
  const { results } = useSelector((state: RootState) => state.monitor);

  // Default filters with all platforms
  const defaultFilters: IKeywordsFilters = {
    platforms: [
      { name: PlatformsNamesEnum.X, enabled: true, sortBy: 'latest' },
      // { name: PlatformsNamesEnum.FACEBOOK, enabled: true, sortBy: 'latest' },
      // { name: PlatformsNamesEnum.INSTAGRAM, enabled: true, sortBy: 'latest' },
      // { name: PlatformsNamesEnum.LINKEDIN, enabled: true, sortBy: 'latest' },
      { name: PlatformsNamesEnum.YOUTUBE, enabled: true, sortBy: 'latest' },
      { name: PlatformsNamesEnum.TIKTOK, enabled: true, sortBy: 'latest' },
      { name: PlatformsNamesEnum.REDDIT, enabled: true, sortBy: 'latest' },
      { name: PlatformsNamesEnum.THREADS, enabled: true, sortBy: 'latest' },
      // { name: PlatformsNamesEnum.GOOGLE, enabled: true, sortBy: 'latest' }
    ],
    sortBy: MonitorSortByEnum.LATEST,
    excludeUsers: [],
    language: [],
    dateRange: MonitorDateFiltersEnum.ALL_TIME,
    engagement: 'all',
    hasMedia: false,
    verifiedOnly: false
  };

  const [filters, setFilters] = useState<IKeywordsFilters>(defaultFilters);

  return (
    <div className="space-y-6">
      {/* Search and Settings Combined */}
      <KeywordsFilters
        showFilters={true}
        onToggleFilters={() => {}}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Actions */}
      <KeywordsActions
        query=""
        onFollow={() => {}}
        followedKeywords={[]}
        onUnfollow={() => {}}
      />

      {/* Error Message */}
      {/* {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{t('error.fetchFailed')}</p>
        </div>
      )} */}

      {/* Results */}
      {results.length > 0 && (
        <KeywordsResults dataSource="multiple" />
      )}

      {/* Empty State */}
      {/* {!loading && results.length === 0 && !error && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('emptyState.title')}
          </h3>
          <p className="text-gray-600">
            {t('emptyState.description')}
          </p>
        </div>
      )} */}
    </div>
  );
} 