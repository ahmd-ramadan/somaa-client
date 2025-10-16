'use client';

import React, { useState, useRef, useEffect } from 'react';

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
  Layers,
  AudioLines
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
  // showFilters: boolean;
  // setShowFilters: (show: boolean) => void;
  // showGrouping: boolean;
  // setShowGrouping: (show: boolean) => void;
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
  // showFilters,
  // setShowFilters,
  // showGrouping,
  // setShowGrouping,
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

  // Add new state for dropdowns
  const [activeFilterType, setActiveFilterType] = useState<string | null>(null);
  const [showGroupingDropdown, setShowGroupingDropdown] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Array<{key: string, value: any, label: string}>>([]);

  // Refs for click outside detection
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const groupingDropdownRef = useRef<HTMLDivElement>(null);
  const filtersDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setActiveFilterType(null);
      }
      if (groupingDropdownRef.current && !groupingDropdownRef.current.contains(event.target as Node)) {
        setShowGroupingDropdown(false);
      }
      if (filtersDropdownRef.current && !filtersDropdownRef.current.contains(event.target as Node)) {
        setShowFiltersDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  useEffect(() => {
    const newactiveFilters: Array<{key: string, value: any, label: string}> = [];
          
    // Check platforms
    if (filters.platforms.length > 0) {
      filters.platforms.forEach(platform => {
        newactiveFilters.push({ key: 'platforms', value: platform, label: t('platform') });
      });
    }
    
    // Check languages
    if (filters.languages.length > 0) {
      filters.languages.forEach(lang => {
        newactiveFilters.push({ key: 'languages', value: lang, label: t('language') });
      });
    }
    
    // Check sentiments
    if (filters.sentiments.length > 0) {
      filters.sentiments.forEach(sentiment => {
        newactiveFilters.push({ key: 'sentiments', value: sentiment, label: t('sentiment') });
      });
    }
    
    // Check genders
    if (filters.genders.length > 0) {
      filters.genders.forEach(gender => {
        newactiveFilters.push({ key: 'genders', value: gender, label: t('gender') });
      });
    }
    
    // Check age ranges
    if (filters.ageRanges.length > 0) {
      filters.ageRanges.forEach(age => {
        newactiveFilters.push({ key: 'ageRanges', value: age, label: t('ageRange') });
      });
    }
    
    // Check other filters
    if (filters.hasLocation) {
      newactiveFilters.push({ key: 'hasLocation', value: true, label: t('hasLocation') });
    }
    if (filters.hasMedia) {
      newactiveFilters.push({ key: 'hasMedia', value: true, label: t('hasMedia') });
    }
    if (filters.verifiedOnly) {
      newactiveFilters.push({ key: 'verifiedOnly', value: true, label: t('verifiedOnly') });
    }

    setActiveFilters(newactiveFilters);

  }, [filters])
  
  const groupByOptions: GroupByOption[] = [
    { value: 'platform', icon: Globe },
    { value: 'language', icon: MessageSquare },
    { value: 'sentiment', icon: AudioLines },
    { value: 'gender', icon: User },
    { value: 'age', icon: Calendar },
    { value: 'location', icon: MapPin },
    { value: 'author', icon: User }
  ];

  const viewModeOptions = [
    { value: 'list', label: 'List', labelAr: 'قائمة', icon: List },
    { value: 'table', label: 'Table', labelAr: 'جدول', icon: Table },
    { value: 'grid', label: 'Grid', labelAr: 'شبكة', icon: Grid3X3 }
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

  // Define filter types for the new UI
  const filterTypes = [
    { key: 'platforms', label: t('platform'), icon: Globe, options: Object.values(PlatformsNamesEnum) },
    { key: 'languages', label: t('language'), icon: MessageSquare, options: Object.values(MonitorLanguagesEnum) },
    { key: 'sentiments', label: t('sentiment'), icon: Heart, options: Object.values(MonitorSentimentsEnum) },
    { key: 'genders', label: t('gender'), icon: User, options: Object.values(GenderTypesEnum) },
    { key: 'ageRanges', label: t('ageRange'), icon: Calendar, options: ['13 - 17', '18 - 24', '25 - 34', '35 - 44', '45+'] },
    { key: 'other', label: t('otherFilters'), icon: Filter, options: ['hasLocation', 'hasMedia', 'verifiedOnly'] }
  ];

  const totalPages = Math.ceil(filteredResults / itemsPerPage);

  // Render filter options based on filter type
  const renderFilterOptions = (filterTypeParam: any) => {
    const filterType = filterTypes.find(f => f.key === filterTypeParam);

    if(filterType === undefined) return null;


    if (filterType.key === 'other') {
      return (
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
      );
    }

    return (
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {filterType.options.map((option: any) => (
          <label key={option} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(filters[filterType.key as keyof FilterState] as any[])?.includes(option)}
              onChange={() => toggleArrayFilter(filterType.key as keyof FilterState, option)}
              className="mr-2"
            />
            <span className="text-sm">{ filterTypeParam === 'ageRanges' ? option : t(option)}</span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left Side - Filter and Grouping Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Filters Btn */}
            <div className='w-48 relative'>
              <button
                onClick={() => setShowFiltersDropdown(!showFiltersDropdown) }
                className={`w-full flex items-center justify-between gap-2 px-2 py-2 rounded-lg transition-colors ${
                  activeFilters.length > 0 
                    ? 'bg-gray-200 text-secondary' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className='flex items-center gap-1'>
                  <Filter className="w-4 h-4" />
                  {t('filters')}
                </div>
                <div className='flex gap-1 items-center'>
                  {showFiltersDropdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  { activeFilters.length > 0 && <span className='flex p-1 rounded-full items-center justify-center bg-white text-xs text-secondary'>{activeFilters.length}</span>}
                </div>
              </button>
                
              {showFiltersDropdown && (
                    <div 
                      ref={filtersDropdownRef} 
                      className="w-full absolute top-full start-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-10"
                    >
                        <div className="p-4 space-y-4">
                            {/* Filter Type Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t("fiterByType")}
                                </label>
                                <select
                                    value={activeFilterType || ''}
                                    onChange={(e) => {
                                      setActiveFilterType(e.target.value);
                                    }}
                                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none bg-gray-50"
                                >
                                    <option value="">{t("selectFilterTy")}</option>
                                    {filterTypes.map((f) => ( <option value={f.key} key={f.key}>{f.label}</option>) )}
                                </select>
                            </div>

                            {/* Date Range Filter */}
                            { activeFilterType ? 
                              renderFilterOptions(activeFilterType)
                            : (
                                <div className="text-sm text-gray-500 text-center py-3 bg-gray-50 rounded-lg">
                                    {t("selectFilterTypeToStart")}
                                </div>
                            )}
                        </div>
                    </div>
              )}
            </div>

            {/* Grouping Btn */}
            <div className='relative w-48'>
              <button
                onClick={() => {
                  setShowGroupingDropdown(!showGroupingDropdown);
                }}
                className={`w-full flex items-center justify-between gap-2 px-2 py-2 rounded-lg transition-colors ${
                  groupBy.length > 0 
                    ? 'bg-gray-200 text-secondary' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className='flex items-center gap-1'>
                  <Layers className="w-4 h-4" />
                  {t('grouping')}
                </div>
                
                <div className='flex items-center gap-1'>
                  {showGroupingDropdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  { groupBy.length > 0 && <span className='flex p-1 rounded-full items-center justify-center bg-white text-xs text-secondary'>{groupBy.length}</span>}
                </div>
              </button>

              {showGroupingDropdown && (
                <div 
                  ref={groupingDropdownRef} 
                  className="w-full absolute top-full start-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                >
                  <div className="">
                    {groupByOptions.map(option => {
                      const Icon = option.icon;
                      const isSelected = groupBy.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          onClick={() => toggleGroupBy(option.value)}
                          className={`w-full flex items-center justify-between gap-3 p-2 rounded-md transition-colors ${
                            isSelected
                              ? 'text-secondary'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className='flex items-center gap-1'>
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">{t(option.value)}</span>
                          </div>
                          {isSelected && <CheckSquare className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          
            {/* <div className='relative'>
              <button
                onClick={() => setSelectionMode(!selectionMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  selectionMode 
                    ? 'bg-gray-200 text-secondary' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                {t('selection')}
              </button>
            </div> */}
            
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
                  className="flex items-center justify-between gap-x-3 p-1 bg-gray-100 text-primary rounded-md text-sm"
                >
                  <span>{t(option?.value)}</span>
                  <button
                    onClick={() => removeGroupBy(value)}
                    className="hover:bg-red-200 hover:text-red-500 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3 " />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Active filters */}
        {(() => {
          
          if (activeFilters.length === 0) return null;
          
          return (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">
                {t('filteredBy')}:
              </span>
              {activeFilters.map((filter, index) => (
                <div
                  key={`${filter.key}-${filter.value}-${index}`}
                  className="flex items-center gap-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                >
                  <span className="text-xs text-blue-600 font-medium">{filter.label}:</span>
                  <span>{filter.key === 'ageRanges' ? filter.value : t(filter.value)}</span>
                  <button
                    onClick={() => {
                      if (filter.key === 'hasLocation' || filter.key === 'hasMedia' || filter.key === 'verifiedOnly') {
                        updateFilter(filter.key, false);
                      } else {
                        toggleArrayFilter(filter.key as keyof FilterState, filter.value);
                      }
                    }}
                    className="hover:bg-blue-200 hover:text-blue-900 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

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
                  onClick={() => setViewMode(option.value as 'list' | 'table' | 'grid')}
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
          {/* {viewMode === 'list' && (
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
          )} */}
        </div>

        {/* Right Side - Results Count and Pagination */}
        <div className="flex items-center gap-4">
          {/* <div className="text-sm text-gray-600">
            {t('showing', 'عرض', 'Showing')} {filteredResults} {t('of', 'من', 'of')} {totalResults} {t('نتيجة', 'results')}
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