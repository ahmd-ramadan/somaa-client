'use client';

import { selectSideBarLink, setPageTitle } from "@/lib/features/layout/layoutSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
const DashboardPage = () => {

    const t = useTranslations('DashboardPage');
    const locale = useLocale();

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setPageTitle(t("dashboardPageTitle")));
    }, [dispatch, t]);
    useEffect(() => {
        dispatch(selectSideBarLink("dashboard"));
    }, [dispatch]);

    // return (
    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //         {/* Your existing dashboard content */}
    //         <div className="md:col-span-1">
    //             <OnlineUsers />
    //         </div>
    //     </div> 
    // );
    return (
        <DashboardLayout />
    )
}

export default DashboardPage;
