import ExcelJS from 'exceljs';
import { Column, Template, SortOrder, ExportStats, ExportData } from './types';
import { LOCAL_STORAGE_KEY, EXCEL_STYLES, COLUMN_WIDTHS } from './constants';
import { formatDate } from '@/utils/formatDateAndTime';
import { IMonitorResult } from '../types';

export const getCellValue = (result: IMonitorResult, columnId: string, t: (key: string) => string, locale: string): string | number => {
    switch (columnId) {
        case 'platform':
            return t(result.platform);
            break;
        case 'authorName':
            return `"${result.author.name}"`;
            break;
        case 'authorHandle':
            return `@"${result.author.handle}"`;
            break;
        case 'content':
            return `"${result.content.text.replace(/"/g, '""')}"`;
            break;
        case 'sentiment':
            return t(result.sentiment);
            break;
        case 'language':
            return result.language ? t(result.language) : '';
            break;
        case 'reactions':
            return (result.interactions.reactions || 0).toLocaleString();
            break;
        case 'comments':
            return (result.interactions.comments || 0).toLocaleString();
            break;
        case 'shares':
            return (result.interactions.shares || 0).toLocaleString();
            break;
        case 'total':
            return ((result.interactions.reactions || 0) + (result.interactions.comments || 0) + (result.interactions.shares || 0)).toLocaleString();
            break;
        case 'retweets':
            return (result.interactions.retweets || 0).toLocaleString();
            break;
        case 'quotes':
            return (result.interactions.quotes || 0).toLocaleString();
            break;
        case 'reposts':
            return (result.interactions.reposts || 0).toLocaleString();
            break;
        case 'saves':
            return (result.interactions.saves || 0).toLocaleString();
            break;
        case 'votes':
            return (result.interactions.shares || 0).toLocaleString();
            break;
        case 'downloads':
            return (result.interactions.downloads || 0).toLocaleString();
            break;
        case 'bookmarks':
            return (result.interactions.bookmarks || 0).toLocaleString();
            break;
        case 'views':
            return (result.interactions.views || 0).toLocaleString();
            break;
        case 'publishDate':
            return new Date(result.publishAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US');
            break;
        case 'url':
            return result.url;
            break;
        case 'location':
            return result.location?.address || '';
            break;
        case 'authorAge':
            return result.author?.age?.toString() || '';
            break;
        case 'authorGender':
            return result.author?.gender ? t(result.author.gender) : '';
            break;
        case 'verified':
            return result.author?.isVerified ? (result.author.isVerified ? t('yes') : t('no') ) : '';
            break;
        case 'mediaCount':
            return ((result.content.images?.length || 0) + (result.content.videos?.length || 0)).toLocaleString();
            break;
        default:
            return '';
    }
};

export const calculateStats = (data: IMonitorResult[]): ExportStats => {
    return {
        totalPosts: data.length,
        totalReactions: data.reduce((sum, item) => sum + (item.interactions?.reactions || 0), 0),
        totalComments: data.reduce((sum, item) => sum + (item.interactions?.comments || 0), 0),
        totalShares: data.reduce((sum, item) => sum + (item.interactions?.shares || 0), 0),
        totalViews: data.reduce((sum, item) => sum + (item.interactions?.views|| 0), 0),
        totalInteractions: data.reduce((sum, item) => 
            sum + (item.interactions?.reactions || 0) + (item.interactions?.comments  || 0) + (item.interactions?.shares|| 0)
        , 0),
    };
};

export const sortData = (data: IMonitorResult[], sortOrder: SortOrder): IMonitorResult[] => {
    if (sortOrder === 'none') return data;

    return [...data].sort((a, b) => {
        const totalA = (a.interactions?.reactions || 0) + 
                      (a.interactions?.comments || 0) + (a.interactions?.shares || 0);
        const totalB = (b.interactions?.reactions || 0) + 
                      (b.interactions?.comments || 0) + (b.interactions?.shares || 0);
        
        return sortOrder === 'asc' ? totalA - totalB : totalB - totalA;
    });
};

export const prepareExportData = (data: IMonitorResult[], selectedColumns: Column[], sortOrder: SortOrder): ExportData => {
    const sortedData = sortData(data, sortOrder);
    const stats = calculateStats(data);
    
    return { sortedData, stats };
};

export const createExcelData = (data: IMonitorResult[], selectedColumns: Column[], t: (key: string) => string, locale: string = 'en') => {
    const isRTL = locale === 'ar';
    const orderedColumns = selectedColumns;
    
    return data.map(item => {
        const row: any = {};
        orderedColumns.forEach(col => {
            row[t(col.id)] = getCellValue(item, col.id, t, locale);
        });
        return row;
    });
};

export const createStatsData = (stats: ExportStats, selectedColumns: Column[], t: (key: string) => string, locale: string = 'en') => {
    const statsData = [
        { [t("interactions")]: t("totalPosts"), [t("value")]: stats.totalPosts },
        { [t("interactions")]: t("totalInteractions"), [t("value")]: stats.totalInteractions },
        { [t("interactions")]: t("totalReactions"), [t("value")]: selectedColumns.some(col => col.id === 'reactions') ? stats.totalReactions : t("notSelected") },
        { [t("interactions")]: t("totalComments"), [t("value")]: selectedColumns.some(col => col.id === 'comments') ? stats.totalComments : t("notSelected") },
        { [t("interactions")]: t("totalShares"), [t("value")]: selectedColumns.some(col => col.id === 'shares') ? stats.totalShares: t("notSelected") },
        { [t("interactions")]: t("totalViews"), [t("value")]: selectedColumns.some(col => col.id === 'views') ? stats.totalViews : t("notSelected") }
    ];
    
    // Reverse the order for RTL layout
    return statsData //locale === 'ar' ? statsData.reverse() : statsData;
};

export const calculateColumnWidths = (data: IMonitorResult[], selectedColumns: Column[], t: (key: string) => string, locale: string = 'en') => {
    const isRTL = locale === 'ar';
    const orderedColumns = selectedColumns;
    
    return orderedColumns.map((col) => {
        let maxLength = t(col.id).length;

        data.forEach(item => {
            const cellValue = getCellValue(item, col.id, t, locale);
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
    const numberColumnIds = ['reactions', 'comments', 'shares', 'views', 'total', 'totalPosts', 'totalInteractions', 'totalReactions', 'totalComments', 'totalShares', 'totalViews'];
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
    data: IMonitorResult[],
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
        const row = orderedColumns.map(col => getCellValue(item, col.id, t, locale));
        const addedRow = worksheet.addRow(row);
        
        // Add hyperlinks for URL columns
        orderedColumns.forEach((col, colIndex) => {
            if (col.id === 'url') {
                const cell = addedRow.getCell(colIndex + 1);
                const url = getCellValue(item, col.id, t, locale);
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
    const statsHeader = locale === 'ar' ? [t('interactionsTotal'), t('value')] : [t('value'), t('interactionsTotal')];
    worksheet.addRow(statsHeader);
    statsData.forEach(row => {
        const dataRow = locale === 'ar'
            ? [row[t('interactionsTotal')], row[t('value')]]
            : [row[t('value')], row[t('interactionsTotal')]];
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
    a.download = `Keywords_Montoring_${formatDate({ locale: 'en', withTime: true, date: (new Date()).toLocaleString() })}.xlsx`;
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