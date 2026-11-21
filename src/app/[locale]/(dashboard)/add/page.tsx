'use client'

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { selectSideBarLink, setPageTitle } from '@/lib/features/layout/layoutSlice';
import Layout from './components/Layout';

const AddMonitorPage = () => {
    const dispatch = useAppDispatch();
    const t = useTranslations("AddMonitorPage");

    useEffect(() => {
        dispatch(setPageTitle(t("addMonitorPageTitle")));
    }, [dispatch, t]);
    useEffect(() => {
        dispatch(selectSideBarLink("addMonitor"));
    }, [dispatch]);

    // const { loggedInUser: { role, permissions } } = useAppSelector((state: RootState) => state.authUser);

    return (
        <div className="backround-pattern">
            <div className="bg-white w-full border shadow-md rounded-md min-h-screen">
                <div className="p-4 flex items-center justify-between">
                    <div className='flex flex-col gap-1'>
                        <h2 className="text-lg font-semibold text-secondary">{t("addMonitorPageTitle")}</h2>
                    </div>
                </div>
                    
                <div className="relative overflow-x-auto sm:rounded-lg">
                    <Layout  />
                </div>
            </div>
        </div>
    );
};

export default AddMonitorPage;