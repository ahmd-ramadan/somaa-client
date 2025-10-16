import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { AnalysisClassifyEnum, ContentTypesEnum, TweetTypesEnum, PlatformsEnum } from "@/interfaces/analysis.types";
import { fetchAllAnalysis } from "@/lib/features/socialMedia/analysisThunks";
import { ActiveFiltersDisplayProps } from '../types';

const ActiveFiltersDisplay: React.FC<ActiveFiltersDisplayProps> = ({
    filters,
    setFilters,
    groupings,
    resetGrouping,
    toggleGrouping,
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
        const startToday = new Date();
        const endToday = new Date();
        startToday.setHours(0, 0, 0, 0);
        endToday.setHours(23, 59, 59, 999);

        return (new Date(start).getTime() === new Date(startToday).getTime() && new Date(end).getTime() === new Date(endToday).getTime());
    };

    const showDateRange = (dateRange: any) => {
        return formatDateTime(dateRange.start) + ' - ' + formatDateTime(dateRange.end);
    };

    // Check if there are any active filters
    const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) return true;
        if (key === 'dateRange' && value?.start && value?.end) return true;
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
                                { !checkIsTodayDate(values.start, values.end) && <span className="font-medium text-gray-700">{t("timeAndDate")}: </span>}
                                <span className="text-gray-600">{checkIsTodayDate(values.start, values.end) ? t('today') : showDateRange(values)}</span>
                                <button 
                                    onClick={() => {
                                        const newFilters = { ...filters };
                                        
                                        // Reset to today's data
                                        const today = new Date();
                                        const startOfDay = new Date(today);
                                        startOfDay.setHours(0, 0, 0, 0);
                                        const endOfDay = new Date(today);
                                        endOfDay.setHours(23, 59, 59, 999);
                                        
                                        newFilters.dateRange = checkIsTodayDate(values.start, values.end) ? {} : { end: endOfDay, start: startOfDay };
                                        const query = checkIsTodayDate(values.start, values.end) ? {} : { startDate: endOfDay, endDate: startOfDay };
                                        
                                        newFilters.noDate = true;
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
                {Object.entries(groupings || {}).map(([type, value]) => {
                    if (value?.active) {
                        return (
                            <div key={type} className="flex items-center gap-1 bg-adminPrimary/10 px-2 py-1 rounded-full text-xs shadow-sm border border-adminPrimary/20">
                                <span className="font-medium text-adminPrimary">{t("groupBy")}:</span>
                                <span className="text-adminPrimary">{t(type)}</span>
                                <button 
                                    onClick={() => {
                                        toggleGrouping(type as keyof typeof groupings);
                                    }} 
                                    className="text-adminPrimary/60 hover:text-adminPrimary transition-colors ml-1"
                                    title={t("removeGrouping")}
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        );
                    }
                    return null;
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