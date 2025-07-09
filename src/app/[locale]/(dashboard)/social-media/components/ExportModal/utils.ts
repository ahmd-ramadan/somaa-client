import * as XLSX from 'xlsx';
import { IAnalysis } from "@/interfaces/analysis.types";
import { ContentTypesEnum, TweetTypesEnum } from "@/interfaces/analysis.types";
import { Column, Template, SortOrder, ExportStats, ExportData } from './types';
import { LOCAL_STORAGE_KEY, EXCEL_STYLES, COLUMN_WIDTHS } from './constants';
import { formatDate } from '@/utils/formatDateAndTime';

export const getCellValue = (item: IAnalysis, columnId: string, t: (key: string) => string): string => {
    switch (columnId) {
        case 'url':
            return item.url;
        case 'platform':
            return t(item.platform);
        case 'publisher':
            return item.publisher.name;
        case 'sector':
            return item.sectorData.name;
        case 'classify':
            return t(item.classify);
        case 'analysis':
            return item.subAnalysisData.body;
        case 'reactions':
            return item.statistics.reactions.toLocaleString();
        case 'comments':
            return item.statistics.comments.toLocaleString();
        case 'shares':
            return item.statistics.shares.toLocaleString();
        case 'views':
            return item.statistics.views.toLocaleString();
        case 'total':
            return (item.statistics.reactions + 
                   item.statistics.comments + item.statistics.shares).toLocaleString();
        case 'createdAt':
            return new Date(item.createdAt).toLocaleString();
        case 'addedBy':
            return item.addedByData?.name || '';
        case 'tweetType':
            return t(item?.tweetType) || t(TweetTypesEnum.TWEET);
        case 'contentType':
            return t(item?.content?.type) || t(ContentTypesEnum.TEXT);
        default:
            return '';
    }
};

export const calculateStats = (data: IAnalysis[]): ExportStats => {
    return {
        totalPosts: data.length,
        totalReactions: data.reduce((sum, item) => sum + item.statistics.reactions, 0),
        totalComments: data.reduce((sum, item) => sum + item.statistics.comments, 0),
        totalShares: data.reduce((sum, item) => sum + item.statistics.shares, 0),
        totalViews: data.reduce((sum, item) => sum + item.statistics.views, 0),
        totalAppearance: data.reduce((sum, item) => 
            sum + item.statistics.views + item.statistics.reactions + 
            item.statistics.comments + item.statistics.shares, 0
        )
    };
};

export const sortData = (data: IAnalysis[], sortOrder: SortOrder): IAnalysis[] => {
    if (sortOrder === 'none') return data;

    return [...data].sort((a, b) => {
        const totalA = a.statistics.reactions + 
                      a.statistics.comments + a.statistics.shares;
        const totalB = b.statistics.reactions + 
                      b.statistics.comments + b.statistics.shares;
        
        return sortOrder === 'asc' ? totalA - totalB : totalB - totalA;
    });
};

export const prepareExportData = (data: IAnalysis[], selectedColumns: Column[], sortOrder: SortOrder): ExportData => {
    const sortedData = sortData(data, sortOrder);
    const stats = calculateStats(data);
    
    return { sortedData, stats };
};

export const createExcelData = (data: IAnalysis[], selectedColumns: Column[], t: (key: string) => string) => {
    return data.map(item => {
        const row: any = {};
        selectedColumns.forEach(col => {
            row[t(col.id)] = getCellValue(item, col.id, t);
        });
        return row;
    });
};

export const createStatsData = (stats: ExportStats, selectedColumns: Column[], t: (key: string) => string) => {
    return [
        { [t("statistic")]: t("totalPosts"), [t("value")]: stats.totalPosts.toLocaleString() },
        { [t("statistic")]: t("totalReactions"), [t("value")]: selectedColumns.some(col => col.id === 'reactions') ? stats.totalReactions.toLocaleString() : t("notSelected") },
        { [t("statistic")]: t("totalComments"), [t("value")]: selectedColumns.some(col => col.id === 'comments') ? stats.totalComments.toLocaleString() : t("notSelected") },
        { [t("statistic")]: t("totalShares"), [t("value")]: selectedColumns.some(col => col.id === 'shares') ? stats.totalShares.toLocaleString() : t("notSelected") },
        { [t("statistic")]: t("totalViews"), [t("value")]: selectedColumns.some(col => col.id === 'views') ? stats.totalViews.toLocaleString() : t("notSelected") },
        { [t("statistic")]: t("totalAppearance"), [t("value")]: selectedColumns.some(col => col.id === 'appearance') ? stats.totalAppearance.toLocaleString() : t("notSelected") }
    ];
};

