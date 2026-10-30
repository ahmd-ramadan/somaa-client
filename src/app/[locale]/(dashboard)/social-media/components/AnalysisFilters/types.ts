import { IAnalysis } from "@/interfaces/analysis.types";
import { FilterState } from "@/hooks/useAnalysisFilters";

export type StatisticType = 'reactions' | 'comments' | 'shares' | 'views' | 'appearance';

export type GroupSortOrder = 'normal' | 'asc' | 'desc';

export type GroupingState = {
    [key: string]: { active: boolean; order?: number; sort?: GroupSortOrder }
};

export interface AnalysisFiltersProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    groupings: GroupingState;
    setGroupings: React.Dispatch<React.SetStateAction<GroupingState>>;
    allAnalysis: IAnalysis[];
    onAnalysisSelect?: (analysis: IAnalysis) => void;
    onAnalysisDelete?: (analysis: IAnalysis) => void;
    toggleGroupSort?: (key: keyof GroupingState) => void;
}

export interface DateRange {
    from: string;
    to: string;
}

export interface FilterMenuProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    allAnalysis: IAnalysis[];
    t: (key: string) => string;
}

export interface GroupingMenuProps {
    groupings: GroupingState;
    // setGroupings: React.Dispatch<React.SetStateAction<GroupingState>>;
    toggleGrouping: (key: keyof GroupingState) => void;
    toggleGroupSort?: (key: keyof GroupingState) => void;
    t: (key: string) => string;
}

export interface FilterTypeMenuProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    allAnalysis: IAnalysis[];
    t: (key: string) => string;
}

export interface ActiveFiltersDisplayProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    groupings: GroupingState;
    toggleGrouping: (key: keyof GroupingState) => void;
    toggleGroupSort?: (key: keyof GroupingState) => void;
    resetGrouping: () => void;
    t: (key: string) => string;
    dispatch: any;
} 