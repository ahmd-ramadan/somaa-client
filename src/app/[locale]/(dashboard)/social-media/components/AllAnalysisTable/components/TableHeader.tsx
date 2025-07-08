import React from 'react';
import { useTranslations } from "next-intl";
import { 
    Heart, 
    MessageCircle, 
    Share2, 
    Eye, 
    ArrowUpDown,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface TableHeaderProps {
    selectedItems: Set<string>;
    allAnalysis: any[];
    setSelectedItems: (items: Set<string>) => void;
    setSelectedGroups: (groups: Set<string>) => void;
    groupedAnalysis: any[];
    sortOrder: 'none' | 'asc' | 'desc';
    toggleSortOrder: () => void;
    t: (key: string) => string;
}

const TableHeader: React.FC<TableHeaderProps> = ({
    selectedItems,
    allAnalysis,
    setSelectedItems,
    setSelectedGroups,
    groupedAnalysis,
    sortOrder,
    toggleSortOrder,
    t
}) => {
    return (
        <thead className="bg-primary/20 text-semibold text-sm text-primary">
            <tr>
                <th scope="col" className="px-2 py-1 w-10">
                    <Checkbox
                        checked={selectedItems.size === allAnalysis.length}
                        onCheckedChange={(checked: boolean) => {
                            if (checked) {
                                const allIds = new Set(allAnalysis.map(item => item._id));
                                setSelectedItems(allIds);
                                setSelectedGroups(new Set(Object.keys(groupedAnalysis)));
                            } else {
                                setSelectedItems(new Set());
                                setSelectedGroups(new Set());
                            }
                        }}
                    />
                </th>
                <th scope="col" className="px-2 py-1">{t("url")}</th>
                <th scope="col" className="px-2 py-1">{t("publisher")}</th>
                <th scope="col" className="px-2 py-1">{t("sector")}</th>
                <th scope="col" className="px-2 py-1">{t("classify")}</th>
                <th scope="col" className="px-2 py-1">{t("analysis")}</th>
                <th scope="col" className="px-2 py-1">
                    <Heart className="w-4 h-4 text-red-500 fill-red-600" />
                </th>
                <th scope="col" className="px-2 py-1">
                    <MessageCircle className="w-4 h-4 text-green-500 fill-green-600" />
                </th>
                <th scope="col" className="px-2 py-1">
                    <Share2 className="w-4 h-4 text-black fill-balck" />
                </th>
                <th scope="col" className="px-2 py-1">
                    <Eye className="w-4 h-4 text-secondary" />
                </th>
                <th scope="col" className="px-2 py-1">
                    <div className="flex items-center gap-1">
                        <span>🧾</span>
                        <button
                            onClick={toggleSortOrder}
                            className="p-1 hover:bg-gray-200 rounded inline-flex items-center justify-center"
                            title={sortOrder === 'none' ? t("sort") : sortOrder === 'asc' ? t("sortDesc") : t("sortAsc")}
                        >
                            {sortOrder === 'none' && <ArrowUpDown className="w-4 h-4" />}
                            {sortOrder === 'asc' && <ArrowUp className="w-4 h-4" />}
                            {sortOrder === 'desc' && <ArrowDown className="w-4 h-4" />}
                        </button>
                    </div>
                </th>
                <th scope="col" className="px-2 py-1">{t("createdAt")}</th>
                <th scope="col" className="px-2 py-1">{t("addedBy")}</th>
                <th scope="col" className="px-2 py-1">{t("actions")}</th>
            </tr>
        </thead>
    );
};

export default TableHeader; 