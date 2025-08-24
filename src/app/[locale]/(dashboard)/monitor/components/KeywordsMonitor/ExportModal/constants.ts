import { Column } from './types';

export const AVAILABLE_COLUMNS: Column[] = [
    { id: 'platform',  label: 'platform', selected: false },
    { id: 'authorName',  label: 'authorName', selected: false },
    { id: 'authorHandle', label: 'authorHandle', selected: false },
    { id: 'content',  label: 'content', selected: false },
    { id: 'sentiment',  label: 'sentiment', selected: false },
    { id: 'language',  label: 'language', selected: false },
    { id: 'reactions',  label: 'reactions', selected: false },
    { id: 'comments',  label: 'comments', selected: false },
    { id: 'shares',  label: 'shares', selected: false },
    { id: 'total',  label: 'total', selected: false },
    { id: 'views',  label: 'views', selected: false },
    { id: 'votes',  label: 'votes', selected: false },
    { id: 'retweets',  label: 'retweets', selected: false },
    { id: 'quotes',  label: 'quotes', selected: false },
    { id: 'reposts',  label: 'reposts', selected: false },
    { id: 'saves',  label: 'saves', selected: false },
    { id: 'downloads',  label: 'downloads', selected: false },
    { id: 'bookmarks',  label: 'bookmarks', selected: false },
    { id: 'publishDate',  label: 'publishDate', selected: false },
    { id: 'url', label: 'url', selected: false },
    { id: 'location', label: 'location', selected: false },
    { id: 'authorAge',  label: 'authorAge', selected: false },
    { id: 'authorGender',  label: 'authorGender', selected: false },
    { id: 'verified',  label: 'verified', selected: false },
    { id: 'mediaCount',  label: 'mediaCount', selected: false }
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