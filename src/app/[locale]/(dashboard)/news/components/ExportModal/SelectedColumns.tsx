import React from 'react';
import { useTranslations, useLocale } from "next-intl";
import { GripVertical, XCircle, ArrowUpDown, ArrowUp, ArrowDown, ArrowRight, ArrowLeft } from 'lucide-react';
import { Column, SortOrder } from './types';

interface SelectedColumnsProps {
    selectedColumns: Column[];
    draggedItem: Column | null;
    sortOrder: SortOrder;
    onDragStart: (column: Column) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (column: Column) => void;
    onColumnMove: (column: Column) => void;
    onToggleSort: () => void;
}

const SelectedColumns: React.FC<SelectedColumnsProps> = ({
    selectedColumns,
    draggedItem,
    sortOrder,
    onDragStart,
    onDragOver,
    onDrop,
    onColumnMove,
    onToggleSort
}) => {
    const t = useTranslations("NewsPage.ExportModal");
    const locale = useLocale();

    return (
        <div className="mb-1">
            <h3 className="font-medium mb-1">{t("selectedColumns")}</h3>
            <div className="space-y-1 max-h-[240px] overflow-y-auto">
                {selectedColumns.map(column => (
                    <div
                        key={column.id}
                        draggable
                        onDragStart={() => onDragStart(column)}
                        onDragOver={onDragOver}
                        onDrop={() => onDrop(column)}
                        className={`flex items-center justify-between bg-gray-50 py-1 px-2 rounded cursor-move ${
                            draggedItem?.id === column.id ? 'opacity-50' : ''
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <GripVertical className="w-3.5 h-3.5 text-gray-400" />
                            <span>{t(column.id)}</span>
                            {column.id === 'total' && (
                                <button
                                    onClick={onToggleSort}
                                    className="ml-2 hover:bg-gray-200 rounded"
                                >
                                    {sortOrder === 'none' && <ArrowUpDown size={14} />}
                                    {sortOrder === 'asc' && <ArrowUp size={14} />}
                                    {sortOrder === 'desc' && <ArrowDown size={14} />}
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => onColumnMove(column)}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                            >
                                {locale === 'ar' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SelectedColumns; 