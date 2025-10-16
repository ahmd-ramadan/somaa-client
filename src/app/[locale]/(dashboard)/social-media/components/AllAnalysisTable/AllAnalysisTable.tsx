'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from "next-intl";
import { 
    SearchX,
    FilterX,
    FileDown,
    RefreshCcw,
    X,
    Filter,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { fetchAllSectors } from "@/lib/features/sector/sectorThunks";
import { fetchAllSubAnalysis } from "@/lib/features/subAnalysis/subAnalysisThunks";
import AnalysisFilters from "../AnalysisFilters";
import ExportModal from "../ExportModal";
import Spinner from '@/components/ui/Spinner';

// Import our custom hook and components
import { useAnalysisTable } from './hooks/useAnalysisTable';
import TableHeader from './components/TableHeader';
import TableBody from './components/TableBody';
import TableModals from './components/TableModals';
import Pagination from './components/Pagination';
import { AllAnalysisTableProps } from './types';

const AllAnalysisTable: React.FC<AllAnalysisTableProps> = () => {
    const t = useTranslations("SocialMediaPage.AllAnalysisTable");
    const t2 = useTranslations("DeleteModal");
    const dispatch = useAppDispatch();

    const { allSectorsStatus } = useAppSelector((state: RootState) => state.sectors);
    const { allSubAnalysisStatus } = useAppSelector((state: RootState) => state.subAnalysis);
    const { pagenation } = useAppSelector((state: RootState) => state.analysis);

    // Use our custom hook for all table logic
    const {
        // State
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
        isDetailsModalOpen,
        selectedAnalysisDetails,
        isDeleteModalOpen,
        selectedAnalysis,
        isViewModalOpen,

        // Actions
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
    } = useAnalysisTable();

    // State for image hover functionality
    const [hoveredImage, setHoveredImage] = useState<{
        src: string;
        name: string;
        position: { x: number; y: number };
    } | null>(null);

    const pageHeader = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    // Update header height when component mounts or header changes
    useEffect(() => {
        if (pageHeader.current) {
            const updateHeight = () => {
                const height = pageHeader.current?.offsetHeight || 0;
                setHeaderHeight(height);
            };
            
            updateHeight();
            window.addEventListener('resize', updateHeight);
            
            return () => window.removeEventListener('resize', updateHeight);
        }
    }, [showFilters]);

    // Fetch additional data
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

    // Get grouped analysis data - memoized for performance
    const groupedAnalysis = React.useMemo(() => getSortedAndGroupedAnalysis, [getSortedAndGroupedAnalysis]);
    
    // Memoize expensive calculations
    const totalItems = React.useMemo(() => filteredAnalysis.length, [filteredAnalysis.length]);
    const hasData = React.useMemo(() => totalItems > 0, [totalItems]);

    // Image hover handlers
    // const handleImageHover = (e: React.MouseEvent<HTMLDivElement>, imageSrc: string, name: string) => {
    //     const rect = e.currentTarget.getBoundingClientRect();
    //     setHoveredImage({
    //         src: imageSrc,
    //         name,
    //         position: {
    //             x: rect.left + window.scrollX,
    //             y: rect.top + window.scrollY
    //         }
    //     });
    // };

    const handleImageLeave = () => {
        setHoveredImage(null);
    };

    // Render loading state
    if (allAnalysisStatus === 'loading') {
        return (
            <div 
                className="flex flex-col items-center justify-center py-16 text-gray-500  rounded-lg"
                style={{ minHeight: `calc(100vh - 120px)` }}    
            >
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full">
                    <Spinner size="100px"/>
                </div>
                <div className="text-xl font-semibold mb-2 text-primary">{t("loadingData")}</div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{t("fetchingFromDatabase")}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-0 min-h-svh">
            {/* Performance Monitor */}
            {/* <PerformanceMonitor 
                dataSize={filteredAnalysis.length} 
                componentName="AllAnalysisTable"
                enabled={true}
            /> */}
            
            {/* Fixed Filters Section at Top */}
            <div ref={pageHeader} className="sticky top-0 z-40 bg-transparent border-b border-gray-200 shadow-sm">
                {/* Filters Toggle Button */}
                <div className="px-4 py-1 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">
                                {t("showAllAnalysis")}: 
                            </span>
                            <span className="font-semibold text-secondary">
                                {totalItems}
                            </span>
                            { 
                                pagenation.totalPages > pagenation.page && (
                                    <button
                                        onClick={handleShowMore}
                                        className='flex items-center gap-2 px-2 py-1 bg-primary hover:bg-secondary text-white rounded-lg hover:bg-primary/90 transition-colors text-xs'
                                    >
                                        <span>{t("showMore")}</span>
                                    </button> 
                                )
                            }
                            {/* {selectedItems.size > 0 && (
                                <button
                                    onClick={() => {
                                        setSelectedItems(new Set());
                                        setSelectedGroups(new Set());
                                        setCurrentPage(1);
                                    }}
                                    className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                                >
                                    {t("showAll")}
                                </button>
                            )} */}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                                <Filter className="w-4 h-4" />
                                {/* <span>{t("filters")}</span> */}
                                {showFilters ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                            </button>
                            {selectedItems.size > 0 && (
                                <button
                                    onClick={() => setIsUpdateGroupOfAnalysisModalOpen(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                                >
                                    <RefreshCcw className="w-4 h-4" />
                                    <span>{t("updategroupOfAnalysis")}</span>
                                </button>
                            )}
                            {selectedItems.size > 0 && (
                                <button
                                    onClick={() => setIsExportModalOpen(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                                >
                                    <FileDown className="w-4 h-4" />
                                    <span>{t("exportToExcel")}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters Content - Collapsible */}
                {showFilters && (
                    <div className="px-4 py-3">
                        <AnalysisFilters
                            filters={filters}
                            setFilters={setFilters}
                            showFilters={showFilters}
                            setShowFilters={setShowFilters}
                            groupings={groupings}
                            setGroupings={setGroupings}
                            allAnalysis={filteredAnalysis}
                        />
                    </div>
                )}
            </div>

            {/* No Data State */}
            {!hasData && (
                <div 
                    className="flex flex-col items-center justify-center py-16 text-gray-500 rounded-lg" 
                    style={{ minHeight: `calc(100vh - ${headerHeight}px - 120px)` }}
                >
                    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full">
                        <SearchX className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="text-xl font-semibold mb-2 text-primary">{t("noDataFound")}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FilterX className="w-4 h-4" />
                        <span>{t("tryAdjustingFilters")}</span>
                    </div>
                </div>
            )}

            {/* Table Container */}
            {hasData && (
                <div className="shadow-sm relative">
                    {/* Grouping Loading Indicator */}
                    {isGroupingLoading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                            <div className="flex items-center gap-2 text-primary">
                                <Spinner size="20px" />
                                <span className="text-sm font-medium">{t("groupingData")}</span>
                            </div>
                        </div>
                    )}
                    
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-xs">
                            <TableHeader
                                selectedItems={selectedItems}
                                allAnalysis={filteredAnalysis}
                                setSelectedItems={setSelectedItems}
                                setSelectedGroups={setSelectedGroups}
                                groupedAnalysis={groupedAnalysis}
                                sortOrder={sortOrder}
                                toggleSortOrder={toggleSortOrder}
                                t={t}
                            />
                            <TableBody
                                groupedAnalysis={groupedAnalysis}
                                collapsedGroups={collapsedGroups}
                                selectedItems={selectedItems}
                                selectedGroups={selectedGroups}
                                handleItemSelect={handleItemSelect}
                                handleGroupSelect={handleGroupSelect}
                                isGroupFullySelected={isGroupFullySelected}
                                isGroupPartiallySelected={isGroupPartiallySelected}
                                toggleGroup={toggleGroup}
                                openDetailsModal={openDetailsModal}
                                openDeleteModal={openDeleteModal}
                                openViewModal={openViewModal}
                                role={role}
                                permissions={permissions}
                                userId={userId}
                                t={t}
                            />
                        </table>
                    </div>
                </div>
            )}

            {/* Selection indicator */}
            {selectedItems.size > 0 && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 rounded-lg shadow-lg px-4 py-2 flex items-center gap-2">
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

            {/* Modals */}
            <TableModals
                isDetailsModalOpen={isDetailsModalOpen}
                closeDetailsModal={closeDetailsModal}
                selectedAnalysisDetails={selectedAnalysisDetails}
                handleSave={handleSave}
                isDeleteModalOpen={isDeleteModalOpen}
                closeDeleteModal={closeDeleteModal}
                handleDelete={handleDelete}
                isUpdateGroupOfAnalysisModalOpen={isUpdateGroupOfAnalysisModalOpen}
                closeUpdateGroupOfAnalysisModal={closeUpdateGroupOfAnalysisModal}
                handleUpdateGroupOfAnalysis={handleUpdateGroupOfAnalysis}
                isViewModalOpen={isViewModalOpen}
                closeViewModal={closeViewModal}
                selectedAnalysis={selectedAnalysis}
                updateGroupOfAnalysisStatus={updateGroupOfAnalysisStatus}
                t={t}
                t2={t2}
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

            {/* Export Modal */}
            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                data={filteredAnalysis.filter(f => selectedItems.has(f?._id?.toString() || ""))}
            />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                filteredAnalysis={filteredAnalysis}
                activeGroupings={activeGroupingKeys}
                selectedItems={selectedItems}
                t={t}
            />
        </div>
    );
};

export default AllAnalysisTable; 