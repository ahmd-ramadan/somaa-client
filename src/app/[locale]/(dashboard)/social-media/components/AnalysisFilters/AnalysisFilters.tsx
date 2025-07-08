import React from 'react';
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/lib/hooks";
import { AnalysisFiltersProps } from './types';
import FilterMenu from './components/FilterMenu';
import GroupingMenu from './components/GroupingMenu';
import FilterTypeMenu from './components/FilterTypeMenu';
import ActiveFiltersDisplay from './components/ActiveFiltersDisplay';

const AnalysisFilters: React.FC<AnalysisFiltersProps> = ({ 
    filters, 
    setFilters, 
    showFilters, 
    setShowFilters, 
    groupings = {},
    setGroupings,
    allAnalysis,
    onAnalysisSelect,
    onAnalysisDelete
}) => {
    const t = useTranslations("SocialMediaPage.AllAnalysisTable");
    const dispatch = useAppDispatch();

    const toggleGrouping = (key: keyof typeof groupings) => {
        setGroupings(prev => {
            const isActive = prev[key]?.active;
            if (isActive) {
                return {
                    ...prev,
                    [key]: { active: false }
                };
            } else {
                const maxOrder = Math.max(0, ...Object.values(prev).map(g => g.order || 0));
                return {
                    ...prev,
                    [key]: { active: true, order: maxOrder + 1 }
                };
            }
        });
    };

    const resetGrouping = () => {
        setGroupings({});
    };

    return (
        <div className="w-full">
            {/* Filter Controls */}
            <div className="flex items-center gap-3 flex-wrap mb-3">
                {/* Filter Menu */}
                <FilterMenu
                    filters={filters}
                    setFilters={setFilters}
                    allAnalysis={allAnalysis}
                    t={t}
                />

                {/* Grouping Menu */}
                <GroupingMenu
                    groupings={groupings}
                    toggleGrouping={toggleGrouping}
                    t={t}
                />

                {/* Filter Type Menu */}
                <FilterTypeMenu
                    filters={filters}
                    setFilters={setFilters}
                    allAnalysis={allAnalysis}
                    t={t}
                />
            </div>
            
            {/* Active Filters Display */}
            <ActiveFiltersDisplay
                filters={filters}
                setFilters={setFilters}
                groupings={groupings}
                resetGrouping={resetGrouping}
                toggleGrouping={toggleGrouping}
                t={t}
                dispatch={dispatch}
            />
        </div>
    );
};

export default AnalysisFilters; 