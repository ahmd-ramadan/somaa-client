import React, { useEffect, useRef } from 'react';
import { Layers, ChevronDown, ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';
import { GroupingMenuProps } from '../types';

const GroupingMenu: React.FC<GroupingMenuProps> = ({
    groupings,
    toggleGrouping,
    toggleGroupSort,
    t
}) => {
    const [showGroupingMenu, setShowGroupingMenu] = React.useState(false);
    const menueRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menueRef.current && !menueRef.current.contains(event.target as Node)) {
                setShowGroupingMenu(false);
            }
        };

        if (showGroupingMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showGroupingMenu]);

    const groupingOptions = [
        { key: 'sector', label: t("sector") },
        { key: 'classify', label: t("classify") },
        { key: 'adType', label: t("adType") },
        { key: 'pressType', label: t("pressType") },
        { key: 'geoClassify', label: t("geoClassify") },
        { key: 'addedBy', label: t("addedBy") },
        { key: 'newspaper', label: t("newspaper") },
    ];

    return (
        <div className="relative" ref={menueRef}>
            <button
                onClick={() => setShowGroupingMenu(!showGroupingMenu)}
                className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm border border-gray-200 cursor-pointer"
            >
                <Layers className="w-3 h-3 text-gray-600" />
                <span className="font-sm text-gray-700">{t("groupBy")}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showGroupingMenu ? 'rotate-180' : ''}`} />
            </button>

            {showGroupingMenu && (
                <div className={`absolute top-full start-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-10 w-56`}>
                    <div className="p-2">
                        <div className="space-y-1">
                            {groupingOptions.map(option => {
                                const isActive = groupings[option.key]?.active;
                                const currentSort = groupings[option.key]?.sort || 'normal';
                                return (
                                    <div key={option.key} className="flex items-center gap-1">
                                        <button
                                            onClick={() => toggleGrouping(option.key)}
                                            className={`flex-1 text-start px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                                                isActive ? 'bg-primary text-white hover:bg-primary/90' : 'text-gray-700 hover:bg-gray-50 hover:text-secondary'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                        {isActive && toggleGroupSort && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleGroupSort(option.key);
                                                }}
                                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-primary border border-gray-200 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                                                title={
                                                    currentSort === 'normal'
                                                        ? (t("sortNormal") || "ترتيب عادي")
                                                        : currentSort === 'desc'
                                                        ? (t("sortDescCount") || "تنازلي حسب العدد")
                                                        : (t("sortAscCount") || "تصاعدي حسب العدد")
                                                }
                                            >
                                                {currentSort === 'normal' && <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />}
                                                {currentSort === 'desc' && <ArrowDown className="w-3.5 h-3.5 text-primary font-bold" />}
                                                {currentSort === 'asc' && <ArrowUp className="w-3.5 h-3.5 text-secondary font-bold" />}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupingMenu; 