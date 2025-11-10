import { Column } from './types';

export const AVAILABLE_COLUMNS: Column[] = [
    { id: 'url', label: 'URL', selected: false },
    { id: 'platform', label: 'Platform', selected: false },
    { id: 'publisher', label: 'Publisher', selected: false },
    { id: 'sector', label: 'Sector', selected: false },
    { id: 'classify', label: 'Classify', selected: false },
    { id: 'analysis', label: 'Analysis', selected: false },
    { id: 'reactions', label: 'Reactions', selected: false },
    { id: 'comments', label: 'Comments', selected: false },
    { id: 'shares', label: 'Shares', selected: false },
    { id: 'views', label: 'Views', selected: false },
    { id: 'appearance', label: 'Appearance', selected: false },
    { id: 'total', label: 'Total', selected: false },
    { id: 'createdAt', label: 'Created At', selected: false },
    { id: 'addedBy', label: 'Added By', selected: false },
    { id: 'tweetType', label: 'Tweet Type', selected: false },
    { id: 'contentType', label: 'Content Type', selected: false },
    { id: 'isRelated', label: 'Post Relationship', selected: false },
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