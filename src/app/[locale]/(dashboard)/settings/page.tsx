'use client'

import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { selectSideBarLink, setPageTitle } from '@/lib/features/layout/layoutSlice';
import { ILoggedInUser } from '@/interfaces';
import { useTranslations } from 'next-intl';
import { Layers, ListChecks, Newspaper, Share2 } from 'lucide-react';
import SectorsTable from './_components/SectorsTable';
import SubAnalysisTable from './_components/SubAnalysisTable';
import NewspapersTable from './_components/NewspapersTable';
import SocialProfilesTable from './_components/SocialProfilesTable';

export type KeyName = keyof ILoggedInUser;

const SettingsPage = () => {
    const dispatch = useAppDispatch();
    const t = useTranslations("SettingsPage");
    const [activeTab, setActiveTab] = useState<'analytics' | 'sectors' | 'newspapers' | 'profiles'>('sectors');

    useEffect(() => {
        dispatch(setPageTitle(t("settingsPageTitle")));
    }, [dispatch, t]);
    useEffect(() => {
        dispatch(selectSideBarLink("settings"));
    }, [dispatch]);

    const tabs = [
        { key: 'sectors', label: t('sectorsTab'), icon: Layers },
        { key: 'analytics', label: t('subAnalysisTab'), icon: ListChecks },
        { key: 'newspapers', label: t('newspapersTab'), icon: Newspaper },
        { key: 'profiles', label: t('socialProfilesTab'), icon: Share2 },
    ] as const;

    return (
        <div className='bg-white min-h-screen'>
            <div className="w-full max-w-full mb-5 p-1 bg-primary/5 border border-primary/10 rounded-2xl overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-1 min-w-max">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 lg:px-4 py-2 text-sm transition-all ${isActive
                                    ? 'bg-white text-primary font-semibold shadow-sm ring-1 ring-secondary'
                                    : 'text-gray-500 hover:text-primary hover:bg-white/70'
                                    }`}
                            >
                                <Icon
                                    size={16}
                                    className={isActive ? 'text-secondary' : 'text-gray-400 group-hover:text-secondary transition-colors'}
                                />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className='h-full overflow-auto'>
                {activeTab === 'analytics' && (
                    <SubAnalysisTable />
                )}
                {activeTab === 'sectors' && (
                    <SectorsTable />
                )}
                {activeTab === 'newspapers' && (
                    <NewspapersTable />
                )}
                {activeTab === 'profiles' && (
                    <SocialProfilesTable />
                )}
            </div>
        </div>
    );
};

export default SettingsPage;