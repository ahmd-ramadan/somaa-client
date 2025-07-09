import { AnalysisClassifyEnum, IAnalysis, PlatformsEnum, ContentTypesEnum } from "@/interfaces/analysis.types";
import { useState } from "react";

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
    const [itemsPerPage, setItemsPerPage] = useState(50);
    const [groupingOrder, setGroupingOrder] = useState<string[]>([]);

    // Filter the analysis data
    const filteredAnalysis = allAnalysis.filter(analysis => {
        if (!filters.platform?.length && !filters.classify?.length && !filters.contentType?.length && !filters.sector?.length && 
            !filters.dateRange && !filters.statistics && !filters.subAnalysis?.length && !filters.addedBy?.length && !filters.url?.length && !filters.publisher?.length && !filters.tweetType?.length) {
            return true;
        }

        let matches = true;

        if (filters.platform?.length && !filters.platform.includes(analysis.platform)) {
            matches = false;
        }

        if (filters.classify?.length && !filters.classify.includes(analysis.classify)) {
            matches = false;
        }

        if (filters.contentType?.length && !filters.contentType.includes(analysis.content.type)) {
            matches = false;
        }

        if (filters.sector?.length) {
            const sectorMatches = filters.sector.some(filterSector => 
                analysis.sectorData.name.toLowerCase().includes(filterSector.toLowerCase())
            );
            if (!sectorMatches) matches = false;
        }

        if (filters.subAnalysis?.length) {
            const subAnalysisMatches = filters.subAnalysis.some(filterSubAnalysis => 
                analysis.subAnalysisData.body.toLowerCase().includes(filterSubAnalysis.toLowerCase())
            );
            if (!subAnalysisMatches) matches = false;
        }

        if (filters.publisher?.length) {
            const publisherMatches = filters.publisher.some(filterPublisher => {
                const name = analysis.publisher.name.toLowerCase();
                const handle = analysis.publisher.handle?.toLowerCase() || '';
                const searchValue = filterPublisher.toLowerCase();
                return name.includes(searchValue) || handle.includes(searchValue);
            });
            if (!publisherMatches) matches = false;
        }

        if (filters.tweetType?.length && !filters.tweetType.includes(analysis.tweetType)) {
            matches = false;
        }

        if (filters.addedBy?.length && !filters.addedBy.includes(analysis.addedByData?.name || '')) {
            matches = false;
        }

        if (filters.url?.length && !filters.url.some(url => analysis.url.includes(url))) {
            matches = false;
        }

        if (filters.dateRange) {
            const analysisDate = new Date(analysis.createdAt);
            if (filters.dateRange.start && analysisDate < filters.dateRange.start) {
                matches = false;
            }
            if (filters.dateRange.end && analysisDate > filters.dateRange.end) {
                matches = false;
            }
        }

        if (filters.statistics) {
            const { reactions, comments, shares, views } = filters.statistics;
            if (reactions) {
                if (reactions.min && analysis.statistics.reactions < reactions.min) matches = false;
                if (reactions.max && analysis.statistics.reactions > reactions.max) matches = false;
            }
            if (comments) {
                if (comments.min && analysis.statistics.comments < comments.min) matches = false;
                if (comments.max && analysis.statistics.comments > comments.max) matches = false;
            }
            if (shares) {
                if (shares.min && analysis.statistics.shares < shares.min) matches = false;
                if (shares.max && analysis.statistics.shares > shares.max) matches = false;
            }
            if (views) {
                if (views.min && analysis.statistics.views < views.min) matches = false;
                if (views.max && analysis.statistics.views > views.max) matches = false;
            }
        }

        return matches;
    });

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
        filteredAnalysis: paginatedAnalysis,
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