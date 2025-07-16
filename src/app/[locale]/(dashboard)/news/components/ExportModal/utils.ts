import ExcelJS from 'exceljs';
import { Column, Template, SortOrder, ExportStats, ExportData } from './types';
import { LOCAL_STORAGE_KEY, EXCEL_STYLES, COLUMN_WIDTHS } from './constants';
import { formatDate } from '@/utils/formatDateAndTime';
import { INews } from '@/interfaces/news.types';

export const getCellValue = (item: INews, columnId: string, t: (key: string) => string): string => {
    switch (columnId) {
        case 'url':
            return item.url;
        case 'title':
            return item.title;
        case 'sector':
            return item.sectorData.name;
        case 'classify':
            return t(item.classify);
        case 'adType':
            return t(item.adType);
        case 'pressType':
            return t(item.pressType);
        case 'geoClassify':
            return t(item.geoClassify);
        case 'newspaper':
            return item.newspaper;
        case 'createdAt':
            return new Date(item.createdAt).toLocaleString();
        case 'addedBy':
            return item.addedByData?.name || '';
        default:
            return '';
    }
};

export const createExcelData = (data: INews[], selectedColumns: Column[], t: (key: string) => string, locale: string = 'en') => {
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

export const createStatsData = (data: INews[], t: (key: string) => string, locale: string = 'en') => {
    const statsData = [
        { [t("statistic")]: t("totalPosts"), [t("value")]: data.length.toLocaleString() },
    ];
    return locale === 'ar' ? statsData.reverse() : statsData;
};

export const calculateColumnWidths = (data: INews[], selectedColumns: Column[], t: (key: string) => string, locale: string = 'en') => {
    const isRTL = locale === 'ar';
    const orderedColumns = selectedColumns;
    return orderedColumns.map((col) => {
        let maxLength = t(col.id).length;
        data.forEach(item => {
            const cellValue = getCellValue(item, col.id, t);
            maxLength = Math.max(maxLength, cellValue.length);
        });
        
        // Handle URL columns - set maximum width and enable wrapping
        if (col.id === 'url') {
            return { wch: Math.min(maxLength + COLUMN_WIDTHS.padding, 80) }; // Max 50 characters width
        }

        return { wch: Math.max(maxLength + COLUMN_WIDTHS.padding, COLUMN_WIDTHS.default) };
    });
};

export const applyExcelStyles = (worksheet: ExcelJS.Worksheet, statsStartRow: number, statsDataLength: number, locale: string = 'en', t: (key: string) => string) => {
    const isRTL = locale === 'ar';
    worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
        row.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
            if (rowNumber === 1) {
                cell.font = { bold: true };
                cell.alignment = { horizontal: isRTL ? 'right' : 'left', vertical: 'middle' };
            } else if (rowNumber >= statsStartRow + 1 && colNumber <= 2) {
                cell.font = { italic: rowNumber === statsStartRow + 1 };
                cell.alignment = { horizontal: isRTL ? 'right' : 'left', vertical: 'middle' };
            } else {
                cell.alignment = { horizontal: isRTL ? 'right' : 'left', vertical: 'middle' };
            }
            
            // Apply text wrapping for URL columns
            const header = worksheet?.getRow(1)?.getCell(colNumber)?.value as any;
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
    data: INews[],
    selectedColumns: Column[],
    sortOrder: SortOrder,
    t: (key: string) => string,
    locale: string = 'en'
) => {
    const isRTL = locale === 'ar';
    const orderedColumns = selectedColumns;

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('News Data');

    // Prepare header row
    const headerRow = orderedColumns.map(col => t(col.id));
    worksheet.addRow(headerRow);

    // Add data rows
    data.forEach((item, rowIndex) => {
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
    const statsStartRow = worksheet.rowCount + 1;
    const statsData = createStatsData(data, t, locale);
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
    const wscols = calculateColumnWidths(data, selectedColumns, t, locale);
    worksheet.columns = [
        ...wscols.map(w => ({ width: w.wch })),
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
    a.download = `News_Montoring_${formatDate({ locale: 'en', withTime: true, date: (new Date()).toLocaleString() })}.xlsx`;
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