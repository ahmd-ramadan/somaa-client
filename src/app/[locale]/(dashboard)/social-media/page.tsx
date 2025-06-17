'use client'

import React, { useState, useEffect, ChangeEvent } from 'react';
import Pagination from '@/components/ui/Pagination';
import { RootState } from '@/lib/store';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useLocale, useTranslations } from 'next-intl';
import { selectSideBarLink, setPageTitle } from '@/lib/features/layout/layoutSlice';
import { IAnalysis } from '@/interfaces/analysis.types';
import { fetchAllAnalysis } from '@/lib/features/socialMedia/analysisThunks';
import Modal from '@/components/ui/Modal';
import AddAnalysis from '@/app/[locale]/(dashboard)/social-media/components/AddAnalysis';
import AllAnalysisTable from '@/app/[locale]/(dashboard)/social-media/components/AllAnalysisTable';
import { showAuthComponentsForAnalysis } from '@/utils/authComponents';

const SocialMediaPage = () => {
    const dispatch = useAppDispatch();
    const locale = useLocale();
    const t = useTranslations("SocialMediaPage");

    useEffect(() => {
        dispatch(setPageTitle(t("socialMediaPageTitle")));
    }, [dispatch, t]);
    useEffect(() => {
        dispatch(selectSideBarLink("social-media"));
    }, [dispatch]);

    const { allAnalysis, allAnalysisStatus, addAnalysisStatus } = useAppSelector((state: RootState) => state.analysis);
    const { loggedInUser: { role, permissions } } = useAppSelector((state: RootState) => state.authUser);

    const [selectedAllAnalysis, setSelectedAllAnalysis] = useState<IAnalysis[]>([]);
    const [isAddAnalysisModalOpen, setIsAddAnalysisModalOpen] = useState<boolean>(false)
    const closeAddAnalysisModal = () => setIsAddAnalysisModalOpen(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleApply = () => {
        setCurrentPage(1); // Reset to first page when filter changes
    };

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
        setCurrentAllAnalsis(selectedAllAnalysis?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    }, [selectedAllAnalysis, currentPage]);

    // Handle page change to ensure it stays within valid page range
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    
    // if(!selectedAllAnalysis || !selectedAllAnalysis?.length ) {
    //     return null;
    // }

    return (
        <div className="">
            <div className="w-full border shadow-md rounded-md bg-white min-h-screen">
                <div className="p-4 flex items-center justify-between">
                    <div className='flex flex-col gap-1'>
                        <h2 className="text-lg font-semibold text-primary">{t("AllAnalysisTableTitle")}</h2>
                        {/* <p className="text-sm">{t("showAllAnalysis")}: (<span className='text-secondary font-semibold'>{selectedAllAnalysis?.length}</span> / {allAnalysis?.length})</p> */}
                    </div>
                    { 
                        showAuthComponentsForAnalysis({ role, permissions }) && <div className="flex items-center gap-1 flex-end">
                            <button 
                                    className="p-2 bg-secondary text-white rounded-md"
                                    onClick={() => setIsAddAnalysisModalOpen(true)}
                                >
                                    {t("addBtn")}
                                </button>
                                <Modal isOpen={isAddAnalysisModalOpen} closeModal={closeAddAnalysisModal} title={t("addModalTitle")}>
                                    <AddAnalysis />
                                </Modal>
                        </div> 
                    }
                </div>
                    
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <AllAnalysisTable allAnalysis={currentAllAnalysis} setAllAnalysis={setCurrentAllAnalsis} />
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default SocialMediaPage;