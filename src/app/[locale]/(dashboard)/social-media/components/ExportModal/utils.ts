import ExcelJS from 'exceljs';
import { IAnalysis } from "@/interfaces/analysis.types";
import { ContentTypesEnum, TweetTypesEnum } from "@/interfaces/analysis.types";
import { Column, Template, SortOrder, ExportStats, ExportData } from './types';
import { LOCAL_STORAGE_KEY, EXCEL_STYLES, COLUMN_WIDTHS } from './constants';
import { formatDate } from '@/utils/formatDateAndTime';

export const getCellValue = (item: IAnalysis, columnId: string, t: (key: string) => string): string | number => {
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
            return item.statistics.reactions; 
        case 'comments':
            return item.statistics.comments; 
        case 'shares':
            return item.statistics.shares; 
        case 'views':
            return item.statistics.views;
        case 'appearance':
            return item.statistics.appearance; 
        case 'total':
            return (item.statistics.reactions + 
                   item.statistics.comments + item.statistics.shares)
        case 'publishDate':
            return item.publishDate ? new Date(item.publishDate).toLocaleString() : '';
        case 'createdAt':
            return new Date(item.createdAt).toLocaleString();
        case 'addedBy':
            return item.addedByData?.name || '';
        case 'tweetType':
            return t(item?.tweetType) || t(TweetTypesEnum.TWEET);
        case 'contentType':
            return t(item?.content?.type) || t(ContentTypesEnum.TEXT);
        case 'isRelated':
            return item.isRelated ? t('internal') : t('external');
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
        totalAppearance: data.reduce((sum, item) => sum + item.statistics.appearance, 0),
        totalStatistics: data.reduce((sum, item) => 
            sum + item.statistics.reactions + 
            item.statistics.comments + item.statistics.shares, 0
        ),
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

export const createExcelData = (data: IAnalysis[], selectedColumns: Column[], t: (key: string) => string, locale: string = 'en') => {
    const isRTL = locale === 'ar';
    const orderedColumns = selectedColumns;
    
    return data.map(item => {
        const row: any = {};
        orderedColumns.forEach(col => {
            row[t(col.id)] = getCellValue(item, col.id, t);
        });
        return row;
    });
};

export const createStatsData = (stats: ExportStats, selectedColumns: Column[], t: (key: string) => string, locale: string = 'en') => {
    const statsData = [
        { [t("statistic")]: t("totalPosts"), [t("value")]: stats.totalPosts },
        { [t("statistic")]: t("totalStatistics"), [t("value")]: stats.totalStatistics },
        { [t("statistic")]: t("totalReactions"), [t("value")]: selectedColumns.some(col => col.id === 'reactions') ? stats.totalReactions : t("notSelected") },
        { [t("statistic")]: t("totalComments"), [t("value")]: selectedColumns.some(col => col.id === 'comments') ? stats.totalComments : t("notSelected") },
        { [t("statistic")]: t("totalShares"), [t("value")]: selectedColumns.some(col => col.id === 'shares') ? stats.totalShares: t("notSelected") },
        { [t("statistic")]: t("totalViews"), [t("value")]: selectedColumns.some(col => col.id === 'views') ? stats.totalViews : t("notSelected") },
        { [t("statistic")]: t("totalAppearance"), [t("value")]: selectedColumns.some(col => col.id === 'appearance') ? stats.totalAppearance : t("notSelected") }
    ];
    
    // Reverse the order for RTL layout
    return statsData //locale === 'ar' ? statsData.reverse() : statsData;
};

export const calculateColumnWidths = (data: IAnalysis[], selectedColumns: Column[], t: (key: string) => string, locale: string = 'en') => {
    const isRTL = locale === 'ar';
    const orderedColumns = selectedColumns;
    
    return orderedColumns.map((col) => {
        let maxLength = t(col.id).length;

        data.forEach(item => {
            const cellValue = getCellValue(item, col.id, t);
            maxLength = Math.max(maxLength, cellValue.toString().length);
        });

        // Handle URL columns - set maximum width and enable wrapping
        if (col.id === 'url') {
            return { wch: Math.min(maxLength + COLUMN_WIDTHS.padding, 80)}; // Max 50 characters width
        }

        return { wch: Math.max(maxLength + COLUMN_WIDTHS.padding, COLUMN_WIDTHS.default) };
    });
};

export const applyExcelStyles = (worksheet: ExcelJS.Worksheet, statsStartRow: number, statsDataLength: number, locale: string = 'en', t: (key: string) => string) => {
    const isRTL = locale === 'ar';
    const numberColumnIds = ['reactions', 'comments', 'shares', 'views', 'appearance', 'total', 'totalPosts', 'totalStatistics', 'totalReactions', 'totalComments', 'totalShares', 'totalViews', 'totalAppearance'];
    const currentHeaderValues = numberColumnIds.map(id => t(id))
    // Style all cells (headers, data, stats, including empty)
    worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
        row.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
            // Header row
            if (rowNumber === 1) {
                cell.font = { bold: true };
                cell.alignment = { horizontal: isRTL ? 'right' : 'left', vertical: 'middle' };
            } else if (rowNumber >= statsStartRow + 1 && colNumber <= 2) {
                // Statistics table
                cell.font = { italic: rowNumber === statsStartRow + 1 };
                cell.alignment = { horizontal: isRTL ? 'right' : 'left', vertical: 'middle' };
            } else {
                // Data rows
                cell.alignment = { horizontal: isRTL ? 'right' : 'left', vertical: 'middle' };
            }
            // Apply number format if this column is numeric
            const header = worksheet?.getRow(1)?.getCell(colNumber)?.value as any;
            // console.log(header, cell.value, currentHeaderValues.includes(cell?.value as string))
            if (currentHeaderValues.includes(header)) {
              cell.numFmt = '#,##0';
            }
            
            // Apply text wrapping for URL columns
            if (header === t('url')) {
                cell.alignment = { 
                    ...cell.alignment, 
                    wrapText: true,
                    vertical: 'top'
                };
            }
        });
    });
};

