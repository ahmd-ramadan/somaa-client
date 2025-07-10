import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface TableHeaderProps {
    selectedItems: Set<string>;
    allNews: any[];
    setSelectedItems: (items: Set<string>) => void;
    setSelectedGroups: (groups: Set<string>) => void;
    groupedNews: any[];
    t: (key: string) => string;
}

const TableHeader: React.FC<TableHeaderProps> = ({
    selectedItems,
    allNews,
    setSelectedItems,
    setSelectedGroups,
    groupedNews,
    t
}) => {
    return (
        <thead className="bg-primary/20 text-semibold text-sm text-primary">
            <tr>
                <th scope="col" className="px-2 py-1 w-10">
                    <Checkbox
                        checked={selectedItems.size === allNews.length}
                        onCheckedChange={(checked: boolean) => {
                            if (checked) {
                                const allIds = new Set(allNews.map(item => item._id));
                                setSelectedItems(allIds);
                                setSelectedGroups(new Set(Object.keys(groupedNews)));
                            } else {
                                setSelectedItems(new Set());
                                setSelectedGroups(new Set());
                            }
                        }}
                    />
                </th>
                <th scope="col" className="px-2 py-1 text-start">{t("title")}</th>
                <th scope="col" className="px-2 py-1 text-start">{t("sector")}</th>
                <th scope="col" className="px-2 py-1 text-start">{t("classify")}</th>
                <th scope="col" className="px-2 py-1 text-start">{t("adType")}</th>
                <th scope="col" className="px-2 py-1 text-start">{t("pressType")}</th>
                <th scope="col" className="px-2 py-1 text-start">{t("geoClassify")}</th>
                <th scope="col" className="px-2 py-1 text-start">{t("newspaper")}</th>
                <th scope="col" className="px-2 py-1 text-start">{t("createdAt")}</th>
                <th scope="col" className="px-2 py-1 text-start">{t("addedBy")}</th>
                <th scope="col" className="px-2 py-1 text-start">{t("actions")}</th>
            </tr>
        </thead>
    );
};

export default TableHeader; 