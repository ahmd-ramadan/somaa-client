import React from 'react';
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/lib/hooks";
import FilterMenu from './components/FilterMenu';
import GroupingMenu from './components/GroupingMenu';
import FilterTypeMenu from './components/FilterTypeMenu';
import ActiveFiltersDisplay from './components/ActiveFiltersDisplay';
import { AnalysisFiltersProps } from './types';

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
        setGroupings((prev: any) => {
            const isActive = prev[key]?.active;
            if (isActive) {
                return {
                    ...prev,
                    [key]: { active: false }
                };
            } else {
                const maxOrder = Math.max(0, ...Object.values(prev).map((g: any) => g.order || 0));
                return {
                    ...prev,
                    [key]: { active: true, order: maxOrder + 1, sort: 'normal' }
                };
            }
        });
    };

    const toggleGroupSort = (key: keyof typeof groupings) => {
        setGroupings(prev => {
            const current = prev[key];
            if (!current?.active) return prev;
            const nextSort: 'normal' | 'desc' | 'asc' =
                current.sort === 'normal' || !current.sort ? 'desc' :
                    current.sort === 'desc' ? 'asc' : 'normal';
            return {
                ...prev,
                [key]: {
                    ...current,
                    sort: nextSort
                }
            };
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
                    toggleGroupSort={toggleGroupSort}
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
                toggleGroupSort={toggleGroupSort}
                t={t}
                dispatch={dispatch}
            />
        </div>
    );
};

export default AnalysisFilters; 