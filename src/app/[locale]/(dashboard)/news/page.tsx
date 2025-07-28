'use client'

import React, { useState, useEffect } from 'react';
import { RootState } from '@/lib/store';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { selectSideBarLink, setPageTitle } from '@/lib/features/layout/layoutSlice';
import Modal from '@/components/ui/Modal';
import { showAuthComponentsForNews } from '@/utils/authComponents';
import AllNewsTable from './components/AllNewsTable';
import AddNews from './components/Actions/AddNews';

const NewsPage = () => {
    const dispatch = useAppDispatch();
    const t = useTranslations("NewsPage");

    useEffect(() => {
        dispatch(setPageTitle(t("NewsPageTitle")));
    }, [dispatch, t]);
    useEffect(() => {
        dispatch(selectSideBarLink("news"));
    }, [dispatch]);

   const { loggedInUser: { role, permissions } } = useAppSelector((state: RootState) => state.authUser);

    const [isAddNewsModalOpen, setIsAddNewsModalOpen] = useState<boolean>(false)
    const closeAddNewsModal = () => setIsAddNewsModalOpen(false);

    return (
        <div className="">
            <div className="mb-6 w-full border shadow-md rounded-md bg-white min-h-[800px]">
                <div className="p-4 flex items-center justify-between">
                    <div className='flex flex-col gap-1'>
                        <h2 className="text-xl font-semibold text-secondary">{t("AllNewsTableTitle")}</h2>
                        {/* <p className="text-sm">{t("showAllNews")}: (<span className='text-secondary font-semibold'>{selectedAllNews?.length}</span> / {allAnalysis?.length})</p> */}
                    </div>
                    { 
                        showAuthComponentsForNews({ role, permissions }) && <div className="flex items-center gap-1 flex-end">
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
                    <AllNewsTable />
                </div>

            </div>
        </div>
    );
};

export default NewsPage;