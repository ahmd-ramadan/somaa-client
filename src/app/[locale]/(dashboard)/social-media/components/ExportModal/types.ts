import { IAnalysis } from "@/interfaces/analysis.types";

export interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: IAnalysis[];
}

export interface Column {
    id: string;
    label: string;
    selected: boolean;
}

export interface Template {
    id: string;
    name: string;
    columns: string[];
}

export type SortOrder = 'none' | 'asc' | 'desc';

export interface ExportStats {
    totalPosts: number;
    totalReactions: number;
    totalComments: number;
    totalShares: number;
    totalViews: number;
    totalAppearance: number;
}

export interface ExportData {
    sortedData: IAnalysis[];
    stats: ExportStats;
} 