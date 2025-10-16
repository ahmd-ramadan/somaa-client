import { AnalysisClassifyEnum, IAnalysis, PlatformsEnum, ContentTypesEnum } from "@/interfaces/analysis.types";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useDebounce } from "@/utils/debounce";

type StatisticType = 'reactions' | 'comments' | 'shares' | 'views' | 'appearance';

export interface FilterState {
    platform?: PlatformsEnum[];
    classify?: AnalysisClassifyEnum[];
    contentType?: ContentTypesEnum[];
    sector?: string[];
    subAnalysis?: string[];
    publisher?: string[];
    tweetType?: string[];
    dateRange?: {
        start?: Date;
        end?: Date;
    };
    statistics?: {
        [key in StatisticType]?: { min?: number; max?: number };
    };
    noDate?: boolean; 
    selectedStatistic?: StatisticType;
    addedBy?: string[];
    url?: string[];
}

export interface GroupByState {
    field: 'platform' | 'classify' | 'sector' | 'date' | null;
    dateUnit?: 'day' | 'week' | 'month';
}

export const useAnalysisFilters = (allAnalysis: IAnalysis[]) => {
    const [filters, setFilters] = useState<FilterState>({});
    const [groupBy, setGroupBy] = useState<GroupByState>({ field: null });
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [groupingOrder, setGroupingOrder] = useState<string[]>([]);
    
    // Debounced filters for better performance
    const [debouncedFilters, setDebouncedFilters] = useState<FilterState>({});
    
    // Debounce filter updates - reduced delay for better responsiveness
    const debouncedSetFilters = useDebounce((newFilters: FilterState) => {
        setDebouncedFilters(newFilters);
    }, 150); // Reduced from 300ms to 150ms for better responsiveness
    
    // Update debounced filters when filters change
    useEffect(() => {
        debouncedSetFilters(filters);
    }, [filters, debouncedSetFilters]);

    // Optimized filter function with early returns - uses debounced filters
    const filterAnalysis = useCallback((analysis: IAnalysis): boolean => {
        // Early return if no filters are applied
        if (!debouncedFilters.platform?.length && !debouncedFilters.classify?.length && !debouncedFilters.contentType?.length && 
            !debouncedFilters.sector?.length && !debouncedFilters.dateRange && !debouncedFilters.statistics && 
            !debouncedFilters.subAnalysis?.length && !debouncedFilters.addedBy?.length && !debouncedFilters.url?.length && 
            !debouncedFilters.publisher?.length && !debouncedFilters.tweetType?.length) {
            return true;
        }

        // Platform filter - early return
        if (debouncedFilters.platform?.length && !debouncedFilters.platform.includes(analysis.platform)) {
            return false;
        }

        // Classify filter - early return
        if (debouncedFilters.classify?.length && !debouncedFilters.classify.includes(analysis.classify)) {
            return false;
        }

        // Content type filter - early return
        if (debouncedFilters.contentType?.length && !debouncedFilters.contentType.includes(analysis.content.type)) {
            return false;
        }

        // Tweet type filter - early return
        if (debouncedFilters.tweetType?.length && !debouncedFilters.tweetType.includes(analysis.tweetType)) {
            return false;
        }

        // Added by filter - early return
        if (debouncedFilters.addedBy?.length && !debouncedFilters.addedBy.includes(analysis.addedByData?.name || '')) {
            return false;
        }

        // URL filter - early return
        if (debouncedFilters.url?.length && !debouncedFilters.url.some(url => analysis.url.includes(url))) {
            return false;
        }

        // Sector filter - optimized with early return
        if (debouncedFilters.sector?.length) {
            const sectorName = analysis.sectorData.name.toLowerCase();
            if (!debouncedFilters.sector.some(filterSector => 
                sectorName.includes(filterSector.toLowerCase())
            )) {
                return false;
            }
        }

        // Sub analysis filter - optimized with early return
        if (debouncedFilters.subAnalysis?.length) {
            const subAnalysisBody = analysis.subAnalysisData.body.toLowerCase();
            if (!debouncedFilters.subAnalysis.some(filterSubAnalysis => 
                subAnalysisBody.includes(filterSubAnalysis.toLowerCase())
            )) {
                return false;
            }
        }

        // Publisher filter - optimized with early return
        if (debouncedFilters.publisher?.length) {
            const name = analysis.publisher.name.toLowerCase();
            const handle = analysis.publisher.handle?.toLowerCase() || '';
            if (!debouncedFilters.publisher.some(filterPublisher => {
                const searchValue = filterPublisher.toLowerCase();
                return name.includes(searchValue) || handle.includes(searchValue);
            })) {
                return false;
            }
        }

        // Date range filter - optimized with early return
        if (debouncedFilters.dateRange) {
            const analysisDate = new Date(analysis.createdAt);
            if (debouncedFilters.dateRange.start && analysisDate < debouncedFilters.dateRange.start) {
                return false;
            }
            if (debouncedFilters.dateRange.end && analysisDate > debouncedFilters.dateRange.end) {
                return false;
            }
        }

        // Statistics filter - optimized with early returns
        if (debouncedFilters.statistics) {
            const { reactions, comments, shares, views } = debouncedFilters.statistics;
            const stats = analysis.statistics;
            
            if (reactions) {
                if (reactions.min && stats.reactions < reactions.min) return false;
                if (reactions.max && stats.reactions > reactions.max) return false;
            }
            if (comments) {
                if (comments.min && stats.comments < comments.min) return false;
                if (comments.max && stats.comments > comments.max) return false;
            }
            if (shares) {
                if (shares.min && stats.shares < shares.min) return false;
                if (shares.max && stats.shares > shares.max) return false;
            }
            if (views) {
                if (views.min && stats.views < views.min) return false;
                if (views.max && stats.views > views.max) return false;
            }
        }

        return true;
    }, [debouncedFilters]);

    // Memoized filtered analysis
    const filteredAnalysis = useMemo(() => {
        return allAnalysis.filter(filterAnalysis);
    }, [allAnalysis, filterAnalysis]);

    // Calculate pagination
    const totalItems = filteredAnalysis.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAnalysis = filteredAnalysis.slice(startIndex, endIndex);

    // Group the filtered data if grouping is enabled
    const groupedAnalysis = groupBy.field ? paginatedAnalysis.reduce((acc, analysis) => {
        let key: string;
        
        if (groupBy.field === 'date' && groupBy.dateUnit) {
            const date = new Date(analysis.createdAt);
            switch (groupBy.dateUnit) {
                case 'day':
                    key = date.toISOString().split('T')[0];
                    break;
                case 'week':
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toISOString().split('T')[0];
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${date.getMonth() + 1}`;
                    break;
                default:
                    key = date.toISOString();
            }
        } else {
            key = analysis[groupBy.field as keyof IAnalysis] as string;
        }

        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(analysis);
        return acc;
    }, {} as Record<string, IAnalysis[]>) : { 'All': paginatedAnalysis };

    const toggleGrouping = (key: keyof GroupByState) => {
        setGroupBy(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return {
        filters,
        setFilters,
        groupBy,
        setGroupBy,
        showFilters,
        setShowFilters,
        filteredAnalysis,
        groupedAnalysis,
        pagination: {
            currentPage,
            setCurrentPage,
            itemsPerPage,
            setItemsPerPage,
            totalItems,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1
        },
        toggleGrouping
    };
}; 