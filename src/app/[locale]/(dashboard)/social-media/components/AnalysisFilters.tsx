import { AnalysisClassifyEnum, IAnalysis, ContentTypesEnum, TweetTypesEnum } from "@/interfaces/analysis.types";
import { useTranslations } from "next-intl";
import { X, Filter, ChevronDown, Layers } from 'lucide-react';
import { useState, useEffect, useRef } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { fetchAllAnalysis } from "@/lib/features/socialMedia/analysisThunks";
import { FilterState } from "@/hooks/useAnalysisFilters";

type StatisticType = 'reactions' | 'comments' | 'shares' | 'views' | 'appearance';

type GroupingState = {
    [key: string]: { active: boolean; order?: number }
};

interface AnalysisFiltersProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    groupings: GroupingState;
    setGroupings: React.Dispatch<React.SetStateAction<GroupingState>>;
    allAnalysis: IAnalysis[];
    onAnalysisSelect?: (analysis: IAnalysis) => void;
    onAnalysisDelete?: (analysis: IAnalysis) => void;
}

interface DateRange {
    from: string;
    to: string;
}

const AnalysisFilters = ({ 
    filters, 
    setFilters, 
    showFilters, 
    setShowFilters, 
    groupings = {},
    setGroupings,
    allAnalysis,
    onAnalysisSelect,
    onAnalysisDelete
}: AnalysisFiltersProps) => {
    const t = useTranslations("SocialMediaPage.AllAnalysisTable");
    const dispatch = useAppDispatch();
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date().toISOString().slice(0, 16),
        to: new Date().toISOString().slice(0, 16)
    });
    const [selectedFilterType, setSelectedFilterType] = useState<keyof FilterState | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showGroupingMenu, setShowGroupingMenu] = useState(false);
    const [showFilterTypeMenu, setShowFilterTypeMenu] = useState(false);
    const [filterTypeSearch, setFilterTypeSearch] = useState('');

    // Refs for menu containers
    const filterMenuRef = useRef<HTMLDivElement>(null);
    const groupingMenuRef = useRef<HTMLDivElement>(null);
    const filterTypeMenuRef = useRef<HTMLDivElement>(null);

    // Handle click outside for filter menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
                setShowFilterMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle click outside for grouping menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (groupingMenuRef.current && !groupingMenuRef.current.contains(event.target as Node)) {
                setShowGroupingMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle click outside for filter type menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterTypeMenuRef.current && !filterTypeMenuRef.current.contains(event.target as Node)) {
                setShowFilterTypeMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Initialize with today's date range
    useEffect(() => {
        const today = new Date();
        const start = new Date(today);
        start.setHours(0, 0, 0, 0);
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);

        setFilters({
            ...filters,
            dateRange: {
                start,
                end
            }
        });

        dispatch(fetchAllAnalysis({
            startDate: start,
            endDate: end
        }));
    }, [dispatch]);

    // Get unique values for each filter type
    const getFilterOptions = (type: keyof FilterState): string[] => {
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
        } else if (selectedFilterType === 'tweetType') {
            // For tweetType, add the exact value if it doesn't exist
            const currentValues = newFilters[selectedFilterType] as string[];
            if (!currentValues.includes(value)) {
                newFilters[selectedFilterType] = [...currentValues, value] as any;
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

    const removeFilter = (type: keyof FilterState, value: string) => {
        const newFilters = { ...filters };
        const currentValues = newFilters[type] as string[];
        if (currentValues) {
            newFilters[type] = currentValues.filter((v: string) => v !== value) as any;
            setFilters(newFilters);
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

    const handleStatisticSelect = (statistic: StatisticType) => {
        if (statistic === filters.selectedStatistic) {
            // If the same statistic is selected again, remove it
            setFilters({
                ...filters,
                selectedStatistic: undefined,
                statistics: {
                    ...filters.statistics,
                    [statistic]: undefined
                }
            });
        } else {
            // If a new statistic is selected, set it as selected
            setFilters({
                ...filters,
                selectedStatistic: statistic
            });
        }
    };

    const toggleGrouping = (key: keyof GroupingState) => {
        setGroupings(prev => {
            const isActive = prev[key]?.active;
            if (isActive) {
                return {
                    ...prev,
                    [key]: { active: false }
                };
            } else {
                const maxOrder = Math.max(0, ...Object.values(prev).map(g => g.order || 0));
                return {
                    ...prev,
                    [key]: { active: true, order: maxOrder + 1 }
                };
            }
        });
    };

    const handleDateFilterSubmit = () => {
        const startDate = new Date(dateRange.from);
        const endDate = new Date(dateRange.to);

        const newFilters = {
            ...filters,
            dateRange: {
                start: startDate,
                end: endDate
            }
        };
        setFilters(newFilters);
        setShowDateFilter(false);

        // Call fetchAllAnalysis with date query parameters
        dispatch(fetchAllAnalysis({
            startDate,
            endDate
        }));
    };

    const clearDateFilter = () => {
        // Reset to today's date
        const today = new Date().toISOString().slice(0, 16);
        setDateRange({
            from: today,
            to: today
        });

        // Clear date range from filters
        const start = new Date();
        const end = new Date();
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        const newFilters = {
            ...filters,
            dateRange: {
                start,
                end
            }
        };
        setFilters(newFilters);

        dispatch(fetchAllAnalysis({}));
    };

    const formatDateTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            // year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
        
    };

    const checkIsTodayDate = (start: Date, end: Date) => {
        const startToday = new Date();
        const endToday = new Date();
        startToday.setHours(0, 0, 0, 0);
        endToday.setHours(23, 59, 59, 999);

        console.log(start, end, startToday, endToday)
        return (new Date(start).getTime() === new Date(startToday).getTime() && new Date(end).getTime() === new Date(endToday).getTime());
        
    };

    const showDateRange = (dateRange: any) => {
        return formatDateTime(dateRange.start) + ' - ' + formatDateTime(dateRange.end);
        
    };

    // Group analysis data based on active groupings
    // const getGroupedAnalysis = () => {
    //     let groupedData: Record<string, IAnalysis[]> = {};

    //     // Apply filters first
    //     let filteredAnalysis = allAnalysis.filter(analysis => {
    //         // Apply date range filter
    //         if (filters.dateRange?.start && filters.dateRange?.end) {
    //             const analysisDate = new Date(analysis.createdAt);
    //             if (analysisDate < filters.dateRange.start || analysisDate > filters.dateRange.end) {
    //                 return false;
    //             }
    //         }

    //         // Apply other filters
    //         if (filters.sector?.length && !filters.sector.includes(analysis.sector.name)) {
    //             return false;
    //         }
    //         if (filters.subAnalysis?.length && !filters.subAnalysis.includes(analysis.subAnalysis.body)) {
    //             return false;
    //         }
    //         if (filters.classify?.length && !filters.classify.includes(analysis.classify)) {
    //             return false;
    //         }
    //         if (filters.addedBy?.length && !filters.addedBy.includes(analysis.addedByData?.name || '')) {
    //             return false;
    //         }
    //         if (filters.platform?.length && !filters.platform.includes(analysis.platform)) {
    //             return false;
    //         }

    //         return true;
    //     });

    //     // Apply groupings
    //     Object.entries(groupings).forEach(([key, isActive]) => {
    //         if (isActive) {
    //             const newGroupedData: Record<string, IAnalysis[]> = {};
                
    //             filteredAnalysis.forEach(analysis => {
    //                 let groupKey = '';
    //                 switch (key) {
    //                     case 'sector':
    //                         groupKey = analysis.sector.name;
    //                         break;
    //                     case 'subAnalysis':
    //                         groupKey = analysis.subAnalysis.body;
    //                         break;
    //                     case 'classify':
    //                         groupKey = analysis.classify;
    //                         break;
    //                     case 'addedBy':
    //                         groupKey = analysis.addedByData?.name || 'Unknown';
    //                         break;
    //                     case 'platform':
    //                         groupKey = analysis.platform;
    //                         break;
    //                 }

    //                 if (!newGroupedData[groupKey]) {
    //                     newGroupedData[groupKey] = [];
    //                 }
    //                 newGroupedData[groupKey].push(analysis);
    //             });

    //             groupedData = newGroupedData;
    //         }
    //     });

    //     return groupedData;
    // };

    const handleFilterTypeSelect = (type: keyof FilterState) => {
        // Initialize array if it doesn't exist
        const newFilters = { ...filters };
        if (!newFilters[type]) {
            newFilters[type] = [] as any;
        }

        // For sector and subAnalysis, find all items that contain the search value
        if (type === 'sector' || type === 'subAnalysis') {
            const matchingValues = getFilterOptions(type).filter(option => 
                option.toLowerCase().includes(filterTypeSearch.toLowerCase())
            );
            
            if (matchingValues.length > 0) {
                newFilters[type] = matchingValues as any;
            }
        } else if (type === 'publisher') {
            // For publisher, search in name or handle
            const matchingPublishers = allAnalysis
                .filter(analysis => {
                    const name = analysis.publisher.name.toLowerCase();
                    const handle = analysis.publisher.handle?.toLowerCase() || '';
                    const searchValue = filterTypeSearch.toLowerCase();
                    return name.includes(searchValue) || handle.includes(searchValue);
                })
                .map(analysis => analysis.publisher.name);
            
            const uniqueMatchingPublishers = Array.from(new Set(matchingPublishers));
            if (uniqueMatchingPublishers.length > 0) {
                newFilters[type] = uniqueMatchingPublishers as any;
            }
        } else if (type === 'tweetType') {
            // For tweetType, add the exact value if it exists in options
            const matchingValues = getFilterOptions(type).filter(option => 
                option.toLowerCase().includes(filterTypeSearch.toLowerCase())
            );
            
            if (matchingValues.length > 0) {
                newFilters[type] = matchingValues as any;
            }
        } else {
            // For other filter types, add the exact value
            const currentValues = newFilters[type] as string[];
            if (filterTypeSearch && !currentValues.includes(filterTypeSearch)) {
                newFilters[type] = [...currentValues, filterTypeSearch] as any;
            }
        }

        setFilters(newFilters);
        setShowFilterTypeMenu(false);
        setFilterTypeSearch('');
    };

    return (
        <div className="px-3 rounded-lg">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {/* Filter Type Selector */}
                    <div className="relative" ref={filterMenuRef}>
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs border border-gray-200"
                        >
                            <Filter className="w-3 h-3 text-gray-600" />
                            <span className="font-sm text-gray-700">
                                {selectedFilterType ? t(selectedFilterType) : t("selectFilterType")}
                            </span>
                            {activeFiltersCount > 0 && (
                                <span className="bg-adminPrimary text-white px-2 py-0.5 rounded-full text-xs font-medium">
                                    {activeFiltersCount}
                                </span>
                            )}
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showFilterMenu && (
                            <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-10 w-72">
                                <div className="p-4 space-y-4">
                                    {/* Filter Type Selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t("selectFilterType")}
                                        </label>
                                        <select
                                            value={selectedFilterType || ''}
                                            onChange={(e) => {
                                                setSelectedFilterType(e.target.value as keyof FilterState);
                                                setSearchQuery('');
                                            }}
                                            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none bg-gray-50"
                                        >
                                            <option value="sector">{t("sector")}</option>
                                            <option value="subAnalysis">{t("subAnalysis")}</option>
                                            <option value="classify">{t("classification")}</option>
                                            <option value="contentType">{t("contentType")}</option>
                                            <option value="tweetType">{t("tweetType")}</option>
                                            <option value="publisher">{t("publisher")}</option>
                                            <option value="addedBy">{t("addedBy")}</option>
                                            <option value="dateRange">{t("timeRange")}</option>
                                        </select>
                                    </div>

                                    {/* Date Range Filter */}
                                    {selectedFilterType === 'dateRange' ? (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {t("from")}
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    value={dateRange.from}
                                                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none bg-gray-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {t("to")}
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    value={dateRange.to}
                                                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none bg-gray-50"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleDateFilterSubmit}
                                                    className="flex-1 px-4 py-2 bg-adminPrimary text-white rounded-lg hover:bg-adminPrimary/90 transition-colors text-sm font-medium"
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
                                    ) : (
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
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                                                    className="px-4 py-2 bg-adminPrimary text-white rounded-lg hover:bg-adminPrimary/90 transition-colors text-sm font-medium"
                                                >
                                                    {t("apply")}
                                                </button>
                                            </div>
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
                                                        ? t(option) : option
                                                    }
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {selectedFilterType && selectedFilterType !== 'dateRange' && filteredOptions.length === 0 && (
                                        <div className="text-sm text-gray-500 text-center py-3 bg-gray-50 rounded-lg">
                                            {t("noResultsFound")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Grouping Selector */}
                    <div className="relative" ref={groupingMenuRef}>
                        <button
                            onClick={() => setShowGroupingMenu(!showGroupingMenu)}
                            className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm border border-gray-200"
                        >
                            <Layers className="w-3 h-3 text-gray-600" />
                            <span className="font-sm text-gray-700">{t("groupBy")}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showGroupingMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showGroupingMenu && (
                            <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-10 w-44">
                                <div className="p-2">
                                    {/* <div className="mb-2 px-2 py-1 text-xs font-medium text-gray-500 border-b border-gray-200">
                                        {t("selectGroupingOptions")}
                                    </div> */}
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => toggleGrouping('sector')}
                                            className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors ${
                                                groupings.sector?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                            }`}
                                        >
                                            {t("sector")}
                                        </button>
                                        <button
                                            onClick={() => toggleGrouping('subAnalysis')}
                                            className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors ${
                                                groupings.subAnalysis?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                            }`}
                                        >
                                            {t("subAnalysis")}
                                        </button>
                                        <button
                                            onClick={() => toggleGrouping('classify')}
                                            className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors ${
                                                groupings.classify?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                            }`}
                                        >
                                            {t("classification")}
                                        </button>
                                        <button
                                            onClick={() => toggleGrouping('contentType')}
                                            className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors ${
                                                groupings.contentType?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                            }`}
                                        >
                                            {t("contentType")}
                                        </button>
                                        <button
                                            onClick={() => toggleGrouping('publisher')}
                                            className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors ${
                                                groupings.publisher?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                            }`}
                                        >
                                            {t("publisher")}
                                        </button>
                                        <button
                                            onClick={() => toggleGrouping('addedBy')}
                                            className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors ${
                                                groupings.addedBy?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                            }`}
                                        >
                                            {t("addedBy")}
                                        </button>
                                        <button
                                            onClick={() => toggleGrouping('platform')}
                                            className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors ${
                                                groupings.platform?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                            }`}
                                        >
                                            {t("platform")}
                                        </button>
                                        <button
                                            onClick={() => toggleGrouping('tweetType')}
                                            className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors ${
                                                groupings.tweetType?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                            }`}
                                        >
                                            {t("tweetType")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Filter Type Selector */}
                    <div className="relative" ref={filterTypeMenuRef}>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={filterTypeSearch}
                                onChange={(e) => {
                                    setFilterTypeSearch(e.target.value);
                                    setShowFilterTypeMenu(e.target.value.length > 0);
                                }}
                                placeholder={t("searchFilterType")}
                                className="w-48 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none bg-gray-50"
                            />
                        </div>

                        {showFilterTypeMenu && filterTypeSearch && (
                            <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-10 w-72">
                                <div className="p-2 space-y-1">
                                    {Object.entries({
                                        sector: t("sector"),
                                        subAnalysis: t("subAnalysis"),
                                        classify: t("classification"),
                                        contentType: t("contentType"),
                                        tweetType: t("tweetType"),
                                        publisher: t("publisher"),
                                        addedBy: t("addedBy"),
                                        platform: t("platform")
                                    }).map(([key, label]) => {
                                        const filterKey = key as keyof FilterState;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => handleFilterTypeSelect(filterKey)}
                                                className="w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors text-gray-700 text-right"
                                            >
                                                {t("searchBy")} {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Active Filters Display */}
                    <div className="flex flex-wrap gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
                        {/* Display Active Filters */}
                        {Object.entries(filters).map(([type, values]) => {
                            if (Array.isArray(values) && values.length > 0) {
                                const filterType = type as keyof FilterState;
                                return (
                                    <div key={type} className="flex items-center gap-1 bg-white px-1 rounded-full text-xs shadow-sm border border-gray-200">
                                        <span className="font-medium text-gray-700">{t(type)}:</span>
                                        <span className="text-gray-600">{values.map(v => {
                                            return (type === 'classify' && Object.values(AnalysisClassifyEnum).includes(v as any))
                                                || (type === 'contentType' && Object.values(ContentTypesEnum).includes(v as any))
                                                || (type === 'tweetType' && Object.values(TweetTypesEnum).includes(v as any)) 
                                            ? t(v) : v;
                                        }).join(' - ')}</span>
                                        <button 
                                            onClick={() => {
                                                const newFilters = { ...filters };
                                                newFilters[filterType] = [] as any;
                                                setFilters(newFilters);
                                            }} 
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                );
                            }
                            if (type === 'dateRange' && values?.start && values?.end) {
                                return (
                                    <div key="dateRange" className="flex items-center gap-1 bg-white px-1 py-0.5 rounded-full text-xs shadow-sm border border-gray-200">
                                        { !checkIsTodayDate(values.start, values.end) && <span className="font-medium text-gray-700">{t("timeAndDate")}: </span>}
                                        <span className="text-gray-600">{checkIsTodayDate(values.start, values.end) ? t('today') : showDateRange(values)}</span>
                                        <button 
                                            onClick={() => {
                                                const newFilters = { ...filters };
                                                newFilters.dateRange = undefined;
                                                dispatch(fetchAllAnalysis({}));
                                                setFilters(newFilters);
                                            }} 
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                );
                            }
                            return null;
                        })}

                        {/* Display Active Groupings */}
                        {Object.entries(groupings || {}).map(([type, value]) => {
                            if (value?.active) {
                                return (
                                    <div key={type} className="flex items-center gap-1 bg-adminPrimary/10 px-2 py-.5 rounded-full text-xs shadow-sm border border-adminPrimary/20">
                                        <span className="font-medium text-adminPrimary">{t("groupBy")}:</span>
                                        <span className="text-adminPrimary">{t(type)}</span>
                                        <button 
                                            onClick={() => {
                                                toggleGrouping(type as keyof GroupingState);
                                            }} 
                                            className="text-adminPrimary/60 hover:text-adminPrimary transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>

            {/* Display grouped results */}
            {/* {Object.keys(groupings).some(key => groupings[key as keyof GroupingState]) && (
                <div className="mt-4 space-y-4">
                    {Object.entries(getGroupedAnalysis()).map(([groupKey, items]) => (
                        <div key={groupKey} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                <h3 className="font-medium text-gray-700">{groupKey}</h3>
                                <p className="text-sm text-gray-500">{items.length} {t("items")}</p>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {items.map((analysis) => (
                                    <div key={analysis._id} className="p-4 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{analysis.subAnalysis.body}</p>
                                                <p className="text-sm text-gray-500">{formatDateTime(new Date(analysis.createdAt))}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {onAnalysisSelect && (
                                                    <button
                                                        onClick={() => onAnalysisSelect(analysis)}
                                                        className="p-2 text-gray-500 hover:text-adminPrimary transition-colors"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                )}
                                                {onAnalysisDelete && (
                                                    <button
                                                        onClick={() => onAnalysisDelete(analysis)}
                                                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )} */}
        </div>
    );
};

export default AnalysisFilters; 