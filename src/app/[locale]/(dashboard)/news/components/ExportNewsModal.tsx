import React, { useState, useEffect } from 'react';
import { useTranslations } from "next-intl";
import { X, ArrowRight, Save, Trash2, GripVertical, XCircle } from 'lucide-react';
import { INews } from "@/interfaces/news.types";
import * as XLSX from 'xlsx';
import { formatDate } from "@/utils/formatDateAndTime";

interface ExportNewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: INews[];
}

interface Column {
    id: string;
    label: string;
    selected: boolean;
}

interface Template {
    id: string;
    name: string;
    columns: string[];
}

type SortOrder = 'none' | 'asc' | 'desc';

const ExportNewsModal = ({ isOpen, onClose, data }: ExportNewsModalProps) => {
    const t = useTranslations("NewsPage.AllNewsTable");
    const [availableColumns, setAvailableColumns] = useState<Column[]>([
        { id: 'title', label: t('title'), selected: false },
        { id: 'sector', label: t('sector'), selected: false },
        { id: 'classify', label: t('classify'), selected: false },
        { id: 'geoClassify', label: t('geoClassify'), selected: false },
        { id: 'adType', label: t('adType'), selected: false },
        { id: 'pressType', label: t('pressType'), selected: false },
        { id: 'newspaper', label: t('newspaper'), selected: false },
        { id: 'createdAt', label: t('createdAt'), selected: false },
        { id: 'addedBy', label: t('addedBy'), selected: false },
        { id: 'url', label: t('url'), selected: false }
    ]);
    const [selectedColumns, setSelectedColumns] = useState<Column[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [newTemplateName, setNewTemplateName] = useState('');
    const [draggedItem, setDraggedItem] = useState<Column | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('none');

    useEffect(() => {
        // Load templates from localStorage
        const savedTemplates = localStorage.getItem('newsExportTemplates');
        if (savedTemplates) {
            setTemplates(JSON.parse(savedTemplates));
        }
    }, []);

    const handleColumnSelect = (column: Column) => {
        const newAvailableColumns = availableColumns.map(col => 
            col.id === column.id ? { ...col, selected: !col.selected } : col
        );
        setAvailableColumns(newAvailableColumns);
        
        const selected = newAvailableColumns.filter(col => col.selected);
        setSelectedColumns(selected);
    };

    const handleColumnMove = (column: Column, direction: 'left' | 'right') => {
        if (direction === 'right') {
            const newSelected = [...selectedColumns, column];
            setSelectedColumns(newSelected);
            setAvailableColumns(availableColumns.map(col => 
                col.id === column.id ? { ...col, selected: true } : col
            ));
        } else {
            setSelectedColumns(selectedColumns.filter(col => col.id !== column.id));
            setAvailableColumns(availableColumns.map(col => 
                col.id === column.id ? { ...col, selected: false } : col
            ));
        }
    };

    const handleSaveTemplate = () => {
        if (!newTemplateName) return;

        const newTemplate: Template = {
            id: Date.now().toString(),
            name: newTemplateName,
            columns: selectedColumns.map(col => col.id)
        };

        const updatedTemplates = [...templates, newTemplate];
        setTemplates(updatedTemplates);
        localStorage.setItem('newsExportTemplates', JSON.stringify(updatedTemplates));
        setNewTemplateName('');
    };

    const handleLoadTemplate = (templateId: string) => {
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        const newSelectedColumns = availableColumns
            .filter(col => template.columns.includes(col.id))
            .map(col => ({ ...col, selected: true }));

        setSelectedColumns(newSelectedColumns);
        setAvailableColumns(availableColumns.map(col => ({
            ...col,
            selected: template.columns.includes(col.id)
        })));
    };

    const handleDeleteTemplate = (templateId: string) => {
        const updatedTemplates = templates.filter(t => t.id !== templateId);
        setTemplates(updatedTemplates);
        localStorage.setItem('newsExportTemplates', JSON.stringify(updatedTemplates));
        if (selectedTemplate === templateId) {
            setSelectedTemplate('');
        }
    };

    const handleDragStart = (column: Column) => {
        setDraggedItem(column);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetColumn: Column) => {
        if (!draggedItem) return;

        const draggedIndex = selectedColumns.findIndex(col => col.id === draggedItem.id);
        const targetIndex = selectedColumns.findIndex(col => col.id === targetColumn.id);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const newSelectedColumns = [...selectedColumns];
        const [removed] = newSelectedColumns.splice(draggedIndex, 1);
        newSelectedColumns.splice(targetIndex, 0, removed);

        setSelectedColumns(newSelectedColumns);
        setDraggedItem(null);
    };

    const handleExport = () => {
        if (selectedColumns.length === 0) return;

        // Create main data worksheet
        const worksheet = XLSX.utils.json_to_sheet(
            data.map(item => {
                const row: any = {};
                selectedColumns.forEach(col => {
                    switch (col.id) {
                        case 'title':
                            row[t(col.id)] = item.title;
                            break;
                        case 'sector':
                            row[t(col.id)] = item.sectorData.name;
                            break;
                        case 'classify':
                            row[t(col.id)] = item.classify;
                            break;
                        case 'geoClassify':
                            row[t(col.id)] = item.geoClassify;
                            break;
                        case 'adType':
                            row[t(col.id)] = item.adType;
                            break;
                        case 'pressType':
                            row[t(col.id)] = item.pressType;
                            break;
                        case 'newspaper':
                            row[t(col.id)] = item.newspaper;
                            break;
                        case 'createdAt':
                            row[t(col.id)] = formatDate({ locale: 'en', date: item.createdAt, withTime: true });
                            break;
                        case 'addedBy':
                            row[t(col.id)] = item.addedByData?.name || '';
                            break;
                        case 'url':
                            row[t(col.id)] = item.url;
                            break;
                    }
                });
                return row;
            })
        );

        // Calculate statistics
        const stats = {
            totalNews: data.length,
            totalByClassify: data.reduce((acc, item) => {
                acc[item.classify] = (acc[item.classify] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
            totalByGeoClassify: data.reduce((acc, item) => {
                acc[item.geoClassify] = (acc[item.geoClassify] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
            totalByAdType: data.reduce((acc, item) => {
                acc[item.adType] = (acc[item.adType] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
            totalByPressType: data.reduce((acc, item) => {
                acc[item.pressType] = (acc[item.pressType] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        };

        // Add statistics table
        // const statsData = [
        //     { [t("statistic")]: t("totalNews"), [t("value")]: stats.totalNews },
        //     ...Object.entries(stats.totalByClassify).map(([key, value]) => ({
        //         [t("statistic")]: `${t("classify")}: ${key}`,
        //         [t("value")]: value
        //     })),
        //     ...Object.entries(stats.totalByGeoClassify).map(([key, value]) => ({
        //         [t("statistic")]: `${t("geoClassify")}: ${key}`,
        //         [t("value")]: value
        //     })),
        //     ...Object.entries(stats.totalByAdType).map(([key, value]) => ({
        //         [t("statistic")]: `${t("adType")}: ${key}`,
        //         [t("value")]: value
        //     })),
        //     ...Object.entries(stats.totalByPressType).map(([key, value]) => ({
        //         [t("statistic")]: `${t("pressType")}: ${key}`,
        //         [t("value")]: value
        //     }))
        // ];

        // Add 5 empty rows after main data
        const lastRow = XLSX.utils.decode_range(worksheet['!ref'] || 'A1').e.r;
        for (let i = 0; i < 5; i++) {
            XLSX.utils.sheet_add_aoa(worksheet, [['']], { origin: lastRow + i + 1 });
        }

        // Add statistics table
        const statsStartRow = lastRow + 6;
        
        // Add statistics headers with styling
        // XLSX.utils.sheet_add_aoa(worksheet, [[t("statistic"), t("value")]], { origin: statsStartRow });
        
        // Add statistics data
        // statsData.forEach((row, index) => {
        //     XLSX.utils.sheet_add_aoa(worksheet, [[row[t("statistic")], row[t("value")]]], { 
        //         origin: statsStartRow + index + 1 
        //     });
        // });

        // Calculate column widths based on content
        const wscols = selectedColumns.map((col, index) => {
            const colKey = XLSX.utils.encode_col(index);
            let maxLength = t(col.id).length; // Start with header length

            // Check all data rows
            data.forEach(item => {
                let cellValue = '';
                switch (col.id) {
                    case 'title':
                        cellValue = item.title;
                        break;
                    case 'sector':
                        cellValue = item.sectorData.name;
                        break;
                    case 'classify':
                        cellValue = item.classify;
                        break;
                    case 'geoClassify':
                        cellValue = item.geoClassify;
                        break;
                    case 'adType':
                        cellValue = item.adType;
                        break;
                    case 'pressType':
                        cellValue = item.pressType;
                        break;
                    case 'newspaper':
                        cellValue = item.newspaper || '';
                        break;
                    case 'createdAt':
                        cellValue = formatDate({ locale: 'en', date: item.createdAt, withTime: true }) || "";
                        break;
                    case 'addedBy':
                        cellValue = item.addedByData?.name || '';
                        break;
                    case 'url':
                        cellValue = item.url;
                        break;
                }
                maxLength = Math.max(maxLength, cellValue.length);
            });

            // Add some padding and set minimum width
            return { wch: Math.max(maxLength + 2, 15) };
        });

        // Add width for statistics columns
        wscols.push({ wch: 20 }); // Statistic name column
        wscols.push({ wch: 15 }); // Value column

        worksheet['!cols'] = wscols;

        // Add styles
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        
        // Style headers
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!worksheet[cellRef]) continue;
            
            worksheet[cellRef].s = {
                font: { bold: true },
                alignment: { horizontal: 'center' },
                fill: { fgColor: { rgb: "E2E8F0" } }
            };
        }

        // Style statistics table
        // const statsRange = {
        //     s: { r: statsStartRow, c: 0 },
        //     e: { r: statsStartRow + statsData.length, c: 1 }
        // };

        // for (let R = statsRange.s.r; R <= statsRange.e.r; ++R) {
        //     for (let C = statsRange.s.c; C <= statsRange.e.c; ++C) {
        //         const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        //         if (!worksheet[cellRef]) continue;

        //         worksheet[cellRef].s = {
        //             font: R === statsStartRow ? { bold: true } : {},
        //             alignment: { horizontal: 'center' },
        //             fill: R === statsStartRow ? { fgColor: { rgb: "E2E8F0" } } : {}
        //         };
        //     }
        // }

        // Create workbook and save
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'News Data');
        XLSX.writeFile(workbook, 'news_export.xlsx');
    };

    const toggleSortOrder = () => {
        setSortOrder(current => {
            switch (current) {
                case 'none': return 'desc';
                case 'desc': return 'asc';
                case 'asc': return 'none';
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[800px] max-h-[80vh] overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{t("exportToExcel")}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 flex gap-4 h-[calc(80vh-8rem)]">
                    {/* Left side - Selected columns */}
                    <div className="w-1/2 border rounded-lg p-4 flex flex-col">
                        <div className="mb-4">
                            <h3 className="font-medium mb-2">{t("selectedColumns")}</h3>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {selectedColumns.map(column => (
                                    <div
                                        key={column.id}
                                        draggable
                                        onDragStart={() => handleDragStart(column)}
                                        onDragOver={handleDragOver}
                                        onDrop={() => handleDrop(column)}
                                        className={`flex items-center justify-between bg-gray-50 p-2 rounded cursor-move ${
                                            draggedItem?.id === column.id ? 'opacity-50' : ''
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <GripVertical className="w-4 h-4 text-gray-400" />
                                            <span>{t(column.id)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleColumnMove(column, 'left')}
                                                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-200 rounded"
                                            >
                                                <XCircle size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto">
                            <h3 className="font-medium mb-2">{t("templates")}</h3>
                            <div className="space-y-2">
                                <select
                                    value={selectedTemplate}
                                    onChange={(e) => {
                                        setSelectedTemplate(e.target.value);
                                        if (e.target.value) {
                                            handleLoadTemplate(e.target.value);
                                        }
                                    }}
                                    className="w-full border rounded p-2 text-sm bg-white"
                                >
                                    <option value="">{t("selectTemplate")}</option>
                                    {templates.map(template => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                                {selectedTemplate && (
                                    <button
                                        onClick={() => handleDeleteTemplate(selectedTemplate)}
                                        className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-700 p-2 border border-red-200 rounded"
                                    >
                                        <Trash2 size={16} />
                                        <span>{t("deleteTemplate")}</span>
                                    </button>
                                )}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <input
                                    type="text"
                                    value={newTemplateName}
                                    onChange={(e) => setNewTemplateName(e.target.value)}
                                    placeholder={t("newTemplateName")}
                                    className="flex-1 border rounded p-2 text-sm"
                                />
                                <button
                                    onClick={handleSaveTemplate}
                                    className="bg-primary text-white px-3 py-2 rounded hover:bg-primary/90"
                                >
                                    <Save size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Available columns */}
                    <div className="w-1/2 border rounded-lg p-4">
                        <h3 className="font-medium mb-2">{t("availableColumns")}</h3>
                        <div className="space-y-2 max-h-[calc(80vh-16rem)] overflow-y-auto">
                            {availableColumns.map(column => (
                                <div key={column.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                    <span>{t(column.id)}</span>
                                    <button
                                        onClick={() => handleColumnMove(column, 'right')}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                        {t("cancel")}
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={selectedColumns.length === 0}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
                    >
                        {t("export")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportNewsModal; 