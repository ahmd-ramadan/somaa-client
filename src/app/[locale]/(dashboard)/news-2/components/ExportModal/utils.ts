import * as XLSX from 'xlsx';
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

export const createExcelData = (data: INews[], selectedColumns: Column[], t: (key: string) => string) => {
    return data.map(item => {
        const row: any = {};
        selectedColumns.forEach(col => {
            row[t(col.id)] = getCellValue(item, col.id, t);
        });
        return row;
    });
};

export const createStatsData = (data: INews[], t: (key: string) => string) => {
    return [
        { [t("statistic")]: t("totalPosts"), [t("value")]: data.length.toLocaleString() },
    ];
};

export const calculateColumnWidths = (data: INews[], selectedColumns: Column[], t: (key: string) => string) => {
    return selectedColumns.map((col) => {
        let maxLength = t(col.id).length;

        data.forEach(item => {
            const cellValue = getCellValue(item, col.id, t);
            maxLength = Math.max(maxLength, cellValue.length);
        });

        return { wch: Math.max(Math.min(maxLength + COLUMN_WIDTHS.padding, 20), COLUMN_WIDTHS.default) };
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

export const generateExcelFile = (data: INews[], selectedColumns: Column[], sortOrder: SortOrder, t: (key: string) => string) => {

    // Create main data worksheet
    const excelData = createExcelData(data, selectedColumns, t);
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Add 5 empty rows after main data
    const lastRow = XLSX.utils.decode_range(worksheet['!ref'] || 'A1').e.r;
    for (let i = 0; i < 5; i++) {
        XLSX.utils.sheet_add_aoa(worksheet, [['']], { origin: lastRow + i + 1 });
    }

    // Add statistics table
    const statsStartRow = lastRow + 6;
    const statsData = createStatsData(data, t);
    
    // Add statistics headers
    XLSX.utils.sheet_add_aoa(worksheet, [[t("statistic"), t("value")]], { origin: statsStartRow });
    
    // Add statistics data
    statsData.forEach((row, index) => {
        XLSX.utils.sheet_add_aoa(worksheet, [[row[t("statistic")], row[t("value")]]], { 
            origin: statsStartRow + index + 1 
        });
    });

    // Calculate and set column widths
    const wscols = calculateColumnWidths(data, selectedColumns, t);
    wscols.push({ wch: COLUMN_WIDTHS.statistic }); // Statistic name column
    wscols.push({ wch: COLUMN_WIDTHS.default }); // Value column
    worksheet['!cols'] = wscols;

    // Apply styles
    applyExcelStyles(worksheet, statsStartRow, statsData.length);

    // Create workbook and save
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'News Data');
    XLSX.writeFile(workbook, `News_Montoring_${formatDate({ locale: 'en', withTime: true, date: (new Date()).toLocaleString()})}.xlsx`);
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