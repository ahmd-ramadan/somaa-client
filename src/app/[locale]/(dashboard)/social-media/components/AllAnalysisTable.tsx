'use client'

import React from 'react';
import { AnalysisClassifyEnum, ContentTypesEnum, IAnalysis, PlatformsEnum, TweetTypesEnum } from "@/interfaces/analysis.types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { formatDate } from "@/utils/formatDateAndTime";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "../../../../../components/ui/Modal";
import Link from "next/link";
import { 
    Heart, 
    MessageCircle, 
    Share2, 
    Eye, 
    ChevronDown, 
    ChevronRight, 
    Eye as EyeIcon, 
    Edit,
    Trash2,
    SearchX,
    FilterX,
    X,
    FileDown,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    RefreshCcw,
    CircleUserRound
} from 'lucide-react';
import { useAnalysisFilters } from "@/hooks/useAnalysisFilters";
import AnalysisFilters from "./AnalysisFilters";
import { fetchAllSectors } from "@/lib/features/sector/sectorThunks";
import { fetchAllSubAnalysis } from "@/lib/features/subAnalysis/subAnalysisThunks";
import EditAnalysis from './EditAnalysis';
import toast from "react-hot-toast";
import { deleteAnalysis, fetchAllAnalysis, updateGroupOfAnalysis } from '@/lib/features/socialMedia/analysisThunks';
import { ApiResponse } from '@/utils/apiService';
import { showAuthComponentsForAnalysis } from '@/utils/authComponents';
import ViewAnalysis from './ViewAnalysis';
import { Checkbox } from "../../../../../components/ui/checkbox";
import ExportModal from './ExportModal';
import { useSocket } from '@/hooks/useSocket';
import Spinner from '@/components/ui/Spinner';

type GroupingState = {
    [key: string]: { active: boolean; order?: number }
};

interface GroupedAnalysisData {
    key: string;
    label: string;
    items: IAnalysis[];
    children: GroupedAnalysisData[];
    level: number;
    isCollapsed: boolean;
}

interface AllAnalysisTableProps {}

const groupingOrderMap = {
    sector: { key: 'sector', getValue: (item: IAnalysis) => item.sectorData.name },
    addedBy: { key: 'addedBy', getValue: (item: IAnalysis) => item.addedByData?.name || 'Unknown' },
    platform: { key: 'platform', getValue: (item: IAnalysis) => item.platform },
    publisher: { key: 'publisher', getValue: (item: IAnalysis) => item.publisher.name },
    subAnalysis: { key: 'subAnalysis', getValue: (item: IAnalysis) => item.subAnalysisData.body },
    classify: { key: 'classify', getValue: (item: IAnalysis) => item.classify },
    contentType: { key: 'contentType', getValue: (item: IAnalysis) => item.content?.type },
    tweetType: { key: 'tweetType', getValue: (item: IAnalysis) => item.tweetType }
};