export const calculateColumnWidths = (data: IAnalysis[], selectedColumns: Column[], t: (key: string) => string) => {
    return selectedColumns.map((col) => {
        let maxLength = t(col.id).length;

        data.forEach(item => {
            const cellValue = getCellValue(item, col.id, t);
            maxLength = Math.max(maxLength, cellValue.length);
        });

        return { wch: Math.max(maxLength + COLUMN_WIDTHS.padding, COLUMN_WIDTHS.default) };
    });
};

export const applyExcelStyles = (worksheet: XLSX.WorkSheet, statsStartRow: number, statsDataLength: number) => {
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    
    // Style headers
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!worksheet[cellRef]) continue;
        worksheet[cellRef].s = EXCEL_STYLES.header;
    }

    // Style statistics table
    const statsRange = {
        s: { r: statsStartRow, c: 0 },
        e: { r: statsStartRow + statsDataLength, c: 1 }
    };

    for (let R = statsRange.s.r; R <= statsRange.e.r; ++R) {
        for (let C = statsRange.s.c; C <= statsRange.e.c; ++C) {
            const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
            if (!worksheet[cellRef]) continue;

            worksheet[cellRef].s = R === statsStartRow ? EXCEL_STYLES.statsHeader : EXCEL_STYLES.statsRow;
        }
    }
};

export const generateExcelFile = (data: IAnalysis[], selectedColumns: Column[], sortOrder: SortOrder, t: (key: string) => string) => {
    const { sortedData, stats } = prepareExportData(data, selectedColumns, sortOrder);
    
    // Create main data worksheet
    const excelData = createExcelData(sortedData, selectedColumns, t);
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Add 5 empty rows after main data
    const lastRow = XLSX.utils.decode_range(worksheet['!ref'] || 'A1').e.r;
    for (let i = 0; i < 5; i++) {
        XLSX.utils.sheet_add_aoa(worksheet, [['']], { origin: lastRow + i + 1 });
    }

    // Add statistics table
    const statsStartRow = lastRow + 6;
    const statsData = createStatsData(stats, selectedColumns, t);
    
    // Add statistics headers
    XLSX.utils.sheet_add_aoa(worksheet, [[t("statistic"), t("value")]], { origin: statsStartRow });
    
    // Add statistics data
    statsData.forEach((row, index) => {
        XLSX.utils.sheet_add_aoa(worksheet, [[row[t("statistic")], row[t("value")]]], { 
            origin: statsStartRow + index + 1 
        });
    });

    // Calculate and set column widths
    const wscols = calculateColumnWidths(sortedData, selectedColumns, t);
    wscols.push({ wch: COLUMN_WIDTHS.statistic }); // Statistic name column
    wscols.push({ wch: COLUMN_WIDTHS.default }); // Value column
    worksheet['!cols'] = wscols;

    // Apply styles
    applyExcelStyles(worksheet, statsStartRow, statsData.length);

    // Create workbook and save
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Analysis Data');
    XLSX.writeFile(workbook, `SocialMedia_Montoring_${formatDate({ locale: 'en', withTime: true, date: (new Date()).toLocaleString()})}.xlsx`);
};

// Template management utilities
export const loadTemplates = (): Template[] => {
    const savedTemplates = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedTemplates ? JSON.parse(savedTemplates) : [];
};

export const saveTemplates = (templates: Template[]): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(templates));
};

export const createTemplate = (name: string, columns: Column[]): Template => {
    return {
        id: Date.now().toString(),
        name,
        columns: columns.map(col => col.id)
    };
}; 