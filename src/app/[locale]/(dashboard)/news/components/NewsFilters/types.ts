import { FilterState } from "@/hooks/useNewsFilters";
import { INews } from "@/interfaces/news.types";

export type GroupingState = {
    [key: string]: { active: boolean; order?: number }
};

export interface NewsFiltersProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    groupings: GroupingState;
    setGroupings: React.Dispatch<React.SetStateAction<GroupingState>>;
    allNews: INews[];
    onNewsSelect?: (news: INews) => void;
    onNewsDelete?: (news: INews) => void;
}

export interface DateRange {
    from: string;
    to: string;
}

export interface FilterMenuProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    allNews: INews[];
    t: (key: string) => string;
}

export interface GroupingMenuProps {
    groupings: GroupingState;
    // setGroupings: React.Dispatch<React.SetStateAction<GroupingState>>;
    toggleGrouping: (key: keyof GroupingState) => void;
    t: (key: string) => string;
}

export interface FilterTypeMenuProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    allNews: INews[];
    t: (key: string) => string;
}

export interface ActiveFiltersDisplayProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    groupings: GroupingState;
    toggleGrouping: (key: keyof GroupingState) => void;
    resetGrouping: () => void;
    t: (key: string) => string;
    dispatch: any;
} 