import React from 'react';
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Column } from './types';

interface AvailableColumnsProps {
    availableColumns: Column[];
    onColumnMove: (column: Column) => void;
}

const AvailableColumns: React.FC<AvailableColumnsProps> = ({
    availableColumns,
    onColumnMove
}) => {
    const t = useTranslations("SocialMediaPage.ExportModal");
    const locale = useLocale();

    // Filter to show only unselected columns
    const unselectedColumns = availableColumns.filter(col => !col.selected);

    return (
        <div className="w-1/2 border rounded-lg px-2 py-1">
            <h3 className="font-medium mb-2">{t("availableColumns")}</h3>
            <div className="space-y-1 max-h-[calc(80vh-12rem)] overflow-y-auto">
                {unselectedColumns.map(column => (
                    <div key={column.id} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                        <span>{t(column.id)}</span>
                        <button
                            onClick={() => onColumnMove(column)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {locale === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvailableColumns; 