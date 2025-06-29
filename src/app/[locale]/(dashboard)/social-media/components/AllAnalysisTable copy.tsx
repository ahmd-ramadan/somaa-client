'use client'

import React from 'react';
import { AnalysisClassifyEnum, IAnalysis, PlatformsEnum } from "@/interfaces/analysis.types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { formatDate } from "@/utils/formatDateAndTime";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
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
    AlertCircle,
    X,
    FileDown,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    RefreshCcw
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
import { getImageURL } from '@/utils/getImage';
import Pagination from '@/components/ui/Pagination';

interface GroupingState {
    sector?: boolean;
    addedBy?: boolean;
    platform?: boolean;
    subAnalysis?: boolean;
    classify?: boolean;
    contentType?: boolean;
}

interface AllAnalysisTableProps {
    // allAnalysis: IAnalysis[];
    // setSelectedAllAnalysis: (allAnalysis: IAnalysis[]) => void;
    // currentPage: number;
    // totalPages: number;
    // onPageChange: (page: number) => void;
}

const AllAnalysisTable = ({ }: AllAnalysisTableProps) => {
    const t = useTranslations("SocialMediaPage.AllAnalysisTable")
    const t2 = useTranslations("DeleteModal");
    const locale = useLocale();
    const router = useRouter();

    const { allAnalysis, allAnalysisStatus, addAnalysisStatus } = useAppSelector((state: RootState) => state.analysis);
    const { loggedInUser: { role, permissions, token, userId } } = useAppSelector((state: RootState) => state.authUser);

    const [selectedAllAnalysis, setSelectedAllAnalysis] = useState<IAnalysis[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleApply = () => {
        setCurrentPage(1); // Reset to first page when filter changes
    };

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

    const totalPages = Math.ceil(selectedAllAnalysis?.length / itemsPerPage);
    const [currentAllAnalysis, setCurrentAllAnalsis] = useState<IAnalysis[]>([]);

    useEffect(() => {
        // Update the current products for the current page
        setCurrentAllAnalsis(filteredAnalysis?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    }, [selectedAllAnalysis, currentPage]);

    // Handle page change to ensure it stays within valid page range
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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

    const getSortedAndGroupedAnalysis = () => {
        // Sort data based on total statistics
        const sorted = [...filteredAnalysis].sort((a, b) => {
            const totalA = a.statistics.views + a.statistics.reactions + 
                          a.statistics.comments + a.statistics.shares;
            const totalB = b.statistics.views + b.statistics.reactions + 
                          b.statistics.comments + b.statistics.shares;
            
            if (sortOrder === 'asc') {
                return totalA - totalB;
            } else if (sortOrder === 'desc') {
                return totalB - totalA;
            }
            return 0;
        });

        // Group analysis data
        let groupedData: Record<string, IAnalysis[]> = { '': [...sorted] };

        // Apply groupings in order
        if (groupings.sector) {
            const newGroupedData: Record<string, IAnalysis[]> = {};
            Object.entries(groupedData).forEach(([key, items]) => {
                items.forEach(item => {
                    const groupKey = key ? `${key} - ${item.sector.name}` : item.sector.name;
                    if (!newGroupedData[groupKey]) newGroupedData[groupKey] = [];
                    newGroupedData[groupKey].push(item);
                });
            });
            groupedData = newGroupedData;
        }

        if (groupings.addedBy) {
            const newGroupedData: Record<string, IAnalysis[]> = {};
            Object.entries(groupedData).forEach(([key, items]) => {
                items.forEach(item => {
                    const groupKey = key ? `${key} - ${item.addedByData?.name || 'Unknown'}` : item.addedByData?.name || 'Unknown';
                    if (!newGroupedData[groupKey]) newGroupedData[groupKey] = [];
                    newGroupedData[groupKey].push(item);
                });
            });
            groupedData = newGroupedData;
        }

        if (groupings.platform) {
            const newGroupedData: Record<string, IAnalysis[]> = {};
            Object.entries(groupedData).forEach(([key, items]) => {
                items.forEach(item => {
                    const groupKey = key ? `${key} - ${item.platform}` : item.platform;
                    if (!newGroupedData[groupKey]) newGroupedData[groupKey] = [];
                    newGroupedData[groupKey].push(item);
                });
            });
            groupedData = newGroupedData;
        }

        if (groupings.subAnalysis) {
            const newGroupedData: Record<string, IAnalysis[]> = {};
            Object.entries(groupedData).forEach(([key, items]) => {
                items.forEach(item => {
                    const groupKey = key ? `${key} - ${item.subAnalysis.body}` : item.subAnalysis.body;
                    if (!newGroupedData[groupKey]) newGroupedData[groupKey] = [];
                    newGroupedData[groupKey].push(item);
                });
            });
            groupedData = newGroupedData;
        }

        if (groupings.classify) {
            const newGroupedData: Record<string, IAnalysis[]> = {};
            Object.entries(groupedData).forEach(([key, items]) => {
                items.forEach(item => {
                    const groupKey = key ? `${key} - ${item.classify}` : item.classify;
                    if (!newGroupedData[groupKey]) newGroupedData[groupKey] = [];
                    newGroupedData[groupKey].push(item);
                });
            });
            groupedData = newGroupedData;
        }

        if (groupings.contentType) {
            const newGroupedData: Record<string, IAnalysis[]> = {};
            Object.entries(groupedData).forEach(([key, items]) => {
                items.forEach(item => {
                    const groupKey = key ? `${key} - ${item.content?.type}` : item.content?.type;
                    if (!newGroupedData[groupKey]) newGroupedData[groupKey] = [];
                    newGroupedData[groupKey].push(item);
                });
            });
            groupedData = newGroupedData;
        }

        return groupedData;
    };

    const groupedAnalysis = React.useMemo(() => getSortedAndGroupedAnalysis(), [filteredAnalysis, sortOrder, groupings]);

    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => {
        // Initialize with all groups expanded (false)
        const initialGroups: Record<string, boolean> = {};
        Object.keys(groupedAnalysis).forEach(key => {
            initialGroups[key] = true;
        });
        return initialGroups;
    });

    // Update collapsedGroups when groupedAnalysis changes
    useEffect(() => {
        setCollapsedGroups(prev => {
            const newGroups = { ...prev };
            Object.keys(groupedAnalysis).forEach(key => {
                if (!(key in newGroups)) {
                    newGroups[key] = true;
                }
            });
            return newGroups;
        });
    }, [groupedAnalysis]);

    const toggleGroup = (groupKey: string) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [groupKey]: !prev[groupKey]
        }));
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

    const renderTable = () => {
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
                    {Object.entries(groupedAnalysis).map(([groupKey, items]) => (
                        <React.Fragment key={groupKey}>
                            {groupKey && (
                                <tr className="bg-gray-50">
                                    <td colSpan={14} className="px-2 py-1 text-xs font-medium text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={isGroupFullySelected(groupKey, items)}
                                                onCheckedChange={() => handleGroupSelect(groupKey, items)}
                                                className={isGroupPartiallySelected(groupKey, items) ? "opacity-50" : ""}
                                            />
                                            <button
                                                onClick={() => toggleGroup(groupKey)}
                                                className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                                            >
                                                {collapsedGroups[groupKey] ? (
                                                    <ChevronRight className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </button>
                                            <span>{groupKey}</span>
                                            <span className="text-gray-500">({items.length})</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {(groupKey === "" || !collapsedGroups[groupKey]) && items.map((analysis) => {
                                const {
                                    _id,
                                    subAnalysis,
                                    classify,
                                    content,
                                    createdAt,
                                    platform,
                                    publisher,
                                    sector,
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
                                                <Image
                                                    // src={publisher?.avatar || '/logo.png'}
                                                    src={getImageURL({ imageURL: publisher.avatar, platform })}
                                                    alt="Publisher avatar"
                                                    width={50}
                                                    height={50}
                                                    className="rounded-md cursor-pointer transition-transform duration-200 group-hover:scale-105"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/logo.png';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200 rounded-md" />
                                            </div>
                                            <p className="">{publisher.name}</p>
                                        </th>
                                        <td className="px-2 py-1">{sector.name}</td>
                                        <td className={`px-2 py-1 ${classify === AnalysisClassifyEnum.POSITIVE ? 'text-green-600' : classify === AnalysisClassifyEnum.NEGATIVE ? 'text-red-600' : 'text-primary'}`}>{t(classify)}</td>
                                        <td className={`px-2 py-1`}>{subAnalysis.body}</td>
                                        <td className="px-2 py-1">{reactions}</td>
                                        <td className="px-2 py-1">{comments}</td>
                                        <td className="px-2 py-1">{shares}</td>
                                        <td className="px-2 py-1">{views}</td>
                                        <td className="px-2 py-1">{views + reactions + comments + shares}</td>
                                        <td className="px-2 py-1 w-fit">{formattedDate}</td>
                                        <th scope="row" className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap flex gap-2 justify-center items-center">
                                            <div 
                                                className="relative group"
                                                onMouseEnter={(e) => handleImageHover(e, addedByData?.avatar?.secure_url || '/logo.png', addedByData?.name || '')}
                                                onMouseLeave={handleImageLeave}
                                            >
                                                <Image
                                                    src={addedByData?.avatar?.secure_url}
                                                    alt="Added by avatar"
                                                    width={50}
                                                    height={50}
                                                    className="rounded-md cursor-pointer transition-transform duration-200 group-hover:scale-105"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/logo.png';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200 rounded-md" />
                                            </div>
                                            <p className="">{addedByData?.name}</p>
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
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="space-y-2">
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
                        <span>{t("showAllAnalysis")}:</span>
                        <span className="font-semibold text-secondary">{filteredAnalysis.length}</span>
                        {filteredAnalysis.length !== allAnalysis.length && (
                            <>
                                <span className="text-primary">/</span>
                                <span className="text-primary">{allAnalysis.length}</span>
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

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    {renderTable()}
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            {/* Selected items count */}
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
                        <Image
                            src={hoveredImage.src}
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
        </div>
    );
};

export default AllAnalysisTable;