const AllAnalysisTable = ({ }: AllAnalysisTableProps) => {
    const t = useTranslations("SocialMediaPage.AllAnalysisTable")
    const t2 = useTranslations("DeleteModal");
    const locale = useLocale();
    const router = useRouter();

    const { allAnalysis, allAnalysisStatus, addAnalysisStatus } = useAppSelector((state: RootState) => state.analysis);
    const { loggedInUser: { role, permissions, token, userId } } = useAppSelector((state: RootState) => state.authUser);

    const [selectedAllAnalysis, setSelectedAllAnalysis] = useState<IAnalysis[]>([]);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (allAnalysisStatus === 'idle') {
            dispatch(fetchAllAnalysis({}));
        }
    }, [dispatch, allAnalysisStatus]);

    useEffect(() => {
        if (allAnalysisStatus === 'succeeded' || addAnalysisStatus === 'succeeded') {
            setSelectedAllAnalysis(allAnalysis);
        }
    }, [allAnalysisStatus, addAnalysisStatus, allAnalysis]);

    const { allSectors, allSectorsStatus } = useAppSelector((state: RootState) => state.sectors);
    const { allSubAnalysis, allSubAnalysisStatus } = useAppSelector((state: RootState) => state.subAnalysis);
    const { updateGroupOfAnalysisStatus } = useAppSelector((state: RootState) => state.analysis);

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
    const [hoveredImage, setHoveredImage] = useState<{
        src: string;
        name: string;
        position: { x: number; y: number };
    } | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isUpdateGroupOfAnalysisModalOpen, setIsUpdateGroupOfAnalysisModalOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

    const {
        filters,
        setFilters,
        showFilters,
        setShowFilters,
        filteredAnalysis
    } = useAnalysisFilters(allAnalysis);

    const { isConnected, socket } = useSocket();
    const [error, setError] = useState<string | null>(null);

    const [unoptimizedAvatars, setUnoptimizedAvatars] = useState<Record<string, { publisher: boolean, addedBy: boolean, avatar: string }>>({});

    // Add pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

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
    }, [socket, isConnected])

    useEffect(() => {
        if (selectedAnalysisId) router.push(`/${locale}/social-media/${selectedAnalysisId}`);
    }, [selectedAnalysisId, router, locale]);

    useEffect(() => {
        if (allSectorsStatus === "idle") {
            dispatch(fetchAllSectors());
        }
    }, [dispatch, allSectorsStatus]);

    useEffect(() => {
        if (allSubAnalysisStatus === "idle") {
            dispatch(fetchAllSubAnalysis());
        }
    }, [dispatch, allSubAnalysisStatus]);

    const [groupings, setGroupings] = useState<GroupingState>({});

    const toggleGrouping = (key: string) => {
        setGroupings(prev => {
            const isActive = prev[key]?.active;
            if (isActive) {
                // Deactivate and remove order
                return {
                    ...prev,
                    [key]: { active: false }
                };
            } else {
                // Activate and assign next order
                const maxOrder = Math.max(0, ...Object.values(prev).map(g => g.order || 0));
                return {
                    ...prev,
                    [key]: { active: true, order: maxOrder + 1 }
                };
            }
        });
    };

    const activeGroupingKeys = Object.entries(groupings)
        .filter(([_, value]) => value.active)
        .sort((a, b) => (a[1].order || 0) - (b[1].order || 0))
        .map(([key]) => key);
    const activeGroupings = activeGroupingKeys;

    // After defining activeGroupings, also define activeGroupingsMap for groupingOrderMap objects
    const activeGroupingsMap = activeGroupingKeys.map(key => groupingOrderMap[key as keyof typeof groupingOrderMap]);

    const getSortedAndGroupedAnalysis = (): GroupedAnalysisData[] => {
        // Sort data based on total statistics
        const sorted = [...filteredAnalysis].sort((a, b) => {
            const totalA = a.statistics.reactions + 
                          a.statistics.comments + a.statistics.shares;
            const totalB = b.statistics.reactions + 
                          b.statistics.comments + b.statistics.shares;
            
            if (sortOrder === 'asc') {
                return totalA - totalB;
            } else if (sortOrder === 'desc') {
                return totalB - totalA;
            }
            return 0;
        });

        // Helper: get all possible values for a grouping type
        const getAllPossibleValues = (key: string): string[] => {
            switch (key) {
                case 'sector':
                    return Array.from(new Set(allAnalysis.map(a => a.sectorData.name)));
                case 'subAnalysis':
                    return Array.from(new Set(allAnalysis.map(a => a.subAnalysisData.body)));
                case 'classify':
                    return Object.values(AnalysisClassifyEnum);
                case 'contentType':
                    return Object.values(ContentTypesEnum);
                case 'tweetType':
                    return Object.values(TweetTypesEnum);
                case 'addedBy':
                    return Array.from(new Set(allAnalysis.map(a => a.addedByData?.name).filter(Boolean)));
                case 'publisher':
                    return Array.from(new Set(allAnalysis.map(a => a.publisher.name).filter(Boolean)));
                case 'platform':
                    return Array.from(new Set(allAnalysis.map(a => a.platform)));
                default:
                    return [];
            }
        };

        // If no groupings are active, return paginated data
        if (activeGroupings.length === 0) {
            const totalItems = filteredAnalysis.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginated = filteredAnalysis.slice(startIndex, endIndex);
            return [{
                key: 'all-data',
                label: t("allAnalysis"),
                items: paginated,
                children: [],
                level: 0,
                isCollapsed: false
            }];
        }

        // Create nested structure recursively, showing all possible values
        const createNestedGroups = (items: IAnalysis[], level: number, parentPath = ''): GroupedAnalysisData[] => {
            if (level >= activeGroupingsMap.length) {
                return [];
            }

            const currentGrouping = activeGroupingsMap[level];
            const groupKeyName = activeGroupingKeys[level];
            const possibleValues = getAllPossibleValues(groupKeyName);
            const groups: Record<string, IAnalysis[]> = {};

            // Group items by current grouping
            items.forEach(item => {
                const value = currentGrouping.getValue(item);
                if (!groups[value]) {
                    groups[value] = [];
                }
                groups[value].push(item);
            });

            // Ensure all possible values are present (even if empty)
            possibleValues.forEach(value => {
                if (!groups[value]) {
                    groups[value] = [];
                }
            });

            // Convert to GroupedAnalysisData structure
            return Object.entries(groups).map(([value, groupItems]) => {
                const groupKey = `${parentPath ? parentPath + '/' : ''}${currentGrouping.key}-${value}`;
                const children = createNestedGroups(groupItems, level + 1, groupKey);
                return {
                    key: groupKey,
                    label: Object.values(AnalysisClassifyEnum).includes(value as AnalysisClassifyEnum) 
                        || Object.values(ContentTypesEnum).includes(value as ContentTypesEnum)
                        || Object.values(TweetTypesEnum).includes(value as TweetTypesEnum) ? t(value) : value,
                    items: children.length === 0 ? groupItems : [], // Only leaf nodes have items
                    children: children,
                    level: level,
                    isCollapsed: false
                };
            });
        };

        return createNestedGroups(sorted, 0, '');
    };

    const groupedAnalysis = React.useMemo(() => getSortedAndGroupedAnalysis(), [filteredAnalysis, sortOrder, groupings]);

    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

    // Update collapsedGroups when groupedAnalysis changes - start with all groups collapsed
    useEffect(() => {
        setCollapsedGroups(prev => {
            const newGroups = { ...prev };
            const updateCollapsedState = (groups: GroupedAnalysisData[]) => {
                groups.forEach(group => {
                    if (!(group.key in newGroups)) {
                        newGroups[group.key] = true; // Start collapsed
                    }
                    updateCollapsedState(group.children);
                });
            };
            updateCollapsedState(groupedAnalysis);
            return newGroups;
        });
    }, [groupedAnalysis]);

    const toggleGroup = (groupKey: string) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [groupKey]: !prev[groupKey]
        }));
    };

    // Toggle all groups
    const toggleAllGroups = (collapse: boolean) => {
        const newCollapsedGroups: Record<string, boolean> = {};
        const updateCollapsedState = (groups: GroupedAnalysisData[]) => {
            groups.forEach(group => {
                newCollapsedGroups[group.key] = collapse;
                updateCollapsedState(group.children);
            });
        };
        updateCollapsedState(groupedAnalysis);
        setCollapsedGroups(newCollapsedGroups);
    };

    // Expand all groups
    const expandAllGroups = () => toggleAllGroups(false);

    // Collapse all groups
    const collapseAllGroups = () => toggleAllGroups(true);

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

    const handleUpdateGroupOfAnalysis = async () => {
        if(selectedItems.size === 0) return;

        try {
            const groupOfAnalysis = Array.from(selectedItems)
                .map(itemId => {
                    const analysis = allAnalysis.find(a => a._id.toString() === itemId.toString());
                    return analysis ? {
                        url: analysis.url,
                        platform: analysis.platform,
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
            if(success) {
                let updatedAnalysisList = allAnalysis;
                for(const analysis of data) {
                    updatedAnalysisList = updatedAnalysisList.map(
                        a => {
                            if(a._id.toString() === analysis._id.toString()) { 
                                if(isConnected) socket?.emit('updateAnalysis', analysis);
                                return analysis;
                            } 
                            return a;
                        }
                    );
                }
                setSelectedAllAnalysis(updatedAnalysisList);
                closeUpdateGroupOfAnalysisModal();
                toast.success(message || t("updateGroupOfAnalysisSuccessfully"));
            } else {
                toast.error(message || t("failedToUpdateGroupOfAnalysis"));
            }
        } catch (error) {
            console.error('Error update group of analysis:', error);
            toast.error(t("failedToUpdateGroupOfAnalysis"));
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
    const closeUpdateGroupOfAnalysisModal = () => {
        setIsUpdateGroupOfAnalysisModalOpen(false);
    };

    const handleDelete = async () => {
        if (!analysisToDelete) return;

        try {
            const action = await dispatch(deleteAnalysis({ 
                token: token as string, 
                analysisId: analysisToDelete._id,
            }));
            
            const res = action.payload as ApiResponse<IAnalysis | null>;
            const { success, message, data } = res;
            if(isConnected) socket?.emit('deleteAnalysis', data?._id)
            if(success) {
                const updatedAnalysisList = allAnalysis.filter(analysis => analysis._id.toString() !== analysisToDelete._id.toString());
                setSelectedAllAnalysis(updatedAnalysisList);
                closeDeleteModal();
                toast.success(message || t("analysisDeletedSuccessfully"));
            } else {
                toast.error(message || t("failedToDeleteAnalysis"));
            }
        } catch (error) {
            console.error('Error deleting analysis:', error);
            toast.error( t("failedToDeleteAnalysis"));
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

    const handleImageHover = (e: React.MouseEvent<HTMLDivElement>, imageSrc: string, name: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoveredImage({
            src: imageSrc,
            name,
            position: {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY
            }
        });
    };

    const handleImageLeave = () => {
        setHoveredImage(null);
    };

    // Handle individual item selection
    const handleItemSelect = (itemId: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }
        setSelectedItems(newSelected);
    };

    // Handle group selection
    const handleGroupSelect = (groupKey: string, items: IAnalysis[]) => {
        const newSelectedGroups = new Set(selectedGroups);
        const newSelectedItems = new Set(selectedItems);

        if (newSelectedGroups.has(groupKey)) {
            // Deselect group
            newSelectedGroups.delete(groupKey);
            items.forEach(item => newSelectedItems.delete(item._id));
        } else {
            // Select group
            newSelectedGroups.add(groupKey);
            items.forEach(item => newSelectedItems.add(item._id));
        }

        setSelectedGroups(newSelectedGroups);
        setSelectedItems(newSelectedItems);
    };

    // Check if all items in a group are selected
    const isGroupFullySelected = (groupKey: string, items: IAnalysis[]) => {
        return items.every(item => selectedItems.has(item._id));
    };

    // Check if some items in a group are selected
    const isGroupPartiallySelected = (groupKey: string, items: IAnalysis[]) => {
        return items.some(item => selectedItems.has(item._id)) && !isGroupFullySelected(groupKey, items);
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

    // Helper function to calculate total items in a group (including children)
    const getTotalItemsInGroup = (group: GroupedAnalysisData): number => {
        if (group.children.length === 0) {
            return group.items.length;
        }
        return group.children.reduce((total, child) => total + getTotalItemsInGroup(child), 0);
    };

    // Helper function to get all items in a group (including children)
    const getAllItemsInGroup = (group: GroupedAnalysisData): IAnalysis[] => {
        if (group.children.length === 0) {
            return group.items;
        }
        return group.children.flatMap(child => getAllItemsInGroup(child));
    };

    // Helper function to get background color based on level
    const getBackgroundColor = (level: number): string => {
        switch (level) {
            case 0: return 'bg-gray-50';
            case 1: return 'bg-blue-50';
            case 2: return 'bg-green-50';
            case 3: return 'bg-yellow-50';
            case 4: return 'bg-purple-50';
            case 5: return 'bg-pink-50';
            default: return 'bg-gray-50';
        }
    };

    // Helper function to get border color based on level
    const getBorderColor = (level: number): string => {
        switch (level) {
            case 0: return 'border-gray-200';
            case 1: return 'border-blue-200';
            case 2: return 'border-green-200';
            case 3: return 'border-yellow-200';
            case 4: return 'border-purple-200';
            case 5: return 'border-pink-200';
            default: return 'border-gray-200';
        }
    };

    // Helper function to get text color based on level
    const getTextColor = (level: number): string => {
        switch (level) {
            case 0: return 'text-gray-900';
            case 1: return 'text-blue-900';
            case 2: return 'text-green-900';
            case 3: return 'text-yellow-900';
            case 4: return 'text-purple-900';
            case 5: return 'text-pink-900';
            default: return 'text-gray-900';
        }
    };

    // Helper function to get connector color based on level
    const getConnectorColor = (level: number): string => {
        switch (level) {
            case 0: return 'bg-gray-300';
            case 1: return 'bg-blue-300';
            case 2: return 'bg-green-300';
            case 3: return 'bg-yellow-300';
            case 4: return 'bg-purple-300';
            case 5: return 'bg-pink-300';
            case 6: return 'bg-red-300';
            case 7: return 'bg-orange-300';
            default: return 'bg-gray-300';
        }
    };

    // Helper function to get grouping type label
    const getGroupingTypeLabel = (groupKey: string, level: number): string => {
        const currentLevel = groupKey.split('/').at(level) || groupKey;
        console.log("groupKey", groupKey);
        console.log("levl", level);
        console.log("currentLevel", currentLevel);

        if (currentLevel.startsWith('sector-')) return t("sector");
        if (currentLevel.startsWith('addedBy-')) return t("addedBy");
        if (currentLevel.startsWith('platform-')) return t("platform");
        if (currentLevel.startsWith('publisher-')) return t("publisher");
        if (currentLevel.startsWith('subAnalysis-')) return t("subAnalysis");
        if (currentLevel.startsWith('classify-')) return t("classification");
        if (currentLevel.startsWith('contentType-')) return t("contentType");
        if (currentLevel.startsWith('tweetType-')) return t("tweetType");
        return t("group");
    };

    // Helper function to render nested groups as a chain
    const renderNestedGroups = (groups: GroupedAnalysisData[], level: number = 0): React.ReactNode[] => {
        return groups.map(group => {
            const isCollapsed = collapsedGroups[group.key];
            const hasChildren = group.children.length > 0;
            const hasItems = group.items.length > 0;
            const totalItems = getTotalItemsInGroup(group);
            const groupingType = getGroupingTypeLabel(group.key, level);
            const connectorColor = getConnectorColor(level);
            const isNoGrouping = group.key === 'all-data';
            
            // Calculate indentation: each level gets more indentation than the previous
            // Level 0: 8px, Level 1: 13px, Level 2: 18px, Level 3: 23px, etc.
            const baseIndentation = 8; // Base indentation in pixels
            const indentationIncrement = 15; // Additional pixels per level
            const currentIndentation = baseIndentation + (level * indentationIncrement);
            
            return (
                <React.Fragment key={group.key}>
                    {/* Group Header Row - Only show if not "all-data" or if it has children */}
                    {(!isNoGrouping || hasChildren) && (
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
                                        <span className={`font-semibold ${getTextColor(level)}`}>{group.label}</span>
                                        <span className="text-gray-500">({totalItems})</span>
                                        {level > 0 && (
                                            <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-full">
                                                {groupingType}
                                            </span>
                                        )}
                                        {/* {level > 0 && (
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                                Level {level} ({currentIndentation}px)
                                            </span>
                                        )} */}
                                    </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                    
                    {/* If group is expanded or it's "all-data", show children or items */}
                    {(!isCollapsed || isNoGrouping) && (
                        <>
                            {/* Show direct items if this group has them */}
                            {hasItems && group.items.map((analysis) => {
                                const {
                                    _id,
                                    subAnalysisData,
                                    classify,
                                    content,
                                    createdAt,
                                    platform,
                                    publisher,
                                    sectorData,
                                    statistics: {
                                        reactions,
                                        appearance,
                                        comments,
                                        shares,
                                        views
                                    },
                                    url,
                                    addedBy,
                                    addedByData,
                                } = analysis;

                                const formattedDate = formatDate({ 
                                    locale, 
                                    date: createdAt, 
                                    withTime: true 
                                });

                                const unOptimizedPublisherAvatar = unoptimizedAvatars[analysis._id]?.publisher ?? false;
                                const unOptimizedAddedByAvatar = unoptimizedAvatars[analysis._id]?.addedBy ?? false;
                                const publisherAvatar = unoptimizedAvatars[analysis._id]?.avatar;

                                return (
                                    <tr key={_id} className="hover:bg-primary/20">
                                        <td className="px-2 py-1">
                                            <Checkbox
                                                checked={selectedItems.has(analysis._id)}
                                                onCheckedChange={() => handleItemSelect(analysis._id)}
                                            />
                                        </td>
                                        <td className="px-2 py-1">
                                            <Link
                                                className="text-secondary font-semibold underline"
                                                href={url}
                                            >
                                                {t(platform)}
                                            </Link>
                                        </td>
                                        <th scope="row" className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap flex justify-start gap-2 items-center">
                                            <div 
                                                className="relative group"
                                                onMouseEnter={(e) => handleImageHover(e, publisher?.avatar || '/logo.png', publisher.name)}
                                                onMouseLeave={handleImageLeave}
                                            >
                                                <img
                                                    src={analysis?.publisher?.avatar || '/logo.png'}
                                                    alt="Publisher avatar"
                                                    // width={50}
                                                    // height={50}
                                                    // unoptimized={unOptimizedPublisherAvatar}
                                                    className="h-10 w-10 rounded-md cursor-pointer transition-transform duration-200 group-hover:scale-105 text-xs"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200 rounded-md" />
                                            </div>
                                            <div className='flex flex-col justify-start items-start gap-1'>
                                                <p className="text-sm font-semibold">{publisher.name}</p>
                                                <p className="text-xs text-gray-600">@{publisher?.handle}</p>
                                            </div>
                                        </th>
                                        <td className="px-2 py-1">{sectorData?.name}</td>
                                        <td className={`px-2 py-1 ${classify === AnalysisClassifyEnum.POSITIVE ? 'text-green-600' : classify === AnalysisClassifyEnum.NEGATIVE ? 'text-red-600' : 'text-primary'}`}>{t(classify)}</td>
                                        <td className={`px-2 py-1`}>{subAnalysisData?.body}</td>
                                        <td className="px-2 py-1">{reactions.toLocaleString()}</td>
                                        <td className="px-2 py-1">{comments.toLocaleString()}</td>
                                        <td className="px-2 py-1">{shares.toLocaleString()}</td>
                                        <td className="px-2 py-1">{views.toLocaleString()}</td>
                                        <td className="px-2 py-1">{(reactions + comments + shares).toLocaleString()}</td>
                                        <td className="px-2 py-1 w-fit">{formattedDate}</td>
                                        <th scope="row" className="px-2 py-1 font-medium text-gray-900">
                                            <div className="flex h-full justify-center items-center gap-1 whitespace-nowrap">
                                                <CircleUserRound className='w-4 h-4 text-primary'/>
                                                <p className="text-xs">{addedByData?.name}</p>
                                            </div>
                                        </th>
                                        <td className="px-2 py-1">
                                            <div className="flex items-center gap-2">
                                                {showAuthComponentsForAnalysis({ role, permissions }) 
                                                    && (role === 'super_admin' || addedBy.toString() === userId.toString()) ?
                                                    <>
                                                        <Edit
                                                            className="w-5 h-5 text-adminPrimary hover:bg-adminPrimary hover:text-white rounded-md cursor-pointer p-1"
                                                            onClick={() => openDetailsModal(analysis)}
                                                        />
                                                        <Trash2
                                                            className="w-5 h-5 text-red-500 hover:bg-red-500 hover:text-white rounded-md cursor-pointer p-1"
                                                            onClick={() => openDeleteModal(analysis)}
                                                        />
                                                    </>
                                                    : 
                                                        <>
                                                            <EyeIcon
                                                                className="w-5 h-5 text-adminPrimary hover:bg-adminPrimary hover:text-white rounded-md cursor-pointer p-1"
                                                                onClick={() => openViewModal(analysis)}
                                                            />
                                                        </>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            
                            {/* Recursively render children groups */}
                            {hasChildren && renderNestedGroups(group.children, level + 1)}
                        </>
                    )}
                        </React.Fragment>
            );
        });
    };

    const renderTable = () => {
        // Show loading spinner when data is being fetched
        if (allAnalysisStatus === 'loading') {
            return (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                        <Spinner size="100px"/>
                    </div>
                    <div className="text-xl font-semibold mb-2 text-primary">{t("loadingData")}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{t("fetchingFromDatabase")}</span>
                    </div>
                </div>
            );
        }

        // Check if there are no results after filtering
        if (filteredAnalysis.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                        <SearchX className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="text-xl font-semibold mb-2 text-primary">{t("noDataFound")}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FilterX className="w-4 h-4" />
                        <span>{t("tryAdjustingFilters")}</span>
                    </div>
                </div>
            );
        }

        // If there are results, show them in the table
        return (
            <table className={`min-w-full divide-y divide-gray-200 text-xs`}>
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
                        <th scope="col" className="px-2 py-1"><Heart className="w-4 h-4 text-red-500 fill-red-600" /></th>
                        <th scope="col" className="px-2 py-1"><MessageCircle className="w-4 h-4 text-green-500 fill-green-600" /></th>
                        <th scope="col" className="px-2 py-1"><Share2 className="w-4 h-4 text-black fill-balck" /></th>
                        <th scope="col" className="px-2 py-1"><Eye className="w-4 h-4 text-secondary" /></th>
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
                <tbody className="bg-white divide-y divide-gray-200 text-xs">
                    {renderNestedGroups(groupedAnalysis)}
                </tbody>
            </table>
        );
    };

    return (
        <div className="space-y-2 min-h-svh">
            <div className="flex justify-between items-center">
                <AnalysisFilters
                    filters={filters}
                    setFilters={setFilters}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    groupings={groupings}
                    setGroupings={setGroupings}
                    allAnalysis={allAnalysis}
                />
            </div>

            <div className="px-2 font-semibold flex items-center justify-between text-xs text-primary">
                <div className="flex items-center justify-between gap-2 w-full">
                    <div>
                        {allAnalysisStatus === 'loading' ? (
                            <div className="flex items-center gap-2">
                                <Spinner className="w-4 h-4" />
                                <span>{t("loadingData")}</span>
                            </div>
                        ) : (
                            <>
                                <span>{t("showAllAnalysis")}: </span>
                                <span className="font-semibold text-secondary">{filteredAnalysis.length}</span>
                                {/* {filteredAnalysis.length !== allAnalysis.length && (
                                    <>
                                        <span className="text-primary">/</span>
                                        <span className="text-primary">{allAnalysis.length}</span>
                                    </>
                                )} */}
                            </>
                        )}
                    </div>
                    <div className='flex items-center gap-2'>
                        {selectedItems.size > 0 && <button
                            onClick={() => setIsUpdateGroupOfAnalysisModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            <span>{t("updategroupOfAnalysis")}</span>
                        </button> }
                        {selectedItems.size > 0 && <button
                            onClick={() => setIsExportModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <FileDown className="w-4 h-4" />
                            <span>{t("exportToExcel")}</span>
                        </button> }
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden relative">
                {allAnalysisStatus === 'loading' && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                        <div className="flex flex-col items-center gap-2">
                            <Spinner className="w-8 h-8" />
                            <span className="text-sm text-gray-600">{t("loadingData")}</span>
                        </div>
                    </div>
                )}
                <div className="overflow-x-auto">
                    {renderTable()}
                </div>
            </div>

            {selectedItems.size > 0 && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                        {selectedItems.size} {t("itemsSelected")}
                    </span>
                    <button
                        onClick={() => {
                            setSelectedItems(new Set());
                            setSelectedGroups(new Set());
                        }}
                        className="text-sm text-red-500 hover:text-red-600"
                    >
                        {t("clearSelection")}
                    </button>
                </div>
            )}

            <Modal isOpen={isDetailsModalOpen} closeModal={closeDetailsModal} title="Analysis Details">
                {selectedAnalysisDetails && (
                    <EditAnalysis
                        analysis={selectedAnalysisDetails}
                        onSave={handleSave}
                        onCancel={closeDetailsModal}
                    />
                )}
            </Modal>

            <Modal isOpen={isDeleteModalOpen} closeModal={closeDeleteModal} title={t("deleteAnalysisModalTitle")}>
                <div className="p-4 space-y-4">
                    <p className="text-primary">{t2("deleteModalPharse", { item: t("analysis")})}</p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={closeDeleteModal}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            {t2("cancelBtn")}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            {t2("deleteBtn")}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isUpdateGroupOfAnalysisModalOpen} closeModal={closeUpdateGroupOfAnalysisModal} title={t("updateGroupOfAnalysisModalTitle")}>
                <div className="p-4 space-y-4">
                    <p className="text-primary">{t("groupOfAnalaysisModalPharse", { item: t("groupOfAnalaysis")})}</p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={closeUpdateGroupOfAnalysisModal}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                        >
                            {t("cancelBtn")}
                        </button>
                        <button
                            onClick={handleUpdateGroupOfAnalysis}
                            disabled={updateGroupOfAnalysisStatus === 'loading'}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
                        >
                            { updateGroupOfAnalysisStatus === 'loading' ? <Spinner /> : t("confirmBtn") }
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isViewModalOpen}
                closeModal={closeViewModal}
                title={t("viewAnalysisModalTitle")}
            >
                { selectedAnalysis && <ViewAnalysis analysis={selectedAnalysis} /> }
            </Modal>

            {/* Image Preview Hover */}
            {hoveredImage && (
                <div 
                    className="fixed z-50 bg-white rounded-lg shadow-xl p-4 transform transition-all duration-200"
                    style={{
                        left: hoveredImage.position.x + 60,
                        top: hoveredImage.position.y,
                        maxWidth: '300px'
                    }}
                >
                    <div className="relative">
                        <button
                            onClick={handleImageLeave}
                            className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-700 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <img
                            src={hoveredImage.src || '/logo.png'}
                            alt={hoveredImage.name}
                            width={200}
                            height={300}
                            className="rounded-lg object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/logo.png';
                            }}
                        />
                        <div className="mt-2 text-sm font-medium text-gray-700 text-center">
                            {hoveredImage.name}
                        </div>
                    </div>
                </div>
            )}

            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                data={filteredAnalysis}
            />

            {/* After the table rendering, add pagination controls if not grouped */}
            {activeGroupings.length === 0 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                    >
                        {t('prev')}
                    </button>
                    <span>{t('page')} {currentPage}</span>
                    <button
                        onClick={() => setCurrentPage(p => p + 1)}
                        disabled={currentPage >= Math.ceil(filteredAnalysis.length / itemsPerPage)}
                        className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                    >
                        {t('next')}
                    </button>
                    <select
                        value={itemsPerPage}
                        onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                        className="ml-2 px-2 py-1 border rounded"
                    >
                        {[10, 20, 50, 100].map(n => (
                            <option key={n} value={n}>{n} / {t('page')}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default AllAnalysisTable;

