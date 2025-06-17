import React, { useState, useEffect } from 'react';
import { useTranslations } from "next-intl";
import { X, ArrowRight, Save, Trash2, GripVertical, XCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { IAnalysis } from "@/interfaces/analysis.types";
import * as XLSX from 'xlsx';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: IAnalysis[];
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

const ExportModal = ({ isOpen, onClose, data }: ExportModalProps) => {
    const t = useTranslations("SocialMediaPage.ExportModal");
    const [availableColumns, setAvailableColumns] = useState<Column[]>([
        { id: 'url', label: 'URL', selected: false },
        { id: 'platform', label: 'Platform', selected: false },
        { id: 'publisher', label: 'Publisher', selected: false },
        { id: 'sector', label: 'Sector', selected: false },
        { id: 'classify', label: 'Classification', selected: false },
        { id: 'analysis', label: 'Analysis', selected: false },
        { id: 'reactions', label: 'Reactions', selected: false },
        { id: 'comments', label: 'Comments', selected: false },
        { id: 'shares', label: 'Shares', selected: false },
        { id: 'views', label: 'Views', selected: false },
        { id: 'total', label: 'Total', selected: false },
        { id: 'createdAt', label: 'Created At', selected: false },
        { id: 'addedBy', label: 'Added By', selected: false },
    ]);
    const [selectedColumns, setSelectedColumns] = useState<Column[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [newTemplateName, setNewTemplateName] = useState('');
    const [draggedItem, setDraggedItem] = useState<Column | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('none');

    useEffect(() => {
        // Load templates from localStorage
        const savedTemplates = localStorage.getItem('exportTemplates');
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
        localStorage.setItem('exportTemplates', JSON.stringify(updatedTemplates));
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
        localStorage.setItem('exportTemplates', JSON.stringify(updatedTemplates));
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

        // Sort data if total column is selected
        let sortedData = [...data];
        if (selectedColumns.some(col => col.id === 'total')) {
            sortedData.sort((a, b) => {
                const totalA = a.statistics.views + a.statistics.reactions + 
                             a.statistics.comments + a.statistics.shares;
                const totalB = b.statistics.views + b.statistics.reactions + 
                             b.statistics.comments + b.statistics.shares;
                
                if (sortOrder === 'asc') {
                    return totalA - totalB;
                } else if (sortOrder === 'desc') {
                    return totalB - totalA;
                }
                return 0;
            });
        }

        // Create main data worksheet
        const worksheet = XLSX.utils.json_to_sheet(
            sortedData.map(item => {
                const row: any = {};
                selectedColumns.forEach(col => {
                    switch (col.id) {
                        case 'url':
                            row[t(col.id)] = item.url;
                            break;
                        case 'platform':
                            row[t(col.id)] = item.platform;
                            break;
                        case 'publisher':
                            row[t(col.id)] = item.publisher.name;
                            break;
                        case 'sector':
                            row[t(col.id)] = item.sector.name;
                            break;
                        case 'classify':
                            row[t(col.id)] = item.classify;
                            break;
                        case 'analysis':
                            row[t(col.id)] = item.subAnalysis.body;
                            break;
                        case 'reactions':
                            row[t(col.id)] = item.statistics.reactions;
                            break;
                        case 'comments':
                            row[t(col.id)] = item.statistics.comments;
                            break;
                        case 'shares':
                            row[t(col.id)] = item.statistics.shares;
                            break;
                        case 'views':
                            row[t(col.id)] = item.statistics.views;
                            break;
                        case 'total':
                            row[t(col.id)] = item.statistics.views + item.statistics.reactions + 
                                           item.statistics.comments + item.statistics.shares;
                            break;
                        case 'createdAt':
                            row[t(col.id)] = new Date(item.createdAt).toLocaleString();
                            break;
                        case 'addedBy':
                            row[t(col.id)] = item.addedByData?.name || '';
                            break;
                    }
                });
                return row;
            })
        );

        // Calculate statistics
        const stats = {
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

        // Add statistics table
        const statsData = [
            { [t("statistic")]: t("totalPosts"), [t("value")]: stats.totalPosts },
            { [t("statistic")]: t("totalReactions"), [t("value")]: selectedColumns.some(col => col.id === 'reactions') ? stats.totalReactions : t("notSelected") },
            { [t("statistic")]: t("totalComments"), [t("value")]: selectedColumns.some(col => col.id === 'comments') ? stats.totalComments : t("notSelected") },
            { [t("statistic")]: t("totalShares"), [t("value")]: selectedColumns.some(col => col.id === 'shares') ? stats.totalShares : t("notSelected") },
            { [t("statistic")]: t("totalViews"), [t("value")]: selectedColumns.some(col => col.id === 'views') ? stats.totalViews : t("notSelected") },
            { [t("statistic")]: t("totalAppearance"), [t("value")]: stats.totalAppearance }
        ];

        // Add 5 empty rows after main data
        const lastRow = XLSX.utils.decode_range(worksheet['!ref'] || 'A1').e.r;
        for (let i = 0; i < 5; i++) {
            XLSX.utils.sheet_add_aoa(worksheet, [['']], { origin: lastRow + i + 1 });
        }

        // Add statistics table
        const statsStartRow = lastRow + 6;
        
        // Add statistics headers with styling
        XLSX.utils.sheet_add_aoa(worksheet, [[t("statistic"), t("value")]], { origin: statsStartRow });
        
        // Add statistics data
        statsData.forEach((row, index) => {
            XLSX.utils.sheet_add_aoa(worksheet, [[row[t("statistic")], row[t("value")]]], { 
                origin: statsStartRow + index + 1 
            });
        });

        // Calculate column widths based on content
        const wscols = selectedColumns.map((col, index) => {
            const colKey = XLSX.utils.encode_col(index);
            let maxLength = t(col.id).length; // Start with header length

            // Check all data rows
            data.forEach(item => {
                let cellValue = '';
                switch (col.id) {
                    case 'url':
                        cellValue = item.url;
                        break;
                    case 'platform':
                        cellValue = item.platform;
                        break;
                    case 'publisher':
                        cellValue = item.publisher.name;
                        break;
                    case 'sector':
                        cellValue = item.sector.name;
                        break;
                    case 'classify':
                        cellValue = item.classify;
                        break;
                    case 'analysis':
                        cellValue = item.subAnalysis.body;
                        break;
                    case 'reactions':
                        cellValue = item.statistics.reactions.toString();
                        break;
                    case 'comments':
                        cellValue = item.statistics.comments.toString();
                        break;
                    case 'shares':
                        cellValue = item.statistics.shares.toString();
                        break;
                    case 'views':
                        cellValue = item.statistics.views.toString();
                        break;
                    case 'total':
                        cellValue = (item.statistics.views + item.statistics.reactions + 
                                   item.statistics.comments + item.statistics.shares).toString();
                        break;
                    case 'createdAt':
                        cellValue = new Date(item.createdAt).toLocaleString();
                        break;
                    case 'addedBy':
                        cellValue = item.addedByData?.name || '';
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
        const statsRange = {
            s: { r: statsStartRow, c: 0 },
            e: { r: statsStartRow + statsData.length, c: 1 }
        };

        for (let R = statsRange.s.r; R <= statsRange.e.r; ++R) {
            for (let C = statsRange.s.c; C <= statsRange.e.c; ++C) {
                const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
                if (!worksheet[cellRef]) continue;

                worksheet[cellRef].s = {
                    font: R === statsStartRow ? { bold: true } : {},
                    alignment: { horizontal: 'center' },
                    fill: R === statsStartRow ? { fgColor: { rgb: "E2E8F0" } } : {}
                };
            }
        }

        // Create workbook and save
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Analysis Data');
        XLSX.writeFile(workbook, 'analysis_export.xlsx');
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
                                            {column.id === 'total' && (
                                                <button
                                                    onClick={toggleSortOrder}
                                                    className="ml-2 p-1 hover:bg-gray-200 rounded"
                                                >
                                                    {sortOrder === 'none' && <ArrowUpDown size={14} />}
                                                    {sortOrder === 'asc' && <ArrowUp size={14} />}
                                                    {sortOrder === 'desc' && <ArrowDown size={14} />}
                                                </button>
                                            )}
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

export default ExportModal; 