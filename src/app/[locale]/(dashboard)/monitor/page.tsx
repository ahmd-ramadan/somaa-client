'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Hash, AtSign, Link } from 'lucide-react';
import KeywordsMonitor from './components/KeywordsMonitor';
import type { MonitorTab } from '@/types/monitor';

export default function MonitorPage() {
  const t = useTranslations('Monitor');
  const [activeTab, setActiveTab] = useState<MonitorTab>('keywords');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'keywords':
        return <KeywordsMonitor />;
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <AtSign className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('tabs.profile')}
            </h3>
            <p className="text-gray-600">
              Profile monitoring functionality coming soon...
            </p>
          </div>
        );
      case 'url':
        return (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <Link className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('tabs.url')}
            </h3>
            <p className="text-gray-600">
              URL monitoring functionality coming soon...
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  // const nodeEnv = process.env.NODE_ENV;
  // if(nodeEnv !== 'development') {
  //   return null
  // } 

  return (
    <div className="min-h-screen bg-gray-50 px-1 py-3">
      <div className="md:mx-2">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-primary mb-2">{t('pageTitle')}</h1>
          <p className="text-gray-600">{t('pageDescription')}</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="border-b border-gray-200">
            <nav className="flex items-center justify-start gap-6" aria-label="Tabs">
              <button
                  onClick={() => setActiveTab('keywords')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'keywords'
                      ? 'border-secondary text-secondary font-semibold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Hash className="w-4 h-4" />
                    {t('tabs.keywords')}
                  </div>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-secondary text-secondary font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1">
                  <AtSign className="w-4 h-4" />
                  {t('tabs.profile')}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('url')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'url'
                    ? 'border-secondary text-secondary font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Link className="w-4 h-4" />
                  {t('tabs.url')}
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
