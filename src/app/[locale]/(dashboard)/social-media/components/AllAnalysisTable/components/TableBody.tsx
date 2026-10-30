import React, { useMemo } from 'react';
import { IAnalysis } from "@/interfaces/analysis.types";
import { GroupedAnalysisData, GroupingState } from '../types';
import TableRow from './TableRow';
import GroupHeader from './GroupHeader';
import { UserRoleTypes } from '@/types';

interface TableBodyProps {
    groupedAnalysis: GroupedAnalysisData[];
    collapsedGroups: Record<string, boolean>;
    selectedItems: Set<string>;
    selectedGroups: Set<string>;
    groupings?: GroupingState;
    toggleGroupSort?: (key: string) => void;
    handleItemSelect: (itemId: string) => void;
    handleGroupSelect: (groupKey: string, items: IAnalysis[]) => void;
    isGroupFullySelected: (groupKey: string, items: IAnalysis[]) => boolean;
    isGroupPartiallySelected: (groupKey: string, items: IAnalysis[]) => boolean;
    toggleGroup: (groupKey: string) => void;
    openDetailsModal: (analysis: IAnalysis) => void;
    openDeleteModal: (analysis: IAnalysis) => void;
    openViewModal: (analysis: IAnalysis) => void;
    role: UserRoleTypes;
    permissions: any;
    userId: string;
    t: (key: string) => string;
}

const TableBody: React.FC<TableBodyProps> = ({
    groupedAnalysis,
    collapsedGroups,
    selectedItems,
    selectedGroups,
    groupings,
    toggleGroupSort,
    handleItemSelect,
    handleGroupSelect,
    isGroupFullySelected,
    isGroupPartiallySelected,
    toggleGroup,
    openDetailsModal,
    openDeleteModal,
    openViewModal,
    role,
    permissions,
    userId,
    t
}) => {
    // Memoized render function for better performance
    const renderNestedGroups = useMemo(() => {
        const renderGroups = (groups: GroupedAnalysisData[], level: number = 0): React.ReactNode[] => {
            return groups.map(group => {
                const isCollapsed = collapsedGroups[group.key];
                const hasChildren = group.children.length > 0;
                const hasItems = group.items.length > 0;
                const isNoGrouping = group.key === 'all-data';
                
                return (
                    <React.Fragment key={group.key}>
                        {/* Group Header Row - Only show if not "all-data" or if it has children */}
                        {(!isNoGrouping || hasChildren) && (
                            <GroupHeader
                                group={group}
                                level={level}
                                collapsedGroups={collapsedGroups}
                                selectedItems={selectedItems}
                                selectedGroups={selectedGroups}
                                groupings={groupings}
                                toggleGroupSort={toggleGroupSort}
                                handleGroupSelect={handleGroupSelect}
                                isGroupFullySelected={isGroupFullySelected}
                                isGroupPartiallySelected={isGroupPartiallySelected}
                                toggleGroup={toggleGroup}
                                t={t}
                            />
                        )}
                        
                        {/* If group is expanded or it's "all-data", show children or items */}
                        {(!isCollapsed || isNoGrouping) && (
                            <>
                                {/* Show direct items if this group has them */}
                                {hasItems && group.items.map((analysis) => (
                                    <TableRow
                                        key={analysis._id}
                                        analysis={analysis}
                                        selectedItems={selectedItems}
                                        handleItemSelect={handleItemSelect}
                                        openDetailsModal={openDetailsModal}
                                        openDeleteModal={openDeleteModal}
                                        openViewModal={openViewModal}
                                        role={role}
                                        permissions={permissions}
                                        userId={userId}
                                        t={t}
                                    />
                                ))}
                                
                                {/* Recursively render children groups */}
                                {hasChildren && renderGroups(group.children, level + 1)}
                            </>
                        )}
                    </React.Fragment>
                );
            });
        };
        return renderGroups;
    }, [groupedAnalysis, collapsedGroups, selectedItems, selectedGroups, handleGroupSelect, isGroupFullySelected, isGroupPartiallySelected, toggleGroup, openDetailsModal, openDeleteModal, openViewModal, role, permissions, userId, t]);

    return (
        <tbody className="bg-white divide-y divide-gray-200 text-xs">
            {renderNestedGroups(groupedAnalysis)}
        </tbody>
    );
};

export default TableBody; 