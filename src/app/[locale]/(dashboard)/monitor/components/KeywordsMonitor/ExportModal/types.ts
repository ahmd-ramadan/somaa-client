import { IMonitorResult } from "../types";

export interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: IMonitorResult[];
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
    totalInteractions: number;
}

export interface ExportData {
    sortedData: IMonitorResult[];
    stats: ExportStats;
}

export interface ModalFooterProps {
  onClose: () => void;
  onExport: () => void;
  isExportDisabled: boolean;
  isExporting?: boolean;
} 