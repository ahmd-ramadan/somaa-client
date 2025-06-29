'use client'

import React, { useState, useEffect } from 'react';
import { RootState } from '@/lib/store';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { selectSideBarLink, setPageTitle } from '@/lib/features/layout/layoutSlice';
import Modal from '@/components/ui/Modal';
import AddAnalysis from '@/app/[locale]/(dashboard)/social-media/components/AddAnalysis';
import AllAnalysisTable from '@/app/[locale]/(dashboard)/social-media/components/AllAnalysisTable';
import { showAuthComponentsForAnalysis } from '@/utils/authComponents';

const SocialMediaPage = () => {
    const dispatch = useAppDispatch();
    const t = useTranslations("SocialMediaPage");

    useEffect(() => {
        dispatch(setPageTitle(t("socialMediaPageTitle")));
    }, [dispatch, t]);
    useEffect(() => {
        dispatch(selectSideBarLink("social-media"));
    }, [dispatch]);

    const { loggedInUser: { role, permissions } } = useAppSelector((state: RootState) => state.authUser);
    const [isAddAnalysisModalOpen, setIsAddAnalysisModalOpen] = useState<boolean>(false)
    const closeAddAnalysisModal = () => setIsAddAnalysisModalOpen(false);

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
                    <AllAnalysisTable />
                </div>
            </div>
        </div>
    );
};

export default SocialMediaPage;