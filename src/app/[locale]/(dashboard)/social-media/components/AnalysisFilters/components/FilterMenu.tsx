import React, { useEffect, useRef } from 'react';
import { X, Filter, ChevronDown } from 'lucide-react';
import { AnalysisClassifyEnum, ContentTypesEnum, TweetTypesEnum } from "@/interfaces/analysis.types";
import { useAppDispatch } from "@/lib/hooks";
import { fetchAllAnalysis } from "@/lib/features/socialMedia/analysisThunks";
import { FilterMenuProps } from '../types';

const FilterMenu: React.FC<FilterMenuProps> = ({
    filters,
    setFilters,
    allAnalysis,
    t
}) => {
    const dispatch = useAppDispatch();
    const [selectedFilterType, setSelectedFilterType] = React.useState<keyof typeof filters | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [showFilterMenu, setShowFilterMenu] = React.useState(false);
    const [dateRange, setDateRange] = React.useState({
        from: (filters?.dateRange?.start || new Date()).toISOString().slice(0, 16),
        to: (filters?.dateRange?.end || new Date()).toISOString().slice(0, 16)
    });

    const menueRef = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menueRef.current && !menueRef.current.contains(event.target as Node)) {
                setShowFilterMenu(false);
            }
        };

        if (showFilterMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFilterMenu]);

    // Initialize with today's date range (12 AM to 12 PM) - Only set filters, don't fetch data
    React.useEffect(() => {
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        setDateRange({
            from: (filters?.dateRange?.start || new Date()).toISOString().slice(0, 16),
            to: (filters?.dateRange?.end || new Date()).toISOString().slice(0, 16)
        });

        // Only set initial filters if they don't exist
        if (!filters.noDate && !filters.dateRange) {
            const newFilters = {
                ...filters,
                dateRange: {
                    start: startOfDay,
                    end: endOfDay
                }
            };
            setFilters(newFilters);
        }
    }, []); // Only run once on mount

    // Get unique values for each filter type
    const getFilterOptions = (type: keyof typeof filters): string[] => {
        switch (type) {
            case 'sector':
                return Array.from(new Set(allAnalysis.map(a => a.sectorData.name)));
            case 'subAnalysis':
                return Array.from(new Set(allAnalysis.map(a => a.subAnalysisData.body)));
            case 'classify':
                return Object.values(AnalysisClassifyEnum);
            case 'contentType':
                return Object.values(ContentTypesEnum);
            case 'tweetType':
                return Object.values(TweetTypesEnum);
            case 'addedBy':
                return Array.from(new Set(allAnalysis.map(a => a.addedByData?.name).filter(Boolean)));
            case 'publisher':
                return Array.from(new Set(allAnalysis.map(a => a.publisher.name).filter(Boolean)));
            case 'platform':
                return Array.from(new Set(allAnalysis.map(a => a.platform).filter(Boolean)));
            case 'url':
                return Array.from(new Set(allAnalysis.map(a => a.url).filter(Boolean)));
            default:
                return [];
        }
    };

    // Filter options based on search query
    const filteredOptions = selectedFilterType 
        ? getFilterOptions(selectedFilterType).filter(option => 
            option.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const handleFilterSelect = (value: string) => {
        if (!selectedFilterType) return;

        const newFilters = { ...filters };
        
        // Initialize array if it doesn't exist
        if (!newFilters[selectedFilterType]) {
            newFilters[selectedFilterType] = [] as any;
        }

        // For sector and subAnalysis, we want to find all items that contain the search value
        if (selectedFilterType === 'sector' || selectedFilterType === 'subAnalysis') {
            const matchingValues = getFilterOptions(selectedFilterType).filter(option => 
                option.toLowerCase().includes(value.toLowerCase())
            );
            
            // Add all matching values to the filter array
            const currentValues = newFilters[selectedFilterType] as string[];
            matchingValues.forEach(match => {
                if (!currentValues.includes(match)) {
                    currentValues.push(match);
                }
            });
            newFilters[selectedFilterType] = currentValues as any;
        } else if (selectedFilterType === 'publisher') {
            // For publisher, search in name or handle
            const matchingPublishers = allAnalysis
                .filter(analysis => {
                    const name = analysis.publisher.name.toLowerCase();
                    const handle = analysis.publisher.handle?.toLowerCase() || '';
                    const searchValue = value.toLowerCase();
                    return name.includes(searchValue) || handle.includes(searchValue);
                })
                .map(analysis => analysis.publisher.name);
            
            const uniqueMatchingPublishers = Array.from(new Set(matchingPublishers));
            const currentValues = newFilters[selectedFilterType] as string[];
            uniqueMatchingPublishers.forEach(publisher => {
                if (!currentValues.includes(publisher)) {
                    currentValues.push(publisher);
                }
            });
            newFilters[selectedFilterType] = currentValues as any;
        } else if (selectedFilterType === 'tweetType' || selectedFilterType === 'classify' || selectedFilterType === 'contentType' || selectedFilterType === 'platform') {
            // For tweetType, add the exact value if it exists in options
            const matchingValues = getFilterOptions(selectedFilterType).filter(option => {
                return !!(t(option)?.toLowerCase()?.includes(value?.toLowerCase())) ||
                !!(option.toLowerCase().includes(value.toLowerCase()))
            });
            
            if (matchingValues.length > 0) {
                for(const m of matchingValues) {    
                    const currentValues = (newFilters[selectedFilterType] as string[]) || [];
                    if(m && !currentValues.includes(m)) {
                        (newFilters[selectedFilterType] as string[]) = [...currentValues, m];
                    }
                }

                console.log(newFilters[selectedFilterType]);
            }
        } else {
            // For other filter types, add the value if it doesn't exist
            const currentValues = newFilters[selectedFilterType] as string[];
            if (!currentValues.includes(value)) {
                newFilters[selectedFilterType] = [...currentValues, value] as any;
            }
        }

        setFilters(newFilters);
        setSearchQuery('');
        setShowFilterMenu(false);
    };


    const handleDateFilterSubmit = () => {
        const startDate = new Date(dateRange.from);
        const endDate = new Date(dateRange.to);

        // Validate date range
        if (startDate > endDate) {
            alert(t("invalidDateRange"));
            return;
        }

        const newFilters = {
            ...filters,
            dateRange: {
                start: startDate,
                end: endDate
            }
        };
        setFilters(newFilters);
        setShowFilterMenu(false);

        // Only fetch data if date range actually changed
        const currentStart = filters.dateRange?.start;
        const currentEnd = filters.dateRange?.end;
        
        if (!currentStart || !currentEnd || 
            currentStart.getTime() !== startDate.getTime() || 
            currentEnd.getTime() !== endDate.getTime()) {
            dispatch(fetchAllAnalysis({
                startDate,
                endDate
            }));
        }
    };

    const clearDateFilter = () => {
        // Reset to today's date (12 AM to 12 PM)
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        setDateRange({
            from: startOfDay.toISOString().slice(0, 16),
            to: endOfDay.toISOString().slice(0, 16)
        });

        const newFilters = {
            ...filters,
            dateRange: {
                start: startOfDay,
                end: endOfDay
            }
        };
        setFilters(newFilters);

        // Only fetch data if date range actually changed
        const currentStart = filters.dateRange?.start;
        const currentEnd = filters.dateRange?.end;
        
        if (!currentStart || !currentEnd || 
            currentStart.getTime() !== startOfDay.getTime() || 
            currentEnd.getTime() !== endOfDay.getTime()) {
            dispatch(fetchAllAnalysis({
                startDate: startOfDay,
                endDate: endOfDay
            }));
        }
    };

    // Calculate active filters count
    const activeFiltersCount = Object.entries(filters).reduce((count, [key, value]) => {
        if (Array.isArray(value)) {
            return count + value.length;
        }
        if (key === 'dateRange' && value?.start && value?.end) {
            return count + 1;
        }
        if (key === 'statistics') {
            return count + Object.values(value || {}).filter(stat => 
                (stat as { min?: number; max?: number })?.min || 
                (stat as { min?: number; max?: number })?.max
            ).length;
        }
        return count;
    }, 0);

    return (
        <div className="relative" ref={menueRef}>
            <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs border border-gray-200"
            >
                <Filter className="w-3 h-3 text-gray-600" />
                <span className="font-sm text-gray-700">
                    {t("selectFilterType")}
                </span>
                {activeFiltersCount > 0 && (
                    <span className="bg-adminPrimary text-white px-2 py-0.5 rounded-full text-xs font-medium">
                        {activeFiltersCount}
                    </span>
                )}
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
            </button>

            {showFilterMenu && (
                <div className="absolute top-full start-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-10 w-72">
                    <div className="p-4 space-y-4">
                        {/* Filter Type Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t("selectFilterType")}
                            </label>
                            <select
                                value={selectedFilterType || ''}
                                onChange={(e) => {
                                    setSelectedFilterType(e.target.value as keyof typeof filters);
                                    setSearchQuery('');
                                }}
                                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none bg-gray-50"
                            >
                                <option value="">{t("selectFilterType")}</option>
                                <option value="dateRange">{t("timeRange")}</option>
                                <option value="sector">{t("sector")}</option>
                                <option value="subAnalysis">{t("subAnalysis")}</option>
                                <option value="classify">{t("classify")}</option>
                                <option value="contentType">{t("contentType")}</option>
                                <option value="tweetType">{t("tweetType")}</option>
                                <option value="publisher">{t("publisher")}</option>
                                <option value="addedBy">{t("addedBy")}</option>
                                <option value="platform">{t("platform")}</option>
                                <option value="url">{t("url")}</option>
                            </select>
                        </div>

                        {/* Date Range Filter */}
                        {selectedFilterType === 'dateRange' ? (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("from")} *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={dateRange.from}
                                        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none bg-gray-50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("to")} *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={dateRange.to}
                                        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none bg-gray-50"
                                        required
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDateFilterSubmit}
                                        disabled={!dateRange.from || !dateRange.to}
                                        className="flex-1 px-4 py-2 bg-adminPrimary text-white rounded-lg hover:bg-adminPrimary/90 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {t("apply")}
                                    </button>
                                    <button
                                        onClick={clearDateFilter}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                    >
                                        {t("clear")}
                                    </button>
                                </div>
                            </div>
                        ) : selectedFilterType ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t("searchFilter")}
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder={t("searchFilter")}
                                            className="w-full rounded-lg border border-gray-300 p-2 pl-3 pr-10 text-sm focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none bg-gray-50"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (searchQuery && selectedFilterType) {
                                                handleFilterSelect(searchQuery);
                                            }
                                        }}
                                        disabled={!searchQuery}
                                        className="px-4 py-2 bg-adminPrimary text-white rounded-lg hover:bg-adminPrimary/90 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {t("apply")}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 text-center py-3 bg-gray-50 rounded-lg">
                                {t("selectFilterTypeToStart")}
                            </div>
                        )}

                        {/* Filter Options */}
                        {selectedFilterType && selectedFilterType !== 'dateRange' && filteredOptions.length > 0 && (
                            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50">
                                {filteredOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleFilterSelect(option)}
                                        className="w-full px-4 py-2.5 text-sm hover:bg-white border-b border-gray-200 last:border-b-0 transition-colors"
                                    >
                                        { selectedFilterType === 'contentType' 
                                            || selectedFilterType === 'classify' 
                                            || selectedFilterType === 'tweetType' 
                                            || selectedFilterType === 'platform' 
                                            ? t(option) : option
                                        }
                                    </button>
                                ))}
                            </div>
                        )}

                        {selectedFilterType && selectedFilterType !== 'dateRange' && filteredOptions.length === 0 && searchQuery && (
                            <div className="text-sm text-gray-500 text-center py-3 bg-gray-50 rounded-lg">
                                {t("noResultsFound")}
                            </div>
                        )}

                        {selectedFilterType && selectedFilterType !== 'dateRange' && !searchQuery && (
                            <div className="text-sm text-gray-500 text-center py-3 bg-gray-50 rounded-lg">
                                {t("enterSearchTerm")}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterMenu; 