'use client';

import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Settings, Plus, X, ChevronDown, ChevronUp, UserMinus } from 'lucide-react';
import { 
  IKeywordsFilters, 
  IPlatformFilter, 
  PlatformsNamesEnum, 
  MonitorSortByEnum,
  MonitorDateFiltersEnum,
  KeywordTypesEnum,
  IKeyword,
  MonitorLanguagesEnum
} from './types';
import { monitorByKeywords } from '@/lib/features/monitor/monitorThunks';
import { setCurrentFilters, setCurrentKeywords, toggleAutoRefresh } from '@/lib/features/monitor/monitorSlice';
import { RootState, AppDispatch } from '@/lib/store';
import FacebookIcon from '@/components/icons/SocialMedia/Facebook';
import InstagramIcon from '@/components/icons/SocialMedia/Instagram';
import LinkedInIcon from '@/components/icons/SocialMedia/LinkedIn';
import YoutubeIcon from '@/components/icons/SocialMedia/Youtube';
import TikTokIcon from '@/components/icons/SocialMedia/TikTok';
import XIcon from '@/components/icons/SocialMedia/X';
import RedditIcon from '@/components/icons/SocialMedia/Reddit';
import GoogleIcon from '@/components/icons/SocialMedia/Google';
import ThreadsIcon from '@/components/icons/SocialMedia/Threads';
import { getPlatformIcon } from './utils';

interface KeywordsFiltersProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  filters: IKeywordsFilters;
  onFiltersChange: (filters: IKeywordsFilters) => void;
}

