import { useTranslations } from "next-intl";
import { X, Filter, ChevronDown, Layers } from 'lucide-react';
import { useState, useEffect, useRef } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { INews, NewsAdTypesEnum, NewsClassifyEnum, NewsGeographicalClassifyEnum, NewsPressTypesEnum } from "@/interfaces/news.types";
import { fetchAllNews } from "@/lib/features/news/newsthunks";

interface FilterState {
    adType?: NewsAdTypesEnum[];
    pressType?: NewsPressTypesEnum[];
    classify?: NewsClassifyEnum[];
    geoClassify?: NewsGeographicalClassifyEnum[];
    sector?: string[];
    dateRange?: {
        start?: Date;
        end?: Date;
    };
    addedBy?: string[];
    url?: string[];
    title?: string[];
    newspaper?: string[];
}

interface GroupingState {
    sector?: boolean;
    addedBy?: boolean;
    adType?: boolean;
    pressType?: boolean;
    classify?: boolean;
    geoClassify?: boolean;
    newspaper?: boolean;
}

interface NewsFiltersProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    groupings: GroupingState;
    setGroupings: (groupings: GroupingState) => void;
    allNews: INews[];
}

interface DateRange {
    from: string;
    to: string;
}

const NewsFilters = ({ 
    filters, 
    setFilters, 
    showFilters, 
    setShowFilters, 
    groupings,
    setGroupings,
    allNews 
}: NewsFiltersProps) => {
    const t = useTranslations("NewsPage.AllNewsTable");
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

    // Handle click outside for menus
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
                setShowFilterMenu(false);
            }
            if (groupingMenuRef.current && !groupingMenuRef.current.contains(event.target as Node)) {
                setShowGroupingMenu(false);
            }
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

        dispatch(fetchAllNews({
            startDate: start,
            endDate: end
        }));
    }, [dispatch]);

    // Get unique values for each filter type
    const getFilterOptions = (type: keyof FilterState): string[] => {
        switch (type) {
            case 'sector':
                return Array.from(new Set(allNews.map(a => a.sector.name)));
            case 'classify':
                return Object.values(NewsClassifyEnum);
            case 'adType':
                return Object.values(NewsAdTypesEnum);
            case 'pressType':
                return Object.values(NewsPressTypesEnum);
            case 'geoClassify':
                return Object.values(NewsGeographicalClassifyEnum);
            case 'addedBy':
                return Array.from(new Set(allNews.map(a => a.addedByData?.name).filter(Boolean)));
            case 'newspaper':
                return Array.from(new Set(allNews.map(a => a.newspaper).filter(Boolean)));
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

        // Add the value if it doesn't exist
        const currentValues = newFilters[selectedFilterType] as string[];
        if (!currentValues.includes(value)) {
            newFilters[selectedFilterType] = [...currentValues, value] as any;
        }

        setFilters(newFilters);
        setSearchQuery('');
        setShowFilterMenu(false);
    };

    const toggleGrouping = (key: keyof GroupingState) => {
        setGroupings({
            ...groupings,
            [key]: !groupings[key]
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

        dispatch(fetchAllNews({
            startDate,
            endDate
        }));
    };

    const clearDateFilter = () => {
        const today = new Date().toISOString().slice(0, 16);
        setDateRange({
            from: today,
            to: today
        });

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

        dispatch(fetchAllNews({}));
    };

    const formatDateTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
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
        return (new Date(start).getTime() === new Date(startToday).getTime() && 
                new Date(end).getTime() === new Date(endToday).getTime());
    };

    const showDateRange = (dateRange: any) => {
        return formatDateTime(dateRange.start) + ' - ' + formatDateTime(dateRange.end);
    };

    const handleFilterTypeSelect = (type: keyof FilterState) => {
        const newFilters = { ...filters };
        if (!newFilters[type]) {
            newFilters[type] = [] as any;
        }

        const currentValues = newFilters[type] as string[];
        if (filterTypeSearch && !currentValues.includes(filterTypeSearch)) {
            newFilters[type] = [...currentValues, filterTypeSearch] as any;
        }

        setFilters(newFilters);
        setShowFilterTypeMenu(false);
        setFilterTypeSearch('');
    };

    // Calculate active filters count
    const activeFiltersCount = Object.entries(filters).reduce((count, [key, value]) => {
        if (Array.isArray(value)) {
            return count + value.length;
        }
        if (key === 'dateRange' && value?.start && value?.end) {
            return count + 1;
        }
        return count;
    }, 0);

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
                                            <option value="classify">{t("classification")}</option>
                                            <option value="adType">{t("adType")}</option>
                                            <option value="pressType">{t("pressType")}</option>
                                            <option value="geoClassify">{t("geoClassify")}</option>
                                            <option value="addedBy">{t("addedBy")}</option>
                                            <option value="newspaper">{t("newspaper")}</option>
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
                                                    {option}
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
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => toggleGrouping('sector')}
                                            className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors ${
                                                groupings.sector ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                            }`}
                                        >
                                            {t("sector")}
                                        </button>
                                        <button
                                            onClick={() => toggleGrouping('classify')}
                                            className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors ${
                                                groupings.classify ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                            }`}
                                        >
                                            {t("classification")}
                                        </button>
                                        <button
                                            onClick={() => toggleGrouping('adType')}
                                            className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors ${
                                                groupings.adType ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                            }`}
                                        >
                                            {t("adType")}
                                        </button>
                                        <button
                                            onClick={() => toggleGrouping('pressType')}
                                            className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors ${
                                                groupings.pressType ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                            }`}
                                        >
                                            {t("pressType")}
                                        </button>
                                        <button
                                            onClick={() => toggleGrouping('geoClassify')}
                                            className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors ${
                                                groupings.geoClassify ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                            }`}
                                        >
                                            {t("geoClassify")}
                                        </button>
                                        <button
                                            onClick={() => toggleGrouping('addedBy')}
                                            className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors ${
                                                groupings.addedBy ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                            }`}
                                        >
                                            {t("addedBy")}
                                        </button>
                                        <button
                                            onClick={() => toggleGrouping('newspaper')}
                                            className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors ${
                                                groupings.newspaper ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                            }`}
                                        >
                                            {t("newspaper")}
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
                                        classify: t("classification"),
                                        adType: t("adType"),
                                        pressType: t("pressType"),
                                        geoClassify: t("geoClassify"),
                                        addedBy: t("addedBy"),
                                        newspaper: t("newspaper")
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
                                        { 
                                            type === 'classify' ? <span className="text-gray-600">{values.map(v => t(v)).join(' - ')}</span>
                                            : <span className="text-gray-600">{values.join(' - ')}</span>
                                        }
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
                                        {!checkIsTodayDate(values.start, values.end) && <span className="font-medium text-gray-700">{t("timeAndDate")}: </span>}
                                        <span className="text-gray-600">{checkIsTodayDate(values.start, values.end) ? t('today') : showDateRange(values)}</span>
                                        <button 
                                            onClick={() => {
                                                const newFilters = { ...filters };
                                                newFilters.dateRange = undefined;
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
                        {Object.entries(groupings).map(([type, isActive]) => {
                            if (isActive) {
                                return (
                                    <div key={type} className="flex items-center gap-1 bg-adminPrimary/10 px-2 py-.5 rounded-full text-xs shadow-sm border border-adminPrimary/20">
                                        <span className="font-medium text-adminPrimary">{t("groupBy")}:</span>
                                        <span className="text-adminPrimary">{t(type)}</span>
                                        <button 
                                            onClick={() => {
                                                setGroupings({
                                                    ...groupings,
                                                    [type]: false
                                                });
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
        </div>
    );
};

export default NewsFilters; 