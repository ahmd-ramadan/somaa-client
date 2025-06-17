'use client'

import React, { useState, useEffect } from 'react';
import Pagination from '@/components/ui/Pagination';
import { RootState } from '@/lib/store';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { selectSideBarLink, setPageTitle } from '@/lib/features/layout/layoutSlice';
import Modal from '@/components/ui/Modal';
import { showAuthComponentsForAnalysis } from '@/utils/authComponents';
import { INews } from '@/interfaces/news.types';
import { fetchAllNews } from '@/lib/features/news/newsthunks';
import AllNewsTable from './components/AllNewsTable';
import AddNews from './components/AddNews';

const NewsPage = () => {
    const dispatch = useAppDispatch();
    const t = useTranslations("NewsPage");

    useEffect(() => {
        dispatch(setPageTitle(t("NewsPageTitle")));
    }, [dispatch, t]);
    useEffect(() => {
        dispatch(selectSideBarLink("news"));
    }, [dispatch]);

    const { allNews, allNewsstatus, addNewsStatus } = useAppSelector((state: RootState) => state.news);
    const { loggedInUser: { role, permissions } } = useAppSelector((state: RootState) => state.authUser);

    const [selectedAllNews, setSelectedAllNews] = useState<INews[]>([]);
    const [isAddNewsModalOpen, setIsAddNewsModalOpen] = useState<boolean>(false)
    const closeAddNewsModal = () => setIsAddNewsModalOpen(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleApply = () => {
        setCurrentPage(1); // Reset to first page when filter changes
    };

    useEffect(() => {
        if (allNewsstatus === 'idle') {
            dispatch(fetchAllNews({}));
        }
    }, [dispatch, allNewsstatus]);

    useEffect(() => {
        if (allNewsstatus === 'succeeded' || addNewsStatus === 'succeeded') {
            setSelectedAllNews(allNews);
        }
    }, [allNews, allNewsstatus, addNewsStatus]);

    const totalPages = Math.ceil(selectedAllNews?.length / itemsPerPage);
    const [currentAllNews, setCurrentAllNews] = useState<INews[]>([]);

    useEffect(() => {
        // Update the current products for the current page
        setCurrentAllNews(selectedAllNews?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    }, [selectedAllNews, currentPage]);

    // Handle page change to ensure it stays within valid page range
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="">
            <div className="mb-6 w-full border shadow-md rounded-md bg-white min-h-[800px]">
                <div className="p-4 flex items-center justify-between">
                    <div className='flex flex-col gap-1'>
                        <h2 className="text-xl font-semibold text-primary">{t("AllNewsTableTitle")}</h2>
                        {/* <p className="text-sm">{t("showAllNews")}: (<span className='text-secondary font-semibold'>{selectedAllNews?.length}</span> / {allAnalysis?.length})</p> */}
                    </div>
                    { 
                        showAuthComponentsForAnalysis({ role, permissions }) && <div className="flex items-center gap-1 flex-end">
                            <button 
                                    className="p-2 bg-secondary text-white rounded-md"
                                    onClick={() => setIsAddNewsModalOpen(true)}
                                >
                                    {t("addBtn")}
                                </button>
                                <Modal isOpen={isAddNewsModalOpen} closeModal={closeAddNewsModal} title={t("addModalTitle")}>
                                    <AddNews />
                                </Modal>
                        </div> 
                    }
                </div>
                    
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <AllNewsTable allNews={currentAllNews} setAllNews={setCurrentAllNews} />
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

export default NewsPage;