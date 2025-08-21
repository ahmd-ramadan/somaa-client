'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle } from 'lucide-react';
import type { FollowedKeyword } from './types';

interface KeywordsActionsProps {
  query: string;
  onFollow: (interval: string) => void;
  followedKeywords: FollowedKeyword[];
  onUnfollow: (id: string) => void;
}

const FOLLOW_INTERVALS = [
  { value: '1h', label: '1 Hour' },
  { value: '3h', label: '3 Hours' },
  { value: '6h', label: '6 Hours' },
  { value: '12h', label: '12 Hours' },
  { value: '1d', label: '1 Day' },
  { value: '3d', label: '3 Days' },
  { value: '1w', label: '1 Week' },
  { value: '1m', label: '1 Month' },
  { value: '1y', label: '1 Year' }
];

export default function KeywordsActions({
  query,
  onFollow,
  followedKeywords,
  onUnfollow
}: KeywordsActionsProps) {
  const t = useTranslations('Monitor.keywords.follow');
  const [showUnfollowModal, setShowUnfollowModal] = useState<string | null>(null);

  const isAlreadyFollowed = followedKeywords.some(kw => kw.query === query);
  const followedKeyword = followedKeywords.find(kw => kw.query === query);

  if (!query.trim()) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">{t('followTitle')}</h3>
        <span className="text-xs text-gray-500">{t('followDescription')}</span>
      </div>

      {isAlreadyFollowed && followedKeyword ? (
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{t('alreadyFollowing')}</span>
            </div>
            <p className="text-xs text-blue-700 mb-3">{t('alreadyFollowingDesc')}</p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{t('currentlyFollowing')}</span>
                <span className="font-medium">{query}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{t('lastUpdate')}</span>
                <span className="font-medium">{followedKeyword.lastUpdate.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{t('nextUpdate')}</span>
                <span className="font-medium">{followedKeyword.nextUpdate.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowUnfollowModal(followedKeyword.id)}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            {t('unfollow')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-3">{t('followDescription')}</p>
            
            <div className="grid grid-cols-3 gap-2">
              {FOLLOW_INTERVALS.map((interval) => (
                <button
                  key={interval.value}
                  onClick={() => onFollow(interval.value)}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                >
                  {interval.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Unfollow Confirmation Modal */}
      {showUnfollowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('confirmUnfollow')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('unfollowMessage')}</p>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowUnfollowModal(null)}
                className="flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => {
                  onUnfollow(showUnfollowModal);
                  setShowUnfollowModal(null);
                }}
                className="flex-1 px-3 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 