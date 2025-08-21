'use client';

import React from 'react';

import { 
  Filter, 
  Grid3X3, 
  List, 
  ChevronDown, 
  ChevronUp,
  Globe,
  MessageSquare,
  Heart,
  User,
  Calendar,
  MapPin,
  Table,
  X,
  Plus,
  CheckSquare,
  Layers
} from 'lucide-react';

import { 
  PlatformsNamesEnum, 
  MonitorSentimentsEnum, 
  MonitorLanguagesEnum, 
  GenderTypesEnum 
} from './types';
import { useTranslations } from 'next-intl';

interface FilterState {
  platforms: PlatformsNamesEnum[];
  languages: MonitorLanguagesEnum[];
  sentiments: MonitorSentimentsEnum[];
  genders: GenderTypesEnum[];
  ageRanges: string[];
  hasLocation: boolean;
  hasMedia: boolean;
  verifiedOnly: boolean;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

interface GroupByOption {
  value: string;
  icon: React.ComponentType<any>;
}

interface ResultsFiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  groupBy: string[];
  setGroupBy: (groupBy: string[]) => void;
  viewMode: 'grid' | 'list' | 'table';
  setViewMode: (mode: 'grid' | 'list' | 'table') => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  showGrouping: boolean;
  setShowGrouping: (show: boolean) => void;
  selectionMode: boolean;
  setSelectionMode: (mode: boolean) => void;
  gridColumns: number;
  setGridColumns: (columns: number) => void;
  listDensity: 'compact' | 'comfortable';
  setListDensity: (density: 'compact' | 'comfortable') => void;
  totalResults: number;
  filteredResults: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  locale: string;
}

