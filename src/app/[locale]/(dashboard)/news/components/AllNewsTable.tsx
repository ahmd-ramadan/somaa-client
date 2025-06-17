'use client'

import React from 'react';
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
    ChevronDown, 
    ChevronRight, 
    Eye as EyeIcon, 
    Edit,
    Trash2,
    SearchX,
    FilterX,
    AlertCircle,
    X,
    Download,
    FileDown
} from 'lucide-react';
import { fetchAllSectors } from "@/lib/features/sector/sectorThunks";
import toast from "react-hot-toast";
import { ApiResponse } from '@/utils/apiService';
import { showAuthComponentsForNews } from '@/utils/authComponents';
import { useNewsFilters } from '@/hooks/useNewsFilters';
import { deleteNews } from '@/lib/features/news/newsthunks';
import NewsFilters from './NewsFilters';
import ViewNews from './ViewNews';
import { INews, NewsClassifyEnum } from '@/interfaces/news.types';
import EditNews from './EditNews';
import ExportNewsModal from './ExportNewsModal';
import * as XLSX from 'xlsx';
import { Checkbox } from '@/components/ui/checkbox';
import { useSocket } from '@/hooks/useSocket';

interface GroupingState {
    sector?: boolean;
    addedBy?: boolean;
    adType?: boolean;
    pressType?: boolean;
    classify?: boolean;
    geoClassify?: boolean;
    contentType?: boolean;
}

interface AllNewsTableProps {
    allNews: INews[];
    setAllNews: (allNews: INews[]) => void
}

