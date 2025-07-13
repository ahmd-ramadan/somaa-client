import { INews, NewsAdTypesEnum, NewsClassifyEnum, NewsGeographicalClassifyEnum, NewsPressTypesEnum } from "@/interfaces/news.types";
import { useState } from "react";

export interface FilterState {
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
    noDate?: boolean;
    newspaper?: string[];
}

export interface GroupByState {
    field: 'adType' | 'pressType' | 'geoClassify' |'classify' | 'sector' | 'date' | null;
    dateUnit?: 'day' | 'week' | 'month';
}

export const useNewsFilters = (allNews: INews[]) => {
    const [filters, setFilters] = useState<FilterState>({} as FilterState);
    const [groupBy, setGroupBy] = useState<GroupByState>({ field: null });
    const [showFilters, setShowFilters] = useState(false);

    // Filter the news data
    const filteredNews = allNews.filter(news => {
        if (!filters.title?.length && !filters.classify?.length && !filters.geoClassify?.length && !filters.sector?.length && 
            !filters.dateRange && !filters.adType?.length && !filters.pressType?.length && !filters.addedBy?.length && !filters.url?.length && !filters.newspaper?.length) {
            return true;
        }

        let matches = true;

        if (filters.title?.length && !filters.title.some(title => news.title.includes(title))) {
            matches = false;
        }

        if (filters.classify?.length && !filters.classify.includes(news.classify)) {
            matches = false;
        }

        if (filters.pressType?.length && !filters.pressType.includes(news.pressType)) {
            matches = false;
        }
        if (filters.adType?.length && !filters.adType.includes(news.adType)) {
            matches = false;
        }

        if (filters.sector?.length && !filters.sector.includes(news.sectorData.name)) {
            matches = false;
        }

        if (filters.geoClassify?.length && !filters.geoClassify.includes(news.geoClassify)) {
            matches = false;
        }

        if (filters.addedBy?.length && !filters.addedBy.includes(news.addedByData?.name || '')) {
            matches = false;
        }

        if (filters.url?.length && !filters.url.some(url => news.url.includes(url))) {
            matches = false;
        }

        if (filters.newspaper?.length && !filters.newspaper.includes(news.newspaper || '')) {
            matches = false;
        }

        if (filters.dateRange) {
            const newsDate = new Date(news.createdAt);
            if (filters.dateRange.start && newsDate < filters.dateRange.start) {
                matches = false;
            }
            if (filters.dateRange.end && newsDate > filters.dateRange.end) {
                matches = false;
            }
        }

        return matches;
    });

    // Group the filtered data if grouping is enabled
    const groupedNews = groupBy.field ? filteredNews.reduce((acc, news) => {
        let key: string;
        
        if (groupBy.field === 'date' && groupBy.dateUnit) {
            const date = new Date(news.createdAt);
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
            key = news[groupBy.field as keyof INews] as string;
        }

        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(news);
        return acc;
    }, {} as Record<string, INews[]>) : { 'All': filteredNews };

    return {
        filters,
        setFilters,
        groupBy,
        setGroupBy,
        showFilters,
        setShowFilters,
        filteredNews,
        groupedNews
    };
}; 