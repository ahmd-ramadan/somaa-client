import React from 'react';
import { INews } from "@/interfaces/news.types";
import { GroupedNewsData } from '../types';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { 
    getTotalItemsInGroup, 
    getAllItemsInGroup, 
    getBackgroundColor, 
    getBorderColor, 
    getTextColor, 
    getConnectorColor, 
    getGroupingTypeLabel, 
    getIndentation, 
    getGroupingKey
} from '../utils/tableUtils';

interface GroupHeaderProps {
    group: GroupedNewsData;
    level: number;
    collapsedGroups: Record<string, boolean>;
    selectedItems: Set<string>;
    selectedGroups: Set<string>;
    handleGroupSelect: (groupKey: string, items: INews[]) => void;
    isGroupFullySelected: (groupKey: string, items: INews[]) => boolean;
    isGroupPartiallySelected: (groupKey: string, items: INews[]) => boolean;
    toggleGroup: (groupKey: string) => void;
    t: (key: string) => string;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({
    group,
    level,
    collapsedGroups,
    selectedItems,
    selectedGroups,
    handleGroupSelect,
    isGroupFullySelected,
    isGroupPartiallySelected,
    toggleGroup,
    t
}) => {
    const isCollapsed = collapsedGroups[group.key];
    const hasChildren = group.children.length > 0;
    const hasItems = group.items.length > 0;
    const totalItems = getTotalItemsInGroup(group);
    const groupingType = getGroupingTypeLabel(group.key, level, t);
    const connectorColor = getConnectorColor(level);
    const isNoGrouping = group.key === 'all-data';
    const currentIndentation = getIndentation(level);
    const groupKey = getGroupingKey(group.key, level);
    
    return (
        <tr className={`${getBackgroundColor(level)} border-l-4 ${getBorderColor(level)}`}>
            <td colSpan={14} className="px-2 py-1 text-xs font-medium">
                <div className="flex items-center gap-2" style={{ paddingLeft: `${currentIndentation}px` }}>
                    {/* Visual connector for nested levels */}
                    {level > 0 && (
                        <div className="flex items-center">
                            <div 
                                className={`h-px ${connectorColor}`} 
                                style={{ width: `${currentIndentation}px` }}
                            ></div>
                            <div className={`w-2 h-2 ${connectorColor} rounded-full`}></div>
                        </div>
                    )}
                    
                    <Checkbox
                        checked={isGroupFullySelected(group.key, getAllItemsInGroup(group))}
                        onCheckedChange={() => handleGroupSelect(group.key, getAllItemsInGroup(group))}
                        className={isGroupPartiallySelected(group.key, getAllItemsInGroup(group)) ? "opacity-50" : ""}
                    />
                    
                    {(hasChildren || hasItems) && !isNoGrouping && (
                        <button
                            onClick={() => toggleGroup(group.key)}
                            className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            {isCollapsed ? (
                                <ChevronRight className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </button>
                    )}
                    
                    <div className="flex items-center gap-2">
                        <span className={`font-semibold ${getTextColor(level)}`}>{
                            groupKey === 'adType' ||
                            groupKey === 'classify' ||
                            groupKey === 'pressType' ||
                            groupKey === 'geoClassify' ?
                            t(group.label) : group.label
                        }</span>
                        <span className="text-gray-500">({totalItems})</span>
                        {level > 0 && (
                            <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-full">
                                {groupingType}
                            </span>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default GroupHeader; 