export default function KeywordsFilters({
  filters,
  onFiltersChange
}: KeywordsFiltersProps) {
  const t = useTranslations('Monitor.keywords');
  const dispatch = useDispatch<AppDispatch>();
  const { monitorByKeywordsStatus, autoRefreshEnabled } = useSelector((state: RootState) => state.monitor);
  const { loggedInUser: { token: accessToken } } = useSelector((state: RootState) => state.authUser);
  
  const [showSettings, setShowSettings] = useState(true);
  const [keywords, setKeywords] = useState<IKeyword[]>([]);
  const [newKeywordType, setNewKeywordType] = useState<KeywordTypesEnum>(KeywordTypesEnum.WORD);
  const [newKeywordText, setNewKeywordText] = useState('');
  const [newExcludedUser, setNewExcludedUser] = useState('');
  const [excludedUserError, setExcludedUserError] = useState('');
  const [keywordsError, setKeywordsError] = useState('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  const updateFilters = (updates: Partial<IKeywordsFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const updatePlatform = (index: number, updates: Partial<IPlatformFilter>) => {
    const newPlatforms = [...filters.platforms];
    newPlatforms[index] = { ...newPlatforms[index], ...updates };
    updateFilters({ platforms: newPlatforms });
  };

  const addKeyword = () => {
    if (!newKeywordText.trim()) return;

    if(newKeywordText.length < 5)  {
      setKeywordsError(t('errors.isTooSmall'));
      return;
    }

    const isKeywordExist = keywords.some(k => k.text === newKeywordText && k.type === newKeywordType);
    if(isKeywordExist) {
      setKeywordsError(t('errors.isExist'));
      return;
    }
    
    if (newKeywordType === KeywordTypesEnum.HASHTAG && newKeywordText.startsWith('#')) {
      setKeywordsError(t('errors.without#'));
      return;
    }
    if (newKeywordType === KeywordTypesEnum.USER && newKeywordText.startsWith('@')) {
      setKeywordsError(t('errors.without@'));
      return;
    }

    if(newKeywordType === KeywordTypesEnum.HASHTAG || newKeywordType === KeywordTypesEnum.USER) {
      if (newKeywordText.length < 3) {
        setKeywordsError(t('errors.tooShort'));
        return;
      }
      
      if (newKeywordText.length > 200) {
        setKeywordsError(t('errors.tooLong'));
        return;
      }
  
      const regex = /(?<=\s|^)([A-Za-z0-9_\u00C0-\uFFFF]+)/g;
      if(!regex.test(newKeywordText)) {
        setKeywordsError(t('errors.invalidHandle'));
        return;
      }
    }

    const newKeyword: IKeyword = {
      id: Date.now().toString(),
      text: newKeywordText.trim(),
      type: newKeywordType
    };
    
    setKeywords([...keywords, newKeyword]);
    setNewKeywordText('');
  };

  const removeKeyword = (id: string) => {
    setKeywords(keywords.filter(k => k.id !== id));
  };

  const addExcludedUser = () => {
    const username = newExcludedUser.trim();
    
    // Validation
    if (!username) {
      setExcludedUserError(t('excludeUsers.errors.required'));
      return;
    }
    if(username.length < 5)  {
      setKeywordsError(t('errors.isTooSmall'));
      return;
    }
    
    if (username.length < 3) {
      setExcludedUserError(t('excludeUsers.errors.tooShort'));
      return;
    }
    
    if (username.length > 100) {
      setExcludedUserError(t('excludeUsers.errors.tooLong'));
      return;
    }
    
    if (filters.excludeUsers.includes(username)) {
      setExcludedUserError(t('excludeUsers.errors.alreadyExists'));
      return;
    }

    if (username.startsWith('@')) {
      setExcludedUserError(t('excludeUsers.errors.without@'));
      return;
    }

    const regex = /(?<=\s|^)([A-Za-z0-9_\u00C0-\uFFFF]+)/g;
    if(!regex.test(username)) {
      setExcludedUserError(t('excludeUsers.errors.invalidHandle'));
      return;
    }

    // Add user
    const updatedUsers = [...filters.excludeUsers, username];
    updateFilters({ excludeUsers: updatedUsers });
    setNewExcludedUser('');
    setExcludedUserError('');
  };

  const removeExcludedUser = (username: string) => {
    const updatedUsers = filters.excludeUsers.filter(user => user !== username);
    updateFilters({ excludeUsers: updatedUsers });
  };

  const toggleLanguage = (language: MonitorLanguagesEnum) => {
    const currentLanguages = filters.language || [];
    if (currentLanguages.includes(language)) {
      const updatedLanguages = currentLanguages.filter(l => l !== language);
      updateFilters({ language: updatedLanguages });
    } else {
      updateFilters({ language: [...currentLanguages, language] });
    }
  };

  const isLanguageSelected = (language: MonitorLanguagesEnum) => {
    return (filters.language || []).includes(language);
  };

  const handleExcludedUserKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addExcludedUser();
    }
  };

  const handleStartMonitoring = () => {
    if (keywords.length === 0 || !filters.platforms.some(p => p.enabled) || !accessToken) {
      return;
    }

    // Store current state in Redux
    dispatch(setCurrentKeywords(keywords));
    dispatch(setCurrentFilters(filters));

    // Call the server route with token
    dispatch(monitorByKeywords({
      token: accessToken,
      data: {
        keywords,
        filters
      }
    }));
  };

  // Define all available platforms
  const allPlatforms: { name: PlatformsNamesEnum; displayName: string }[] = [
    { name: PlatformsNamesEnum.X, displayName: t('platforms.x') },
    { name: PlatformsNamesEnum.FACEBOOK, displayName: t('platforms.facebook') },
    { name: PlatformsNamesEnum.INSTAGRAM, displayName: t('platforms.instagram') },
    { name: PlatformsNamesEnum.LINKEDIN, displayName: t('platforms.linkedin') },
    { name: PlatformsNamesEnum.YOUTUBE, displayName: t('platforms.youtube') },
    { name: PlatformsNamesEnum.TIKTOK, displayName: t('platforms.tiktok') },
    { name: PlatformsNamesEnum.REDDIT, displayName: t('platforms.reddit') },
    { name: PlatformsNamesEnum.THREADS, displayName: t('platforms.threads') },
    { name: PlatformsNamesEnum.GOOGLE, displayName: t('platforms.google') }
  ];

  const getPlatformSortOptions = (platform: PlatformsNamesEnum): MonitorSortByEnum[] => {
    switch (platform) {
      case PlatformsNamesEnum.X:
      case PlatformsNamesEnum.FACEBOOK:
      case PlatformsNamesEnum.INSTAGRAM:
      case PlatformsNamesEnum.LINKEDIN:
        return [MonitorSortByEnum.LATEST, MonitorSortByEnum.TOP];
      case PlatformsNamesEnum.YOUTUBE:
      case PlatformsNamesEnum.TIKTOK:
        return [MonitorSortByEnum.LATEST, MonitorSortByEnum.TOP];
      case PlatformsNamesEnum.REDDIT:
        return [MonitorSortByEnum.LATEST, MonitorSortByEnum.TOP];
      case PlatformsNamesEnum.THREADS:
        return [MonitorSortByEnum.LATEST, MonitorSortByEnum.TOP];
      case PlatformsNamesEnum.GOOGLE:
        return [MonitorSortByEnum.LATEST, MonitorSortByEnum.TOP];
      default:
        return [MonitorSortByEnum.LATEST, MonitorSortByEnum.TOP];
    }
  };


  // Ensure all platforms exist in filters
  useEffect(() => {
    const existingPlatformNames = filters.platforms.map(p => p.name);
    const missingPlatforms = allPlatforms.filter(p => !existingPlatformNames.includes(p.name));
    
    if (missingPlatforms.length > 0) {
      const newPlatforms = missingPlatforms.map(p => ({
        name: p.name,
        enabled: false,
        sortBy: 'latest' as MonitorSortByEnum
      }));
      updateFilters({ platforms: [...filters.platforms, ...newPlatforms] });
    }
  }, []);

  // Handle click outside language dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isLoading = monitorByKeywordsStatus === 'loading';
  const hasError = monitorByKeywordsStatus === 'failed';

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      {/* Main Title and Description */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-primary mb-1">{t('mainTitle')}</h2>
        <p className="text-sm text-gray-600">{t('mainDescription')}</p>
        {/* <h2 className="text-lg font-semibold text-gray-900 mb-1">{t('mainDescription')}</h2> */}
      </div>

      {/* Header with Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">{t('settingsTitle')}</h3>
        </div>
        <div className="flex items-center gap-3">
          {/* Auto-refresh toggle */}
          {/* <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600 font-medium">Auto-refresh:</label>
              <button
                onClick={() => dispatch(toggleAutoRefresh())}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  !autoRefreshEnabled ? 'bg-gray-300' : 'bg-blue-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    !autoRefreshEnabled ? 'translate-x-1' : 'translate-x-5'
                  }`}
                />
              </button>
              <span className="text-xs text-gray-500">
                {autoRefreshEnabled ? 'On' : 'Off'}
              </span>
          </div> */}
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
          >
            {showSettings ? (
              <>
                <span>{t('hideSettings')}</span>
                <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                <span>{t('showSettings')}</span>
                <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Settings Content - Conditionally Rendered */}
      {showSettings && (
        <div className="space-y-4">
          <div className="w-full flex flex-col lg:flex-row items-center gap-4">
            {/* Keywords Management Section */}
            <div className="w-full p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">{t('keywordsManagement')}</h4>
              <div className="space-y-2">
                {/* Add new keyword */}
                <div className="flex gap-2">
                  <select 
                    value={newKeywordType}
                    onChange={(e) => setNewKeywordType(e.target.value as KeywordTypesEnum)}
                    className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={KeywordTypesEnum.WORD}>{t('keywordType.word')}</option>
                    <option value={KeywordTypesEnum.HASHTAG}>{t('keywordType.hashtag')}</option>
                    <option value={KeywordTypesEnum.USER}>{t('keywordType.user')}</option>
                  </select>
                  <input
                    type="text"
                    value={newKeywordText}
                    onChange={(e) => {
                      setNewKeywordText(e.target.value)
                      setKeywordsError("")
                    }}
                    placeholder={t('keywordPlaceholder')}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button 
                    onClick={addKeyword}
                    disabled={!newKeywordText.trim()}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    {t('addKeyword')}
                  </button>
                </div>

                {/* Error message */}
                {keywordsError && (
                  <p className="text-xs text-red-600">{keywordsError}</p>
                )}
                
                {/* Keywords list */}
                <div className="space-y-1 flex flex-wrap gap-1">
                  {keywords.map((keyword) => (
                    <div key={keyword.id} 
                      className={`w-fit flex items-center gap-4 py-2 px-2 border border-gray-200 rounded-md text-xs bg-white`}>
                      
                      <div className={`flex items-center gap-1 `}>
                        {/* <span className={`p-1 rounded text-[10px] ${
                          keyword.type === KeywordTypesEnum.WORD ? 'bg-blue-100 text-blue-800' :
                          keyword.type === KeywordTypesEnum.HASHTAG ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {keyword.type === KeywordTypesEnum.WORD ? t('keywordType.word') : 
                          keyword.type === KeywordTypesEnum.HASHTAG ? t('keywordType.hashtag') : t('keywordType.user')}
                        </span> */}
                        <span className={`flex-1 ${
                          keyword.type === KeywordTypesEnum.WORD ? 'text-blue-800' :
                          keyword.type === KeywordTypesEnum.HASHTAG ? 'text-green-800' :
                          ' text-purple-800'
                        }`}>{keyword.type === KeywordTypesEnum.USER ? '@' : keyword.type === KeywordTypesEnum.HASHTAG ? '#' : ''} {keyword.text}</span>
                      </div>
                      <button 
                        onClick={() => removeKeyword(keyword.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Exclude Users Section */}
            <div className="w-full p-3 bg-red-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <UserMinus className="w-4 h-4 text-red-600" />
                {t('excludeUsers.title')} 
                {/* <span className='text-xs'>{t('excludeUsers.description')}</span> */}
              </h4>
              <div className="space-y-2">
                {/* Add new excluded user */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExcludedUser}
                    onChange={(e) => {
                      setNewExcludedUser(e.target.value);
                      if (excludedUserError) setExcludedUserError('');
                    }}
                    onKeyPress={handleExcludedUserKeyPress}
                    placeholder={t('excludeUsers.placeholder')}
                    className={`flex-1 px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-red-500 focus:border-transparent ${
                      excludedUserError ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <button 
                    onClick={addExcludedUser}
                    disabled={!newExcludedUser.trim()}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    {t('excludeUsers.add')}
                  </button>
                </div>
                
                {/* Error message */}
                {excludedUserError && (
                  <p className="text-xs text-red-600">{excludedUserError}</p>
                )}
                
                {/* Excluded users list */}
                <div className="flex flex-wrap gap-1">
                  {filters.excludeUsers.map((username, index) => (
                    <div key={index} className="w-fit flex items-center gap-2 px-2 py-1 bg-white border border-red-200 rounded text-xs">
                      <span className="flex-1 text-gray-700">{username}</span>
                      <button 
                        onClick={() => removeExcludedUser(username)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* <p className="text-xs text-gray-500">
                  {t('excludeUsers.description')}
                </p> */}
              </div>
            </div>
          </div>
          
          {/* Platforms and Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column - Platforms */}
            <div className="space-y-3">
              {/* <h4 className="text-sm font-medium text-gray-900">
                {t('platforms.title')}
              </h4> */}
              <div className="grid grid-cols-2 gap-2">
                {allPlatforms.map((platformInfo) => {
                  const platform = filters.platforms.find(p => p.name === platformInfo.name);
                  if (!platform) return null;
                  
                  return (
                    <div key={platformInfo.name} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={platform.enabled}
                        onChange={(e) => updatePlatform(
                          filters.platforms.findIndex(p => p.name === platformInfo.name),
                          { enabled: e.target.checked }
                        )}
                        className="w-3 h-3 text-secondary border-gray-300 rounded focus:ring-secondary"
                      />
                      {getPlatformIcon({ platform: platform.name, className:`${platform.enabled ? 'text-secondary' : 'text-gray-700'} h-5 w-5` })}
                      <span className={`text-xs font-medium ${platform.enabled ? 'text-secondary' : 'text-gray-700'}`}>
                        {platformInfo.displayName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Other Settings */}
            <div className="space-y-3">
              {/* <h4 className="text-sm font-medium text-gray-900">
                {t('additionalSettings')}
              </h4> */}
              
              <div className="grid grid-cols-2 gap-2">
                {/* Language */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t('language')}</label>
                  <div className="relative" ref={languageDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                    >
                      <span className="truncate">
                        {(filters.language || []).length === 0 
                          ? t('allLanguages') 
                          : (filters.language || []).length === 1 
                            ? t(`filters.${(filters.language || [])[0]}`)
                            : `${(filters.language || []).length} ${t('languagesSelected')}`
                        }
                      </span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showLanguageDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        <div className="p-2">
                          <label className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(filters.language || []).length === 0}
                              onChange={() => updateFilters({ language: [] })}
                              className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-xs">{t('allLanguages')}</span>
                          </label>
                          
                          {Object.values(MonitorLanguagesEnum).map((lang) => (
                            <label key={lang} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isLanguageSelected(lang)}
                                onChange={() => toggleLanguage(lang)}
                                className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="ml-2 text-xs">{t(`filters.${lang}`)}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t('dateRange')}</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => updateFilters({ dateRange: e.target.value as MonitorDateFiltersEnum })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={MonitorDateFiltersEnum.ALL_TIME}>{t('filters.all_time')}</option>
                    <option value={MonitorDateFiltersEnum.LAST_DAY}>{t('filters.last_day')}</option>
                    <option value={MonitorDateFiltersEnum.LAST_WEEK}>{t('filters.last_week')}</option>
                    <option value={MonitorDateFiltersEnum.LAST_MONTH}>{t('filters.last_month')}</option>
                    <option value={MonitorDateFiltersEnum.LAST_YEAR}>{t('filters.last_year')}</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.hasMedia}
                    onChange={(e) => updateFilters({ hasMedia: e.target.checked })}
                    className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="mr-2 text-xs font-medium text-gray-700">{t('hasMedia')}</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={(e) => updateFilters({ verifiedOnly: e.target.checked })}
                    className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="mr-2 text-xs font-medium text-gray-700">{t('verifiedOnly')}</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Error Display */}
          {hasError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{t('error.fetchFailed')}</p>
            </div>
          )}
          
          {/* Start Monitoring Button */}
          <div className="text-center pt-2">
            <button
              onClick={handleStartMonitoring}
              disabled={isLoading || keywords.length === 0 || !filters.platforms.some(p => p.enabled) || !accessToken}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium flex items-center gap-2 mx-auto"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('monitoring')}
                </>
              ) : (
                <>
                  <span>🚀</span>
                  {t('startMonitoring')}
                </>
              )}
            </button>
            {keywords.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">{t('addKeywordFirst')}</p>
            )}
            {keywords.length > 0 && !filters.platforms.some(p => p.enabled) && (
              <p className="text-xs text-gray-500 mt-1">{t('selectPlatformFirst')}</p>
            )}
            {!accessToken && (
              <p className="text-xs text-gray-500 mt-1">{t('filters.loginRequired')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
  }

  