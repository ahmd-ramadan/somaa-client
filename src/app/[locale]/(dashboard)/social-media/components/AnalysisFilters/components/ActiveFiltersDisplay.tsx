import React from 'react';
import { X, AlertCircle, ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';
import { AnalysisClassifyEnum, ContentTypesEnum, TweetTypesEnum, PlatformsEnum } from "@/interfaces/analysis.types";
import { fetchAllAnalysis } from "@/lib/features/socialMedia/analysisThunks";
import { ActiveFiltersDisplayProps } from '../types';

const ActiveFiltersDisplay: React.FC<ActiveFiltersDisplayProps> = ({
    filters,
    setFilters,
    groupings,
    resetGrouping,
    toggleGrouping,
    toggleGroupSort,
    t,
    dispatch
}) => {
    const formatDateTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const checkIsTodayDate = (start: Date, end: Date) => {
        const s = new Date(start);
        const e = new Date(end);
        const today = new Date();
        return s.toDateString() === today.toDateString() &&
            e.toDateString() === today.toDateString() &&
            s.getHours() === 0 && (e.getHours() === 23);
    };

    const showDateRange = (dateRange: any) => {
        return formatDateTime(dateRange.start) + ' - ' + formatDateTime(dateRange.end);
    };

    // Check if there are any active filters
    const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) return true;
        if (key === 'dateRange' && value?.start && value?.end) return true;
        if (key === 'publishDateRange' && value?.start && value?.end) return true;
        if (key === 'statistics') {
            return Object.values(value || {}).some(stat =>
                (stat as { min?: number; max?: number })?.min ||
                (stat as { min?: number; max?: number })?.max
            );
        }
        return false;
    });

    // Check if there are any active groupings
    const hasActiveGroupings = Object.values(groupings || {}).some(value => value?.active);

    return (
        <div className="flex flex-col gap-2">
            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
                {/* Display Active Filters */}
                {Object.entries(filters).map(([type, values]) => {
                    if (Array.isArray(values) && values.length > 0) {
                        const filterType = type as keyof typeof filters;
                        return (
                            <div key={type} className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs shadow-sm border border-gray-200">
                                <span className="font-medium text-gray-700">{t(type)}:</span>
                                <span className="text-gray-600">{values.map(v => {
                                    return (type === 'classify' && Object.values(AnalysisClassifyEnum).includes(v as any))
                                        || (type === 'contentType' && Object.values(ContentTypesEnum).includes(v as any))
                                        || (type === 'tweetType' && Object.values(TweetTypesEnum).includes(v as any))
                                        || (type === 'platform' && Object.values(PlatformsEnum).includes(v as any))
                                        ? t(v) : v;
                                }).join(' - ')}</span>
                                <button
                                    onClick={() => {
                                        const newFilters = { ...filters };
                                        newFilters[filterType] = [] as any;
                                        setFilters(newFilters);
                                    }}
                                    className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                                    title={t("removeFilter")}
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        );
                    }
                    if (type === 'dateRange' && values?.start && values?.end) {
                        return (
                            <div key="dateRange" className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs shadow-sm border border-gray-200">
                                <span className="font-medium text-gray-700">{t("timeAndDate")}: </span>
                                <span className="text-gray-600">{showDateRange(values)}</span>
                                <button
                                    onClick={() => {
                                        const newFilters = { ...filters };
                                        newFilters.dateRange = undefined;

                                        const query: any = {
                                            publishStartDate: filters.publishDateRange?.start,
                                            publishEndDate: filters.publishDateRange?.end,
                                        };

                                        setFilters(newFilters);
                                        dispatch(fetchAllAnalysis(query));
                                    }}
                                    className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                                    title={t("removeDateFilter")}
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        );
                    }
                    if (type === 'publishDateRange' && values?.start && values?.end) {
                        return (
                            <div key="publishDateRange" className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs shadow-sm border border-gray-200">
                                {!checkIsTodayDate(values.start, values.end) && <span className="font-medium text-gray-700">{t("publishDate")}: </span>}
                                <span className="text-gray-600">{checkIsTodayDate(values.start, values.end) ? t('today') : showDateRange(values)}</span>
                                <button
                                    onClick={() => {
                                        const newFilters = { ...filters };

                                        // Reset to today's data or remove
                                        const today = new Date();
                                        const startOfDay = new Date(today);
                                        startOfDay.setHours(0, 0, 0, 0);
                                        const endOfDay = new Date(today);
                                        endOfDay.setHours(23, 59, 59, 999);

                                        const isToday = checkIsTodayDate(values.start, values.end);
                                        newFilters.publishDateRange = isToday ? undefined : { start: startOfDay, end: endOfDay };

                                        const query: any = {
                                            startDate: filters.dateRange?.start,
                                            endDate: filters.dateRange?.end,
                                        };
                                        if (!isToday) {
                                            query.publishStartDate = startOfDay;
                                            query.publishEndDate = endOfDay;
                                        }
                                        newFilters.noDate = isToday;
                                        setFilters(newFilters);
                                        dispatch(fetchAllAnalysis(query));
                                    }}
                                    className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                                    title={t("removeDateFilter")}
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        );
                    }
                    return null;
                })}

                {/* Display Active Groupings */}
                {Object.entries(groupings || {})
                    .filter(([_, value]) => value?.active)
                    .sort((a, b) => (a[1].order || 0) - (b[1].order || 0))
                    .map(([type, value]) => {
                        const currentSort = value?.sort || 'normal';
                        return (
                            <div key={type} className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-full text-xs shadow-sm border border-primary/20">
                                <span className="font-medium text-primary">{t("groupBy")}:</span>
                                <span className="text-primary font-semibold">{t(type)}</span>

                                {toggleGroupSort && (
                                    <button
                                        type="button"
                                        onClick={() => toggleGroupSort(type as keyof typeof groupings)}
                                        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white hover:bg-gray-100 text-primary border border-primary/30 transition-colors cursor-pointer"
                                        title={
                                            currentSort === 'normal'
                                                ? (t("sortNormal") || "ترتيب عادي")
                                                : currentSort === 'desc'
                                                    ? (t("sortDescCount") || "تنازلي حسب العدد")
                                                    : (t("sortAscCount") || "تصاعدي حسب العدد")
                                        }
                                    >
                                        {currentSort === 'normal' && (
                                            <>
                                                <ArrowUpDown className="w-3 h-3 text-gray-500" />
                                                {/* <span className="text-[10px] text-gray-600 font-medium">{t("sortNormal") || "عادي"}</span> */}
                                            </>
                                        )}
                                        {currentSort === 'desc' && (
                                            <>
                                                <ArrowDown className="w-3 h-3 text-primary font-bold" />
                                                {/* <span className="text-[10px] text-primary font-bold">{t("sortDesc") || "تنازلي"}</span> */}
                                            </>
                                        )}
                                        {currentSort === 'asc' && (
                                            <>
                                                <ArrowUp className="w-3 h-3 text-secondary font-bold" />
                                                {/* <span className="text-[10px] text-secondary font-bold">{t("sortAsc") || "تصاعدي"}</span> */}
                                            </>
                                        )}
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        toggleGrouping(type as keyof typeof groupings);
                                    }}
                                    className="text-primary/60 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                                    title={t("removeGrouping")}
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        );
                    })}

                {/* No Active Filters Message */}
                {!hasActiveFilters && !hasActiveGroupings && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{t("noActiveFilters")}</span>
                    </div>
                )}
            </div>

            {/* Clear All Filters Button */}
            {(hasActiveFilters || hasActiveGroupings) && (
                <div className="flex justify-end">
                    <button
                        onClick={() => {
                            // Clear all filters
                            const newFilters = { ...filters };
                            Object.keys(newFilters).forEach(key => {
                                if (Array.isArray(newFilters[key as keyof typeof filters])) {
                                    newFilters[key as keyof typeof filters] = [] as any;
                                } else if (key === 'dateRange') {
                                    newFilters.dateRange = undefined;
                                } else if (key === 'publishDateRange') {
                                    newFilters.publishDateRange = undefined;
                                }
                            });
                            newFilters.noDate = true
                            setFilters(newFilters);

                            // Clear all groupings
                            resetGrouping()

                            dispatch(fetchAllAnalysis({}));
                        }}
                        className="text-sm text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                    >
                        <X className="w-4 h-4" />
                        {t("clearAllFilters")}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActiveFiltersDisplay; 