export default function ResultsFiltersV2({
  filters,
  setFilters,
  groupBy,
  setGroupBy,
  viewMode,
  setViewMode,
  showFilters,
  setShowFilters,
  showGrouping,
  setShowGrouping,
  selectionMode,
  setSelectionMode,
  gridColumns,
  setGridColumns,
  listDensity,
  setListDensity,
  totalResults,
  filteredResults,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  locale
}: ResultsFiltersProps) {

  const groupByOptions: GroupByOption[] = [
    { value: 'platform', icon: Globe },
    { value: 'language', icon: MessageSquare },
    { value: 'sentiment', icon: Heart },
    { value: 'gender', icon: User },
    { value: 'age', icon: Calendar },
    { value: 'location', icon: MapPin },
    { value: 'author', icon: User }
  ];

  const viewModeOptions = [
    { value: 'grid', label: 'Grid', labelAr: 'شبكة', icon: Grid3X3 },
    { value: 'list', label: 'List', labelAr: 'قائمة', icon: List },
    { value: 'table', label: 'Table', labelAr: 'جدول', icon: Table }
  ];

  const itemsPerPageOptions = [10, 20, 50, 100];

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof FilterState, value: any) => {
    const currentArray = filters[key] as any[];
    if (currentArray.includes(value)) {
      updateFilter(key, currentArray.filter(item => item !== value));
    } else {
      updateFilter(key, [...currentArray, value]);
    }
  };

  const toggleGroupBy = (value: string) => {
    if (groupBy.includes(value)) {
      setGroupBy(groupBy.filter(item => item !== value));
    } else {
      setGroupBy([...groupBy, value]);
    }
  };

  const removeGroupBy = (value: string) => {
    setGroupBy(groupBy.filter(item => item !== value));
  };

  const t = useTranslations("Monitor.keywords.results");

  const totalPages = Math.ceil(filteredResults / itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left Side - Filter and Grouping Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowFilters(!showFilters);
                if (showFilters) setShowGrouping(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              {t('filters')}
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                setShowGrouping(!showGrouping);
                if (showGrouping) setShowFilters(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showGrouping 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              {t('grouping')}
              {showGrouping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setSelectionMode(!selectionMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectionMode 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              {t('selection')}
            </button>
          </div>
        </div>

        {/* Active Grouping Tags */}
        {groupBy.length > 0 && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">
              {t('groupedBy')}:
            </span>
            {groupBy.map(value => {
              const option = groupByOptions.find(opt => opt.value === value);
              return (
                <div
                  key={value}
                  className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm"
                >
                  <span>{t(option?.value)}</span>
                  <button
                    onClick={() => removeGroupBy(value)}
                    className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="w-5 h-5" />
              {t('filters')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Platform Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-primary">
                {t('platform')}
              </label>
              <div className="space-y-1">
                {Object.values(PlatformsNamesEnum).map(platform => (
                  <label key={platform} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.platforms.includes(platform)}
                      onChange={() => toggleArrayFilter('platforms', platform)}
                      className="mr-2"
                    />
                    <span className="text-sm">{t(platform)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-primary">
                {t('language')}
              </label>
              <div className="space-y-1">
                {Object.values(MonitorLanguagesEnum).map(lang => (
                  <label key={lang} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.languages.includes(lang)}
                      onChange={() => toggleArrayFilter('languages', lang)}
                      className="mr-2"
                    />
                    <span className="text-sm">{t(lang)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sentiment Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-primary">
                {t('sentiment')}
              </label>
              <div className="space-y-1">
                {Object.values(MonitorSentimentsEnum).map(sentiment => (
                  <label key={sentiment} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.sentiments.includes(sentiment)}
                      onChange={() => toggleArrayFilter('sentiments', sentiment)}
                      className="mr-2"
                    />
                    <span className="text-sm">{t(sentiment)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-primary">
                {t('gender')}
              </label>
              <div className="space-y-1">
                {Object.values(GenderTypesEnum).map(gender => (
                  <label key={gender} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.genders.includes(gender)}
                      onChange={() => toggleArrayFilter('genders', gender)}
                      className="mr-2"
                    />
                    <span className="text-sm">{t(gender)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Age Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-primary">
                {t('ageRange')}
              </label>
              <div className="space-y-1">
                {['13-17', '18-24', '25-34', '35-44', '45+'].map(age => (
                  <label key={age} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.ageRanges.includes(age)}
                      onChange={() => toggleArrayFilter('ageRanges', age)}
                      className="mr-2"
                    />
                    <span className="text-sm">{age}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Other Filters */}
            <div>
              <label className="block text-sm font-medium mb-2 text-primary">
                {t('otherFilters')}
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.hasLocation}
                    onChange={(e) => updateFilter('hasLocation', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">{t('hasLocation')}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.hasMedia}
                    onChange={(e) => updateFilter('hasMedia', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">{t('hasMedia')}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={(e) => updateFilter('verifiedOnly', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">{t('verifiedOnly')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grouping Panel */}
      {showGrouping && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Layers className="w-5 h-5" />
              {t('groupingOptions')}
            </h3>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
          <div className="flex flex-wrap items-center gap-4">
            {groupByOptions.map(option => {
              const Icon = option.icon;
              const isSelected = groupBy.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => toggleGroupBy(option.value)}
                  className={`w-fit flex items-center gap-2 p-2 rounded-lg border-2 transition-colors ${
                    isSelected
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {t(option.value)}
                  </span>
                  {isSelected && <Plus className="w-4 h-4 rotate-45" />}
                </button>
              );
            })}
          </div>

          {/* {groupBy.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2 text-primary">
                {t('groupingOrder')}:
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                {groupBy.map((value, index) => {
                  const option = groupByOptions.find(opt => opt.value === value);
                  return (
                    <div
                      key={value}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                    >
                      <span className="font-medium">{index + 1}.</span>
                      <span>{t(option?.value)}</span>
                      <button
                        onClick={() => removeGroupBy(value)}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
              
              
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => {
                    // This will be handled by the parent component
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('expandAllGroups'));
                    }
                  }}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  {t('expandAll')}
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('collapseAllGroups'));
                    }
                  }}
                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  {t('collapseAll')}
                </button>
              </div>
            </div>
          )} */}
        </div>
      )}

      {/* View Setting */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Left - View Mode */}
        <div className="flex items-center gap-2">
          {/* <span className="text-sm text-gray-600">
            {t('view'}:
          </span> */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {viewModeOptions.map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setViewMode(option.value as 'grid' | 'list' | 'table')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
                    viewMode === option.value 
                      ? 'bg-white text-secondary shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{t(option.value)}</span>
                </button>
              );
            })}
          </div>

          {/* Grid Columns Control */}
          {viewMode === 'grid' && (
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-gray-600">
                {t('columns')}:
              </span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[2, 3, 4, 5].map(cols => (
                  <button
                    key={cols}
                    onClick={() => setGridColumns(cols)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      gridColumns === cols 
                        ? 'bg-white text-secondary shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {cols}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* List Density Control */}
          {viewMode === 'list' && (
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-gray-600">
                {t('density')}:
              </span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { value: 'compact' },
                  { value: 'comfortable' }
                ].map(density => (
                  <button
                    key={density.value}
                    onClick={() => setListDensity(density.value as 'compact' | 'comfortable')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      listDensity === density.value 
                        ? 'bg-white text-secondary shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {t(density.value)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Results Count and Pagination */}
        <div className="flex items-center gap-4">
          {/* <div className="text-sm text-gray-600">
            {t('showing', 'عرض', 'Showing')} {filteredResults} {t('of', 'من', 'of')} {totalResults} {t('results', 'نتيجة', 'results')}
          </div> */}

          {/* Items per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {t('perPage')}:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-sm border border-gray-300 rounded-md px-2"
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              {t('previous')}
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      currentPage === pageNum
                        ? 'bg-secondary text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              {t('next')}
            </button>
          </div>
        )}
      </div>

    </div>
  );
} 