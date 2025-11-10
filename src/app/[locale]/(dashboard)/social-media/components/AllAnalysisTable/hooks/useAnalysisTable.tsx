import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { IAnalysis, PlatformsEnum, AnalysisClassifyEnum } from "@/interfaces/analysis.types";
import { fetchAllAnalysis, deleteAnalysis, updateGroupOfAnalysis } from '@/lib/features/socialMedia/analysisThunks';
import { 
    resetAddAnalysisStatus,
    resetUpdateGroupOfAnalysisStatus 
} from '@/lib/features/socialMedia/analysisSlice';
import { ApiResponse } from '@/utils/apiService';
import toast from "react-hot-toast";
import { useSocket } from '@/hooks/useSocket';
import { useAnalysisFilters } from "@/hooks/useAnalysisFilters";
import { GroupingState, GroupedAnalysisData, groupingOrderMap } from '../types';
import React from 'react';

const groupingPossibleValues: Record<string, string[]> = {
//   platform: Object.values(PlatformsEnum),
  classify: Object.values(AnalysisClassifyEnum),
//   tweetType: Object.values(TweetTypesEnum),
//   contentType: Object.values(ContentTypesEnum),
  isRelated: ["internal", 'external']
};

export const useAnalysisTable = () => {
    const dispatch = useAppDispatch();
    const { allAnalysis, allAnalysisStatus, addAnalysisStatus, updateGroupOfAnalysisStatus, pagenation, datequery } = useAppSelector((state: RootState) => state.analysis);
    const { loggedInUser: { role, permissions, token, userId } } = useAppSelector((state: RootState) => state.authUser);

    const [selectedAllAnalysis, setSelectedAllAnalysis] = useState<IAnalysis[]>([]);
    const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>('');
    const [selectedShowedImage, setSelectedShowedImage] = useState<string>('');
    const [isShowedImageModalOpen, setIsShowedImageModalOpen] = useState<boolean>(false);
    const [selectedAnalysisDetails, setSelectedAnalysisDetails] = useState<IAnalysis | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [analysisToDelete, setAnalysisToDelete] = useState<IAnalysis | null>(null);
    const [selectedAnalysis, setSelectedAnalysis] = useState<IAnalysis | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isUpdateGroupOfAnalysisModalOpen, setIsUpdateGroupOfAnalysisModalOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50); // Increased default page size for better performance
    const [groupings, setGroupings] = useState<GroupingState>({});
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
    const [isGroupingLoading, setIsGroupingLoading] = useState(false);

    const { isConnected, socket } = useSocket();
    const [error, setError] = useState<string | null>(null);

    const {
        filters,
        setFilters,
        showFilters,
        setShowFilters,
        filteredAnalysis
    } = useAnalysisFilters(allAnalysis);

    // Fetch data on mount - only once
    useEffect(() => {
        if (allAnalysisStatus === 'idle') {
            const start = new Date();
            const end = new Date();
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            
            dispatch(fetchAllAnalysis({
                startDate: start,
                endDate: end
            }));
        }
    }, []); // Remove dependencies to prevent infinite calls

    // Reset status after successful operations
    useEffect(() => {
        if (allAnalysisStatus === 'succeeded') {
            // // Reset status after a short delay to prevent immediate re-fetch
            // const timer = setTimeout(() => {
            //     dispatch(resetAllAnalysisStatus());
            // }, 100);
            // return () => clearTimeout(timer);
        }
    }, [allAnalysisStatus, dispatch]);

    // Update selected analysis when data changes
    useEffect(() => {
        if (allAnalysisStatus === 'succeeded' || addAnalysisStatus === 'succeeded') {
            setSelectedAllAnalysis(allAnalysis);
        }
    }, [allAnalysisStatus, addAnalysisStatus, allAnalysis]);

    // Reset add analysis status
    useEffect(() => {
        if (addAnalysisStatus === 'succeeded') {
            const timer = setTimeout(() => {
                dispatch(resetAddAnalysisStatus());
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [addAnalysisStatus, dispatch]);

    // Socket error handling
    useEffect(() => {
        if(!socket || !isConnected) {
            return;
        }

        const handleError = (error: any) => {
            console.error('Socket error:', error);
            setError(error.message || 'An error occurred');
        };

        socket.on('error', handleError);

        return () => {
            socket.off('error');
        };
    }, [socket, isConnected]);

    const toggleGrouping = (key: string) => {
        setIsGroupingLoading(true);
        setGroupings(prev => {
            const isActive = prev[key]?.active;
            if (isActive) {
                return {
                    ...prev,
                    [key]: { active: false }
                };
            } else {
                const maxOrder = Math.max(0, ...Object.values(prev).map(g => g.order || 0));
                return {
                    ...prev,
                    [key]: { active: true, order: maxOrder + 1 }
                };
            }
        });
        
        // Reset loading after a short delay to allow grouping to complete
        setTimeout(() => {
            setIsGroupingLoading(false);
        }, 300);
    };

    const activeGroupingKeys = Object.entries(groupings)
        .filter(([_, value]) => value.active)
        .sort((a, b) => (a[1].order || 0) - (b[1].order || 0))
        .map(([key]) => key);

    const activeGroupingsMap = activeGroupingKeys.map(key => groupingOrderMap[key as keyof typeof groupingOrderMap]);

    // Optimized sorting function with memoization
    const getSortedAnalysis = React.useMemo((): IAnalysis[] => {
        if (sortOrder === 'none') {
            return filteredAnalysis;
        }

        return [...filteredAnalysis].sort((a, b) => {
            const totalA = a.statistics.reactions + a.statistics.comments + a.statistics.shares;
            const totalB = b.statistics.reactions + b.statistics.comments + b.statistics.shares;
            
            return sortOrder === 'asc' ? totalA - totalB : totalB - totalA;
        });
    }, [filteredAnalysis, sortOrder]);

    // Optimized grouping function with better performance
    const getSortedAndGroupedAnalysis = React.useMemo((): GroupedAnalysisData[] => {
        const sorted = getSortedAnalysis;

        if (activeGroupingKeys.length === 0) {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedSelected = sorted.slice(startIndex, endIndex);

            return [{
                key: 'all-data',
                label: `All Analysis (${sorted.length})`,
                items: paginatedSelected,
                children: [],
                level: 0,
                isCollapsed: false
            }];
        }

        // Optimized grouping with Map for better performance
        const createNestedGroups = (items: IAnalysis[], level: number, parentPath = ''): GroupedAnalysisData[] => {
            if (level >= activeGroupingsMap.length) {
                return [];
            }

            const currentGrouping = activeGroupingsMap[level];
            const groupKeyName = activeGroupingKeys[level];
            const allPossibleValues = groupingPossibleValues[groupKeyName] || [];
            
            // Use Map for better performance than object
            const groups = new Map<string, IAnalysis[]>();

            // Initialize all possible groups
            allPossibleValues.forEach(value => {
                groups.set(value, []);
            });

            // Fill with actual items - optimized loop
            for (const item of items) {
                const value = currentGrouping.getValue(item);
                if (!groups.has(value)) {
                    groups.set(value, []);
                }
                groups.get(value)!.push(item);
            }

            // Convert to array and create groups - show all items
            const result: GroupedAnalysisData[] = [];
            
            for (const [value, groupItems] of Array.from(groups.entries())) {
                const groupKey = `${parentPath ? parentPath + '/' : ''}${currentGrouping.key}-${value}`;
                
                const children = createNestedGroups(groupItems, level + 1, groupKey);
                
                result.push({
                    key: groupKey,
                    label: `${value} (${groupItems.length})`,
                    items: children.length === 0 ? groupItems : [],
                    children: children,
                    level: level,
                    isCollapsed: false
                });
            }

            return result;
        };

        return createNestedGroups(sorted, 0, '');
    }, [getSortedAnalysis, activeGroupingKeys, activeGroupingsMap, currentPage, itemsPerPage, selectedItems]);

    // Update collapsedGroups when groupedAnalysis changes
    useEffect(() => {
        const newGroups = { ... collapsedGroups };
        const updateCollapsedState = (groups: GroupedAnalysisData[]) => {
            groups.forEach(group => {
                if (!(group.key in newGroups)) {
                    newGroups[group.key] = true; // Start collapsed
                }
                updateCollapsedState(group.children);
            });
        };
        updateCollapsedState(getSortedAndGroupedAnalysis);
        setCollapsedGroups(newGroups);
    }, [groupings]);

    const toggleGroup = (groupKey: string) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [groupKey]: !prev[groupKey]
        }));
    };

    const toggleAllGroups = (collapse: boolean) => {
        const newCollapsedGroups: Record<string, boolean> = {};
        const updateCollapsedState = (groups: GroupedAnalysisData[]) => {
            groups.forEach(group => {
                newCollapsedGroups[group.key] = collapse;
                updateCollapsedState(group.children);
            });
        };
        updateCollapsedState(getSortedAndGroupedAnalysis);
        setCollapsedGroups(newCollapsedGroups);
    };

    const expandAllGroups = () => toggleAllGroups(false);
    const collapseAllGroups = () => toggleAllGroups(true);

    const toggleSortOrder = () => {
        console.log('Current sort order:', sortOrder);
        setSortOrder(current => {
            let next: 'none' | 'asc' | 'desc';
            switch (current) {
                case 'none': next = 'desc'; break;
                case 'desc': next = 'asc'; break;
                case 'asc': next = 'none'; break;
                default: next = 'none';
            }
            console.log('New sort order:', next);
            return next;
        });
    };

    const handleItemSelect = (itemId: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }
        setSelectedItems(newSelected);
    };

    const handleGroupSelect = (groupKey: string, items: IAnalysis[]) => {
        const newSelectedGroups = new Set(selectedGroups);
        const newSelectedItems = new Set(selectedItems);

        if (newSelectedGroups.has(groupKey)) {
            newSelectedGroups.delete(groupKey);
            items.forEach(item => newSelectedItems.delete(item._id));
        } else {
            newSelectedGroups.add(groupKey);
            items.forEach(item => newSelectedItems.add(item._id));
        }

        setSelectedGroups(newSelectedGroups);
        setSelectedItems(newSelectedItems);
    };

    const isGroupFullySelected = (groupKey: string, items: IAnalysis[]) => {
        return items.every(item => selectedItems.has(item._id));
    };

    const isGroupPartiallySelected = (groupKey: string, items: IAnalysis[]) => {
        return items.some(item => selectedItems.has(item._id)) && !isGroupFullySelected(groupKey, items);
    };

    const openDetailsModal = (analysis: IAnalysis) => {
        setSelectedAnalysisDetails(analysis);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedAnalysisDetails(null);
    };

    const handleSave = async (updatedAnalysis: IAnalysis) => {
        try {
            const updatedAnalysisList = allAnalysis.map(analysis => 
                analysis._id === updatedAnalysis._id ? updatedAnalysis : analysis
            );
            setSelectedAllAnalysis(updatedAnalysisList);
            setSelectedAnalysisDetails(updatedAnalysis);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating analysis:', error);
        }
    };

    const openDeleteModal = (analysis: IAnalysis) => {
        setAnalysisToDelete(analysis);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setAnalysisToDelete(null);
    };

    const handleDelete = async () => {
        if (!analysisToDelete) return;

        try {
            const action = await dispatch(deleteAnalysis({ 
                token: token as string, 
                analysisId: analysisToDelete._id,
            }));
            
            const res = action.payload as ApiResponse<IAnalysis | null>;
            const { success, message } = res;
            if(isConnected) socket?.emit('deleteAnalysis', res.data?._id);
            if(success) {
                const updatedAnalysisList = allAnalysis.filter(analysis => analysis._id.toString() !== analysisToDelete._id.toString());
                setSelectedAllAnalysis(updatedAnalysisList);
                closeDeleteModal();
                toast.success(message || "Analysis deleted successfully");
            } else {
                toast.error(message || "Failed to delete analysis");
            }
        } catch (error) {
            console.error('Error deleting analysis:', error);
            toast.error("Failed to delete analysis");
        }
    };

    const openViewModal = (analysis: IAnalysis) => {
        setSelectedAnalysis(analysis);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedAnalysis(null);
    };

    const closeUpdateGroupOfAnalysisModal = () => {
        setIsUpdateGroupOfAnalysisModalOpen(false);
    };

    const handleUpdateGroupOfAnalysis = useCallback(async () => {
        if(selectedItems.size === 0) return;

        try {
            const groupOfAnalysis = Array.from(selectedItems)
                .map(itemId => {
                    const analysis = allAnalysis.find(a => a._id.toString() === itemId.toString());
                    return analysis ? {
                        url: analysis.url,
                        platform: analysis.platform as PlatformsEnum,
                        analysisId: analysis._id
                    } : null;
                })
                .filter((item): item is { url: string; platform: PlatformsEnum; analysisId: string } => item !== null);

            const action = await dispatch(updateGroupOfAnalysis({ 
                token: token as string, 
                groupOfAnalysis
            }));
            
            const res = action.payload as ApiResponse<IAnalysis[]>;
            const { success, message, data } = res;
            if(success && data) {
                setSelectedItems(new Set());
                setSelectedGroups(new Set());
                closeUpdateGroupOfAnalysisModal();
                toast.success(message || "Group of analysis updated successfully");
            } else {
                toast.error(message || "Failed to update group of analysis");
            }
        } catch (error) {
            console.error('Error updating group of analysis:', error);
            toast.error("Failed to update group of analysis");
        }
    }, [selectedItems, allAnalysis, dispatch, token]);

    // Reset update group status
    useEffect(() => {
        if (updateGroupOfAnalysisStatus === 'succeeded') {
            const timer = setTimeout(() => {
                dispatch(resetUpdateGroupOfAnalysisStatus());
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [updateGroupOfAnalysisStatus, dispatch]);

    const handleShowMore = () => {
        console.log(pagenation);
        dispatch(fetchAllAnalysis({
            startDate: datequery.startDate,
            endDate: datequery.endDate,
            pagenationQuery: { page: pagenation?.page + 1 }
       }));
    };

    return {
        // State
        selectedAllAnalysis,
        selectedAnalysisId,
        isShowedImageModalOpen,
        selectedAnalysisDetails,
        isEditing,
        isDetailsModalOpen,
        isDeleteModalOpen,
        analysisToDelete,
        selectedAnalysis,
        isViewModalOpen,
        selectedItems,
        selectedGroups,
        isExportModalOpen,
        isUpdateGroupOfAnalysisModalOpen,
        sortOrder,
        currentPage,
        itemsPerPage,
        groupings,
        collapsedGroups,
        error,
        filters,
        showFilters,
        filteredAnalysis,
        allAnalysisStatus,
        updateGroupOfAnalysisStatus,
        role,
        permissions,
        userId,
        activeGroupingKeys,
        getSortedAndGroupedAnalysis,

        // Actions
        setSelectedAnalysisId,
        setIsShowedImageModalOpen,
        setSelectedShowedImage,
        setIsEditing,
        setSelectedItems,
        setSelectedGroups,
        setIsExportModalOpen,
        setIsUpdateGroupOfAnalysisModalOpen,
        setSortOrder,
        setCurrentPage,
        setItemsPerPage,
        setFilters,
        setShowFilters,
        setGroupings,
        setCollapsedGroups,

        // Methods
        toggleGrouping,
        toggleGroup,
        expandAllGroups,
        collapseAllGroups,
        toggleSortOrder,
        handleItemSelect,
        handleGroupSelect,
        isGroupFullySelected,
        isGroupPartiallySelected,
        openDetailsModal,
        closeDetailsModal,
        handleSave,
        openDeleteModal,
        closeDeleteModal,
        handleDelete,
        openViewModal,
        closeViewModal,
        closeUpdateGroupOfAnalysisModal,
        handleUpdateGroupOfAnalysis,
        isGroupingLoading,
        handleShowMore,
    };
}; 