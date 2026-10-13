
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import AddAnalysis from "./AddAnalysis";
import AddNews from "./AddNews";
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks";

interface LayoutProps { }
const Layout = ({ }: LayoutProps) => {
    const t = useTranslations("AddMonitorPage");
    const { loggedInUser: { role, permissions } } = useAppSelector((state: RootState) => state.authUser);
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { id: 0, label: t("addSocialMediaMonitor") },
        { id: 1, label: t("addNewsMonitor") },
        // { id: 2, label: t("addEMideaMonitor") }
    ];



    const TabContent = ({ tabId }: { tabId: number }) => {
        switch (tabId) {
            case 0:
                return role === 'super_admin' || (permissions?.includes('manage_analysis')) ? <AddAnalysis /> : null;
            case 1:
                return role === 'super_admin' || (permissions?.includes('manage_news')) ? <AddNews /> : null;
            case 2:
                return null;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-0 h-full">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="w-full grid grid-cols-3 space-x-8 px-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? "border-secondary text-secondary"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                <TabContent tabId={activeTab} />
            </div>
        </div>
    );
};

export default Layout;