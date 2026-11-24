import React from 'react';
import { useTranslations } from "next-intl";
import {
    Heart,
    MessageCircle,
    Share2,
    Eye,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    TrendingUp,
    LineChart,
    BarChartIcon
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
                <th scope="col" className="px-2 py-1 wtext-start">{t("url")}</th>
                <th scope="col" className="px-2 py-1 text-start">{t("publisher")}</th>
                <th scope="col" className="px-2 py-1 w-40 text-start">{t("sector")}</th>
                <th scope="col" className="px-2 py-1 text-start">{t("classify")}</th>
                <th scope="col" className="px-2 py-1 text-start">{t("analysis")}</th>
                <th scope="col" className="px-2 py-1">
                    <Heart className="w-4 h-4 text-secondary red-500 fill-secondary" />
                </th>
                <th scope="col" className="px-2 py-1">
                    <MessageCircle className="w-4 h-4 text-secondary" />
                </th>
                <th scope="col" className="px-2 py-1">
                    <Share2 className="w-4 h-4 text-secondary" />
                </th>
                <th scope="col" className="px-2 py-1">
                    <Eye className="w-4 h-4 text-secondary" />
                </th>
                <th scope="col" className="px-2 py-1">
                    <BarChartIcon className="w-4 h-4 text-secondary" />
                </th>
                <th scope="col" className="px-2 py-1">
                    <div className="flex items-center gap-1">
                        <span>📊</span>
                        <button
                            onClick={toggleSortOrder}
                            className="hover:bg-gray-200 rounded inline-flex items-center justify-center"
                            title={sortOrder === 'none' ? t("sort") : sortOrder === 'asc' ? t("sortDesc") : t("sortAsc")}
                        >
                            {sortOrder === 'none' && <ArrowUpDown className="text-secondary w-4 h-4" />}
                            {sortOrder === 'asc' && <ArrowUp className="text-secondary w-4 h-4" />}
                            {sortOrder === 'desc' && <ArrowDown className="text-secondary w-4 h-4" />}
                        </button>
                    </div>
                </th>
                <th scope="col" className="px-2 py-1 text-start">{t("publishDate")}</th>
                {/* <th scope="col" className="px-2 py-1 text-start">{t("createdAt")}</th> */}
                <th scope="col" className="px-2 py-1 text-start">{t("addedBy")}</th>
                <th scope="col" className="px-2 py-1 text-start">{t("actions")}</th>
            </tr>
        </thead>
    );
};

export default TableHeader; 