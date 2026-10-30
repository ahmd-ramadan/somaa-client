import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { INews, NewsClassifyEnum } from "@/interfaces/news.types";
import { fetchAllNews, deleteNews } from '@/lib/features/news/newsthunks';
import { 
    resetAddNewsStatus 
} from '@/lib/features/news/newsSlice';
import { ApiResponse } from '@/utils/apiService';
import toast from "react-hot-toast";
import { useSocket } from '@/hooks/useSocket';
import { useNewsFilters } from "@/hooks/useNewsFilters";
import { GroupingState, GroupedNewsData, groupingOrderMap } from '../types';
import React from 'react';

const groupingPossibleValues: Record<string, string[]> = {
    // adType: Object.values(NewsAdTypesEnum),
    classify: Object.values(NewsClassifyEnum),
    // pressType: Object.values(NewsPressTypesEnum),
    // geoClassify: Object.values(NewsGeographicalClassifyEnum),
    // add more as needed
};

export const useNewsTable = () => {
    const dispatch = useAppDispatch();
    const { allNews, allNewsstatus, addNewsStatus } = useAppSelector((state: RootState) => state.news);
    const { loggedInUser: { role, permissions, token, userId } } = useAppSelector((state: RootState) => state.authUser);

    const [selectedAllNews, setSelectedAllNews] = useState<INews[]>([]);
    const [selectedNewsId, setSelectedNewsId] = useState<string>('');
    const [selectedShowedImage, setSelectedShowedImage] = useState<string>('');
    const [isShowedImageModalOpen, setIsShowedImageModalOpen] = useState<boolean>(false);
    const [selectedNewsDetails, setSelectedNewsDetails] = useState<INews | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [NewsToDelete, setNewsToDelete] = useState<INews | null>(null);
    const [selectedNews, setSelectedNews] = useState<INews | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [groupings, setGroupings] = useState<GroupingState>({});
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

    const { isConnected, socket } = useSocket();
    const [error, setError] = useState<string | null>(null);

    const {
        filters,
        setFilters,
        showFilters,
        setShowFilters,
        filteredNews
    } = useNewsFilters(allNews);

    // Fetch data on mount - only once
    useEffect(() => {
        if (allNewsstatus === 'idle') {
            const start = new Date();
            const end = new Date();
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            dispatch(fetchAllNews({
                startDate: start,
                endDate: end
            }));
        }
    }, []); // Remove dependencies to prevent infinite calls

    // Reset status after successful operations
    useEffect(() => {
        if (allNewsstatus === 'succeeded') {
            // // Reset status after a short delay to prevent immediate re-fetch
            // const timer = setTimeout(() => {
            //     dispatch(resetallNewsStatus());
            // }, 100);
            // return () => clearTimeout(timer);
        }
    }, [allNewsstatus, dispatch]);


    // Update selected news when data changes
    useEffect(() => {
        if (allNewsstatus === 'succeeded' || addNewsStatus === 'succeeded') {
            setSelectedAllNews(allNews);
        }
    }, [allNewsstatus, addNewsStatus, allNews]);

    const activeGroupingKeys = Object.entries(groupings)
    .filter(([_, value]) => value.active)
    .sort((a, b) => (a[1].order || 0) - (b[1].order || 0))
    .map(([key]) => key);

    // Reset add news status
    useEffect(() => {
        if (addNewsStatus === 'succeeded') {
            const timer = setTimeout(() => {
                dispatch(resetAddNewsStatus());
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [addNewsStatus, dispatch]);

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
                    [key]: { active: true, order: maxOrder + 1, sort: 'normal' }
                };
            }
        });
    };

    const toggleGroupSort = (key: string) => {
        setGroupings(prev => {
            const current = prev[key];
            if (!current?.active) return prev;
            const nextSort: 'normal' | 'desc' | 'asc' =
                current.sort === 'normal' || !current.sort ? 'desc' :
                current.sort === 'desc' ? 'asc' : 'normal';
            return {
                ...prev,
                [key]: {
                    ...current,
                    sort: nextSort
                }
            };
        });
    };

    const activeGroupingsMap = activeGroupingKeys.map(key => groupingOrderMap[key as keyof typeof groupingOrderMap]);

    const getSortedAndGroupedNews = React.useMemo((): GroupedNewsData[] => {
        const sorted = [...filteredNews]

        if (activeGroupingKeys.length === 0) {
            const totalItems = filteredNews.length;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginated = filteredNews.slice(startIndex, endIndex);
            return [{
                key: 'all-data',
                label: 'All Analysis',
                items: paginated,
                children: [],
                level: 0,
                isCollapsed: false
            }];
        }

        const createNestedGroups = (items: INews[], level: number, parentPath = ''): GroupedNewsData[] => {
            if (level >= activeGroupingsMap.length) {
                return [];
            }

            const currentGrouping = activeGroupingsMap[level];
            const groupKeyName = activeGroupingKeys[level];
            const allPossibleValues = groupingPossibleValues[groupKeyName] || [];
            const groups: Record<string, INews[]> = {};

            // Initialize all possible groups
            allPossibleValues.forEach(value => {
                groups[value] = [];
            });

            // Fill with actual items
            items.forEach(item => {
                const value = currentGrouping.getValue(item);
                if (!(value in groups)) {
                    groups[value] = [];
                }
                groups[value].push(item);
            });

            // Convert to array and sort groups based on sortMode
            let entries = Object.entries(groups);
            const sortMode = groupings[groupKeyName]?.sort || 'normal';

            if (sortMode === 'desc') {
                entries.sort((a, b) => b[1].length - a[1].length);
            } else if (sortMode === 'asc') {
                entries.sort((a, b) => a[1].length - b[1].length);
            }

            return entries.map(([value, groupItems]) => {
                const groupKey = `${parentPath ? parentPath + '/' : ''}${currentGrouping.key}-${value}`;
                const children = createNestedGroups(groupItems, level + 1, groupKey);
                return {
                    key: groupKey,
                    label: value,
                    items: children.length === 0 ? groupItems : [],
                    children: children,
                    level: level,
                    isCollapsed: false
                };
            });
        };

        return createNestedGroups(sorted, 0, '');
    }, [filteredNews, sortOrder, activeGroupingKeys, activeGroupingsMap, groupings, currentPage, itemsPerPage]);

    // Update collapsedGroups when News changes
    useEffect(() => {
        const newGroups = { ... collapsedGroups };
        const updateCollapsedState = (groups: GroupedNewsData[]) => {
            groups.forEach(group => {
                if (!(group.key in newGroups)) {
                    newGroups[group.key] = true; // Start collapsed
                }
                updateCollapsedState(group.children);
            });
        };
        updateCollapsedState(getSortedAndGroupedNews);
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
        const updateCollapsedState = (groups: GroupedNewsData[]) => {
            groups.forEach(group => {
                newCollapsedGroups[group.key] = collapse;
                updateCollapsedState(group.children);
            });
        };
        updateCollapsedState(getSortedAndGroupedNews);
        setCollapsedGroups(newCollapsedGroups);
    };

    const expandAllGroups = () => toggleAllGroups(false);
    const collapseAllGroups = () => toggleAllGroups(true);


    const handleItemSelect = (itemId: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }
        setSelectedItems(newSelected);
    };

    const handleGroupSelect = (groupKey: string, items: INews[]) => {
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

    const isGroupFullySelected = (groupKey: string, items: INews[]) => {
        return items.every(item => selectedItems.has(item._id));
    };

    const isGroupPartiallySelected = (groupKey: string, items: INews[]) => {
        return items.some(item => selectedItems.has(item._id)) && !isGroupFullySelected(groupKey, items);
    };

    const openDetailsModal = (news: INews) => {
        setSelectedNewsDetails(news);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedNewsDetails(null);
    };

    const handleSave = async (updatedNews: INews) => {
        try {
            const updatedNewsList = allNews.map(news => 
                news._id === updatedNews._id ? updatedNews : news
            );
            setSelectedAllNews(updatedNewsList);
            setSelectedNewsDetails(updatedNews);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating news:', error);
        }
    };

    const openDeleteModal = (news: INews) => {
        setNewsToDelete(news);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setNewsToDelete(null);
    };

    const handleDelete = async () => {
        if (!NewsToDelete) return;

        try {
            const action = await dispatch(deleteNews({ 
                token: token as string, 
                newsId: NewsToDelete._id,
            }));
            
            const res = action.payload as ApiResponse<INews | null>;
            const { success, message } = res;
            if(isConnected) socket?.emit('deleteNews', res.data?._id);
            if(success) {
                const updatedNewsList = allNews.filter(news => news._id.toString() !== NewsToDelete._id.toString());
                setSelectedAllNews(updatedNewsList);
                closeDeleteModal();
                toast.success(message || "News deleted successfully");
            } else {
                toast.error(message || "Failed to delete news");
            }
        } catch (error) {
            console.error('Error deleting news:', error);
            toast.error("Failed to delete news");
        }
    };

    const openViewModal = (news: INews) => {
        setSelectedNews(news);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedNews(null);
    };

    return {
        // State
        selectedAllNews,
        selectedNewsId,
        isShowedImageModalOpen,
        selectedNewsDetails,
        isEditing,
        isDetailsModalOpen,
        isDeleteModalOpen,
        NewsToDelete,
        selectedNews,
        isViewModalOpen,
        selectedItems,
        selectedGroups,
        isExportModalOpen,
        sortOrder,
        currentPage,
        itemsPerPage,
        groupings,
        collapsedGroups,
        error,
        filters,
        showFilters,
        filteredNews,
        allNewsstatus,
        role,
        permissions,
        userId,
        activeGroupingKeys,
        getSortedAndGroupedNews,

        // Actions
        setSelectedNewsId,
        setIsShowedImageModalOpen,
        setSelectedShowedImage,
        setIsEditing,
        setSelectedItems,
        setSelectedGroups,
        setIsExportModalOpen,
        setSortOrder,
        setCurrentPage,
        setItemsPerPage,
        setFilters,
        setShowFilters,
        setGroupings,
        setCollapsedGroups,

        // Methods
        toggleGrouping,
        toggleGroupSort,
        toggleGroup,
        expandAllGroups,
        collapseAllGroups,
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
    };
}; 