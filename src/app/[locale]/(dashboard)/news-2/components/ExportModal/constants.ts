import { Column } from './types';

export const AVAILABLE_COLUMNS: Column[] = [
    { id: 'url', label: 'URL', selected: false },
    { id: 'title', label: 'title', selected: false },
    { id: 'sector', label: 'Sector', selected: false },
    { id: 'classify', label: 'Classify', selected: false },
    { id: 'adType', label: 'adType', selected: false },
    { id: 'pressType', label: 'pressType', selected: false },
    { id: 'geoClassify', label: 'geoClassify', selected: false },
    { id: 'newspaper', label: 'newspaper', selected: false },
    { id: 'createdAt', label: 'Created At', selected: false },
    { id: 'addedBy', label: 'Added By', selected: false },
];

export const LOCAL_STORAGE_KEY = 'exportTemplates';

export const EXCEL_STYLES = {
    header: {
        font: { bold: true },
        alignment: { horizontal: 'center' },
        fill: { fgColor: { rgb: "E2E8F0" } }
    },
    statsHeader: {
        font: { bold: true },
        alignment: { horizontal: 'center' },
        fill: { fgColor: { rgb: "E2E8F0" } }
    },
    statsRow: {
        alignment: { horizontal: 'center' }
    }
};

export const COLUMN_WIDTHS = {
    default: 15,
    statistic: 20,
    padding: 2
}; 