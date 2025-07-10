import { INews, NewsAdTypesEnum, NewsClassifyEnum, NewsGeographicalClassifyEnum, NewsPressTypesEnum } from '@/interfaces/news.types';
import { GroupedNewsData } from '../types';

// Helper function to calculate total items in a group (including children)
export const getTotalItemsInGroup = (group: GroupedNewsData): number => {
    if (group.children.length === 0) {
        return group.items.length;
    }
    return group.children.reduce((total, child) => total + getTotalItemsInGroup(child), 0);
};

// Helper function to get all items in a group (including children)
export const getAllItemsInGroup = (group: GroupedNewsData): INews[] => {
    if (group.children.length === 0) {
        return group.items;
    }
    return group.children.flatMap(child => getAllItemsInGroup(child));
};

// Helper function to get background color based on level
export const getBackgroundColor = (level: number): string => {
    switch (level) {
        // case 0: return 'bg-gray-50';
        // case 1: return 'bg-blue-50';
        // case 2: return 'bg-green-50';
        // case 3: return 'bg-yellow-50';
        // case 4: return 'bg-purple-50';
        // case 5: return 'bg-pink-50';
        default: return 'bg-gray-50';
    }
};

// Helper function to get border color based on level
export const getBorderColor = (level: number): string => {
    switch (level) {
        case 0: return 'border-gray-200';
        case 1: return 'border-blue-200';
        case 2: return 'border-green-200';
        case 3: return 'border-yellow-200';
        case 4: return 'border-purple-200';
        case 5: return 'border-pink-200';
        default: return 'border-gray-200';
    }
};

// Helper function to get text color based on level
export const getTextColor = (level: number): string => {
    switch (level) {
        case 0: return 'text-gray-900';
        case 1: return 'text-blue-900';
        case 2: return 'text-green-900';
        case 3: return 'text-yellow-900';
        case 4: return 'text-purple-900';
        case 5: return 'text-pink-900';
        default: return 'text-gray-900';
    }
};

// Helper function to get connector color based on level
export const getConnectorColor = (level: number): string => {
    switch (level) {
        case 0: return 'bg-gray-300';
        case 1: return 'bg-blue-300';
        case 2: return 'bg-green-300';
        case 3: return 'bg-yellow-300';
        case 4: return 'bg-purple-300';
        case 5: return 'bg-pink-300';
        case 6: return 'bg-red-300';
        case 7: return 'bg-orange-300';
        default: return 'bg-gray-300';
    }
};

// Helper function to get grouping type label
export const getGroupingTypeLabel = (groupKey: string, level: number, t: (key: string) => string): string => {
    const currentLevel = groupKey.split('/').at(level) || groupKey;

    if (currentLevel.startsWith('sector-')) return t("sector");
    if (currentLevel.startsWith('addedBy-')) return t("addedBy");
    if (currentLevel.startsWith('pressType-')) return t("pressType");
    if (currentLevel.startsWith('geoClassify-')) return t("geoClassify");
    if (currentLevel.startsWith('classify-')) return t("classify");
    if (currentLevel.startsWith('adType-')) return t("addType");
    if (currentLevel.startsWith('newspaper-')) return t("newspaper");
    if (currentLevel.startsWith('title-')) return t("title");
    if (currentLevel.startsWith('url-')) return t("url");
    return t("group");
};

// Helper function to get grouping key for level
export const getGroupingKey = (groupKey: string, level: number): string => {
    const currentLevel = groupKey.split('/').at(level) || groupKey;

    if (currentLevel.startsWith('sector-')) return "sector";
    if (currentLevel.startsWith('addedBy-')) return "addedBy";
    if (currentLevel.startsWith('pressType-')) return "pressType";
    if (currentLevel.startsWith('geoClassify-')) return "geoClassify";
    if (currentLevel.startsWith('classify-')) return "classify";
    if (currentLevel.startsWith('adType-')) return "addType";
    if (currentLevel.startsWith('newspaper-')) return "newspaper";
    if (currentLevel.startsWith('url-')) return "url";
    if (currentLevel.startsWith('title-')) return "title";

    return "";

};

// Helper function to calculate indentation
export const getIndentation = (level: number): number => {
    const baseIndentation = 8; // Base indentation in pixels
    const indentationIncrement = 15; // Additional pixels per level
    return baseIndentation + (level * indentationIncrement);
};

// Helper function to get classification color
export const getClassificationColor = (classify: NewsClassifyEnum): string => {
    switch (classify) {
        case NewsClassifyEnum.POSITIVE:
            return 'text-green-600';
        case NewsClassifyEnum.NEGATIVE:
            return 'text-red-600';
        default:
            return 'text-primary';
    }
};

// Helper function to check if value is an enum
export const isEnumValue = (value: string): boolean => {
    return Object.values(NewsAdTypesEnum).includes(value as NewsAdTypesEnum) ||
           Object.values(NewsClassifyEnum).includes(value as NewsClassifyEnum) ||
           Object.values(NewsGeographicalClassifyEnum).includes(value as NewsGeographicalClassifyEnum) ||
           Object.values(NewsPressTypesEnum).includes(value as NewsPressTypesEnum);
}; 