const AllNewsTable = ({ allNews, setAllNews }: AllNewsTableProps) => {
    const t = useTranslations("NewsPage.AllNewsTable")
    const t2 = useTranslations("DeleteModal");
    const locale = useLocale();
    const router = useRouter();

    const { loggedInUser: { token, role, permissions, userId } } = useAppSelector((state: RootState) => state.authUser);
    const { allSectors, allSectorsStatus } = useAppSelector((state: RootState) => state.sectors);

    const [selectedNewsId, setSelectedNewsId] = useState<string>('');
    const [selectedShowedImage, setSelectedShowedImage] = useState<string>('');
    const [isShowedImageModalOpen, setIsShowedImageModalOpen] = useState<boolean>(false);
    const [selectedNewsDetails, setSelectedNewsDetails] = useState<INews | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState<INews | null>(null);
    const [selectedNews, setSelectedNews] = useState<INews | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [hoveredImage, setHoveredImage] = useState<{
        src: string;
        name: string;
        position: { x: number; y: number };
    } | null>(null);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const {
        filters,
        setFilters,
        showFilters,
        setShowFilters,
        filteredNews
    } = useNewsFilters(allNews);

    const [groupings, setGroupings] = useState<GroupingState>({});
   

    const closeShowedImageModal = () => { setIsShowedImageModalOpen(false) };

    const dispatch = useAppDispatch();

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
        if (selectedNewsId) router.push(`/${locale}/news/${selectedNewsId}`);
    }, [selectedNewsId, router, locale]);

    useEffect(() => {
        if (allSectorsStatus === "idle") {
            dispatch(fetchAllSectors());
        }
    }, [dispatch, allSectorsStatus]);
    
    const getGroupedNews = () => {
        let groupedData: Record<string, INews[]> = { '': [...filteredNews] };

        // Apply groupings in order
        if (groupings.sector) {
            const newGroupedData: Record<string, INews[]> = {};
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
            const newGroupedData: Record<string, INews[]> = {};
            Object.entries(groupedData).forEach(([key, items]) => {
                items.forEach(item => {
                    const groupKey = key ? `${key} - ${item.addedByData?.name || 'Unknown'}` : item.addedByData?.name || 'Unknown';
                    if (!newGroupedData[groupKey]) newGroupedData[groupKey] = [];
                    newGroupedData[groupKey].push(item);
                });
            });
            groupedData = newGroupedData;
        }

        if (groupings.geoClassify) {
            const newGroupedData: Record<string, INews[]> = {};
            Object.entries(groupedData).forEach(([key, items]) => {
                items.forEach(item => {
                    const groupKey = key ? `${key} - ${item.geoClassify}` : item.geoClassify;
                    if (!newGroupedData[groupKey]) newGroupedData[groupKey] = [];
                    newGroupedData[groupKey].push(item);
                });
            });
            groupedData = newGroupedData;
        }

        if (groupings.classify) {
            const newGroupedData: Record<string, INews[]> = {};
            Object.entries(groupedData).forEach(([key, items]) => {
                items.forEach(item => {
                    const groupKey = key ? `${key} - ${item.classify}` : item.classify;
                    if (!newGroupedData[groupKey]) newGroupedData[groupKey] = [];
                    newGroupedData[groupKey].push(item);
                });
            });
            groupedData = newGroupedData;
        }

        if (groupings.adType) {
            const newGroupedData: Record<string, INews[]> = {};
            Object.entries(groupedData).forEach(([key, items]) => {
                items.forEach(item => {
                    const groupKey = key ? `${key} - ${item.adType}` : item.adType;
                    if (!newGroupedData[groupKey]) newGroupedData[groupKey] = [];
                    newGroupedData[groupKey].push(item);
                });
            });
            groupedData = newGroupedData;
        }

        if (groupings.pressType) {
            const newGroupedData: Record<string, INews[]> = {};
            Object.entries(groupedData).forEach(([key, items]) => {
                items.forEach(item => {
                    const groupKey = key ? `${key} - ${item.pressType}` : item.pressType;
                    if (!newGroupedData[groupKey]) newGroupedData[groupKey] = [];
                    newGroupedData[groupKey].push(item);
                });
            });
            groupedData = newGroupedData;
        }

        return groupedData;
    };

    const groupedNews = getGroupedNews();

    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => {
        // Initialize with all groups expanded (false)
        const initialGroups: Record<string, boolean> = {};
        Object.keys(groupedNews).forEach(key => {
            initialGroups[key] = true;
        });
        return initialGroups;
    });

    // Update collapsedGroups when groupedAnalysis changes
    useEffect(() => {
        setCollapsedGroups(prev => {
            const newGroups = { ...prev };
            Object.keys(groupedNews).forEach(key => {
                if (!(key in newGroups)) {
                    newGroups[key] = true;
                }
            });
            return newGroups;
        });
    }, [groupedNews]);
    

    const toggleGroup = (groupKey: string) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [groupKey]: !prev[groupKey]
        }));
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
            setAllNews(updatedNewsList);
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
        if (!newsToDelete) return;

        try {
            const action = await dispatch(deleteNews({ 
                token: token as string, 
                newsId: newsToDelete._id,
            }));
            
            const res = action.payload as ApiResponse<INews | null>;
            const { success, message, data } = res;
            if(success) {
                const updatedNewsList = allNews.filter(news => news._id.toString() !== newsToDelete._id.toString());
                setAllNews(updatedNewsList);
                closeDeleteModal();

                if(isConnected) socket?.emit('deleteNews', data?._id)
                    
                toast.success(message || t("NewsDeletedSuccessfully"));
            } else {
                toast.error(message || t("failedToDeleteNews"));
            }
        } catch (error) {
            console.error('Error deleting News:', error);
            toast.error( t("failedToDeleteNews"));
        }
    };
    
    const openViewModal = (news: INews) => {
        setIsViewModalOpen(true);
        setSelectedNews(news);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedNews(null);
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

    // Add selection handlers
    const toggleRowSelection = (newsId: string) => {
        setSelectedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(newsId)) {
                newSet.delete(newsId);
            } else {
                newSet.add(newsId);
            }
            return newSet;
        });
    };

    const toggleAllRows = () => {
        if (selectedRows.size === filteredNews.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(filteredNews.map(news => news._id)));
        }
    };

    const handleExport = (format: 'csv' | 'excel', selectedFields: string[]) => {
        const selectedNews = filteredNews.filter(news => selectedRows.has(news._id));
        const data = selectedNews.map(news => {
            const row: Record<string, any> = {};
            selectedFields.forEach(field => {
                switch (field) {
                    case 'title':
                        row[field] = news.title;
                        break;
                    case 'sector':
                        row[field] = news.sector.name;
                        break;
                    case 'classify':
                        row[field] = news.classify;
                        break;
                    case 'geoClassify':
                        row[field] = news.geoClassify;
                        break;
                    case 'adType':
                        row[field] = news.adType;
                        break;
                    case 'pressType':
                        row[field] = news.pressType;
                        break;
                    case 'newspaper':
                        row[field] = news.newspaper;
                        break;
                    case 'createdAt':
                        row[field] = formatDate({ locale, date: news.createdAt, withTime: true });
                        break;
                    case 'addedBy':
                        row[field] = news.addedByData?.name;
                        break;
                    case 'url':
                        row[field] = news.url;
                        break;
                }
            });
            return row;
        });

        if (format === 'csv') {
            const csv = [
                selectedFields.join(','),
                ...data.map(row => selectedFields.map(field => row[field]).join(','))
            ].join('\n');

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `news_export_${new Date().toISOString()}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // TODO: Implement Excel export
            console.log('Excel export not implemented yet');
        }
    };

    const renderTable = () => {
        if (Object.keys(groupedNews).length === 0 || allNews.length == 0 || filteredNews.length === 0) {
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
                    {allNews.length == 0 || filteredNews.length === 0 && (
                        <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                            <AlertCircle className="w-4 h-4" />
                            <span>{t("noNewsData")}</span>
                        </div>
                    )}
                </div>
            );
        }

        return (
                    <table className={`min-w-full divide-y divide-gray-200 text-xs`}>
                        <thead className="bg-primary/20 text-semibold text-sm text-primary">
                            <tr>
                                <th scope="col" className="px-2 py-1">
                                    <Checkbox
                                        checked={selectedRows.size === filteredNews.length}
                                        onCheckedChange={toggleAllRows}
                                    />
                                </th>
                                <th scope="col" className="px-2 py-1">{t("title")}</th>
                                <th scope="col" className="px-2 py-1">{t("sector")}</th>
                                <th scope="col" className="px-2 py-1">{t("classify")}</th>
                                <th scope="col" className="px-2 py-1">{t("geoClassify")}</th>
                                <th scope="col" className="px-2 py-1">{t("adType")}</th>
                                <th scope="col" className="px-2 py-1">{t("newspaper")}</th>
                                <th scope="col" className="px-2 py-1">{t("pressType")}</th>
                                <th scope="col" className="px-2 py-1">{t("createdAt")}</th>
                                <th scope="col" className="px-2 py-1">{t("addedBy")}</th>
                                <th scope="col" className="px-2 py-1">{t("actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-xs">
                            {Object.entries(groupedNews).map(([groupKey, items]) => (
                                <React.Fragment key={groupKey}>
                                    {groupKey && (
                                        <tr className="bg-gray-50">
                                            <td colSpan={14} className="px-2 py-1 text-xs font-medium text-gray-900">
                                                <div className="flex items-center gap-2">
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
                                    {(groupKey === '' || !collapsedGroups[groupKey]) && items.map((news) => {
                                        const {
                                            _id,
                                            adType,
                                            classify,
                                            pressType,
                                            geoClassify,
                                            createdAt,
                                            sector,
                                            url,
                                            title,
                                            addedBy,
                                            addedByData,
                                            newspaper
                                        } = news;

                                const formattedDate = formatDate({ 
                                    locale, 
                                    date: createdAt, 
                                    withTime: true 
                                });

                                        return (
                                            <tr key={_id} className="hover:bg-primary/20">
                                                <td className="px-2 py-1">
                                                    <Checkbox
                                                        checked={selectedRows.has(_id)}
                                                        onCheckedChange={() => toggleRowSelection(_id)}
                                                    />
                                                </td>
                                                <td className="px-2 py-1">
                                                    <Link
                                                        className="text-secondary font-semibold underline"
                                                        href={url}
                                                    >
                                                        {title}
                                                    </Link>
                                                </td>
                                                <td className="px-2 py-1">{sector.name}</td>
                                                <td className={`px-2 py-1 ${classify === NewsClassifyEnum.POSITIVE ? 'text-green-600' : classify === NewsClassifyEnum.NEGATIVE ? 'text-red-600' : 'text-primary'}`}>{t(classify)}</td>
                                                <td className={`px-2 py-1`}>{t(geoClassify)}</td>
                                                <td className={`px-2 py-1`}>{t(adType)}</td>
                                                <td className={`px-2 py-1`}>{newspaper}</td>
                                                <td className={`px-2 py-1`}>{t(pressType)}</td>
                                                <td className="px-2 py-1 w-fit">{formattedDate}</td>
                                                    <th scope="row" className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap flex gap-2 justify-center items-center">
                                                        <div 
                                                            className="relative group"
                                                            onMouseEnter={(e) => handleImageHover(e, addedByData?.avatar?.secure_url || '/logo.png', addedByData?.name || '')}
                                                            onMouseLeave={handleImageLeave}
                                                        >
                                                            <Image
                                                                src={addedByData?.avatar?.secure_url || '/logo.png'}
                                                        alt="Added by avatar"
                                                                width={50}
                                                                height={50}
                                                        className="rounded-md cursor-pointer transition-transform duration-200 group-hover:scale-105"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.src = '/logo.png';
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200 rounded-md" /></div>
                                                            <p className="">{addedByData?.name}</p>
                                                        </th>
                                                <td className="px-2 py-1">
                                                    <div className="flex items-center gap-2">
                                                        {showAuthComponentsForNews({ role, permissions }) 
                                                            && (addedBy.toString() === userId.toString()) ?
                                                            <>
                                                            <Edit
                                                                className="w-5 h-5 text-adminPrimary hover:bg-adminPrimary hover:text-white rounded-md cursor-pointer p-1"
                                                                onClick={() => openDetailsModal(news)}
                                                            />
                                                                <Trash2
                                                                    className="w-5 h-5 text-red-500 hover:bg-red-500 hover:text-white rounded-md cursor-pointer p-1"
                                                                    onClick={() => openDeleteModal(news)}
                                                                />
                                                            </>
                                                            : 
                                                            <>
                                                                <EyeIcon
                                                                    className="w-5 h-5 text-adminPrimary hover:bg-adminPrimary hover:text-white rounded-md cursor-pointer p-1"
                                                                    onClick={() => openViewModal(news)}
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
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <NewsFilters
                    filters={filters}
                    setFilters={setFilters}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    groupings={groupings}
                    setGroupings={setGroupings}
                    allNews={allNews}
                />
            </div>

            <div className="px-2 font-semibold flex items-center justify-between text-xs text-primary">
                <div className="flex items-center justify-between gap-2 w-full">
                    <div>
                        <span>{t("showAllAnalysis")}:</span>
                        <span className="font-semibold text-secondary">{filteredNews.length}</span>
                        {filteredNews.length !== allNews.length && (
                            <>
                                <span className="text-primary">/</span>
                                <span className="text-primary">{allNews.length}</span>
                            </>
                        )}

                    </div>
                    { selectedRows.size > 0 && <button
                        onClick={() => setIsExportModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <FileDown className="w-4 h-4" />
                        <span>{t("exportToExcel")}</span>
                    </button> }
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    {renderTable()}
                </div>
            </div>

            <Modal isOpen={isDetailsModalOpen} closeModal={closeDetailsModal} title={t("newsDetails")}>
                {selectedNewsDetails && (
                    <EditNews
                        news={selectedNewsDetails}
                        onSave={handleSave}
                        onCancel={closeDetailsModal}
                    />
                )}
            </Modal>

            <Modal isOpen={isDeleteModalOpen} closeModal={closeDeleteModal} title={t("deleteNewsModalTitle")}>
                <div className="p-4 space-y-4">
                    <p className="text-primary">{t2("deleteModalPharse", { item: t("deleteNewsPharse")})}</p>
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

            <Modal
                isOpen={isViewModalOpen}
                closeModal={closeViewModal}
                title={t("viewNewsModalTitle")}
            >
                { selectedNews && <ViewNews news={selectedNews} /> }
            </Modal>

            <ExportNewsModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                data={filteredNews.filter(news => selectedRows.has(news._id))}
            />

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
                            width={300}
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
        </div>
    );
};

export default AllNewsTable;

