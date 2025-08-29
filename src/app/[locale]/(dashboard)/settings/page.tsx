'use client'

import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { selectSideBarLink, setPageTitle } from '@/lib/features/layout/layoutSlice';
import { ILoggedInUser } from '@/interfaces';
import { useTranslations } from 'next-intl';
import SectorsTable from './_components/SectorsTable';
import SubAnalysisTable from './_components/SubAnalysisTable';

export type KeyName = keyof ILoggedInUser;

const DashboardPage = () => {
    const dispatch = useAppDispatch();
    const t = useTranslations("SettingsPage");
    const [activeTab, setActiveTab] = useState<'analytics' | 'sectors'>('analytics');

    useEffect(() => {
        dispatch(setPageTitle(t("settingsPageTitle")));
    }, [dispatch, t]);
    useEffect(() => {
        dispatch(selectSideBarLink("settings"));
    }, [dispatch]);

    return (
        <div className='bg-white min-h-screen'>
            <div className="flex border-b mb-4">
                <button
                    className={`px-4 py-2 focus:outline-none ${activeTab === 'sectors' ? 'border-b-2 border-secondary text-secondary font-bold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('sectors')}
                >
                    {t('sectorsTab')}
                </button>
                <button
                    className={`px-4 py-2 focus:outline-none ${activeTab === 'analytics' ? 'border-b-2 border-secondary text-secondary font-bold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('analytics')}
                >
                    {t('subAnalysisTab')}
                </button>
               
            </div>
            <div className='h-full overflow-auto'>
                {activeTab === 'analytics' && (
                    <SubAnalysisTable />
                )}
                {activeTab === 'sectors' && (
                    <SectorsTable />
                )}
            </div>
        </div>
    );
};

export default DashboardPage;