export const generateExcelFile = async (
    data: IAnalysis[],
    selectedColumns: Column[],
    sortOrder: SortOrder,
    t: (key: string) => string,
    locale: string = 'en'
) => {
    const { sortedData, stats } = prepareExportData(data, selectedColumns, sortOrder);
    const isRTL = locale === 'ar';
    const orderedColumns = selectedColumns;

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Analysis Data');

    // Prepare header row
    const headerRow = orderedColumns.map(col => t(col.id));
    worksheet.addRow(headerRow);

    // Add data rows
    sortedData.forEach((item, rowIndex) => {
        const row = orderedColumns.map(col => getCellValue(item, col.id, t));
        const addedRow = worksheet.addRow(row);
        
        // Add hyperlinks for URL columns
        orderedColumns.forEach((col, colIndex) => {
            if (col.id === 'url') {
                const cell = addedRow.getCell(colIndex + 1);
                const url = getCellValue(item, col.id, t);
                if (typeof url === 'string') {
                    cell.value = { text: url, hyperlink: url };
                }
            }
        });
    });


    // Add 5 empty rows
    for (let i = 0; i < 5; i++) {
        worksheet.addRow([]);
    }

    // Add statistics table (with swapped columns for Arabic)
    // في الوضع العربي: [القيمة, الإحصائية]، في الإنجليزي: [الإحصائية, القيمة]
    const statsStartRow = worksheet.rowCount + 1;
    const statsData = createStatsData(stats, selectedColumns, t, locale);
    const statsHeader = locale === 'ar' ? [t('statistic'), t('value')] : [t('value'), t('statistic')];
    worksheet.addRow(statsHeader);
    statsData.forEach(row => {
        const dataRow = locale === 'ar'
            ? [row[t('statistic')], row[t('value')]]
            : [row[t('value')], row[t('statistic')]];
        worksheet.addRow(dataRow);
    });
    // Set stats columns widths clearly
    if (locale === 'ar') {
        worksheet.getColumn(orderedColumns.length + 1).width = 20; // value
        worksheet.getColumn(orderedColumns.length + 2).width = 30; // statistic
    } else {
        worksheet.getColumn(orderedColumns.length + 1).width = 30; // statistic
        worksheet.getColumn(orderedColumns.length + 2).width = 20; // value
    }

    // Set column widths
    const wscols = calculateColumnWidths(sortedData, selectedColumns, t, locale);
    worksheet.columns = [
        ...wscols.map(w => ({ width: w.wch })),
        // Add stats columns widths
        ...(locale === 'ar'
            ? [{ width: 20 }, { width: 30 }]
            : [{ width: 30 }, { width: 20 }])
    ];

    // Apply styles
    applyExcelStyles(worksheet, statsStartRow - 1, statsData.length, locale, t);

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SocialMedia_Montoring_${formatDate({ locale: 'en', withTime: true, date: (new Date()).toLocaleString() })}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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