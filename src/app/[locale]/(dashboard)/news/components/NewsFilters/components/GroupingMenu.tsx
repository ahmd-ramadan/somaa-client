import React, { useEffect, useRef } from 'react';
import { Layers, ChevronDown } from 'lucide-react';
import { GroupingMenuProps } from '../types';

const GroupingMenu: React.FC<GroupingMenuProps> = ({
    groupings,
    toggleGrouping,
    t
}) => {
    const [showGroupingMenu, setShowGroupingMenu] = React.useState(false);

    const menueRef = useRef<HTMLDivElement>(null)
    
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

    return (
        <div className="relative" ref={menueRef}>
            <button
                onClick={() => setShowGroupingMenu(!showGroupingMenu)}
                className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm border border-gray-200"
            >
                <Layers className="w-3 h-3 text-gray-600" />
                <span className="font-sm text-gray-700">{t("groupBy")}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showGroupingMenu ? 'rotate-180' : ''}`} />
            </button>

            {showGroupingMenu && (
                <div className={`absolute top-full start-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-10 w-44`}>
                    <div className="p-2">
                        <div className="space-y-1">
                            <button
                                onClick={() => toggleGrouping('sector')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.sector?.active ? 'bg-primary text-white hover:bg-primary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("sector")}
                            </button>
                            <button
                                onClick={() => toggleGrouping('classify')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.classify?.active ? 'bg-primary text-white hover:bg-primary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("classify")}
                            </button>
                            <button
                                onClick={() => toggleGrouping('adType')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.adType?.active ? 'bg-primary text-white hover:bg-primary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("adType")}
                            </button>
                            <button
                                onClick={() => toggleGrouping('pressType')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.pressType?.active ? 'bg-primary text-white hover:bg-primary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("pressType")}
                            </button>
                            <button
                                onClick={() => toggleGrouping('geoClassify')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.geoClassify?.active ? 'bg-primary text-white hover:bg-primary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("geoClassify")}
                            </button>
                            <button
                                onClick={() => toggleGrouping('addedBy')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.addedBy?.active ? 'bg-primary text-white hover:bg-primary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("addedBy")}
                            </button>
                            <button
                                onClick={() => toggleGrouping('newspaper')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.newspaper?.active ? 'bg-primary text-white hover:bg-primary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("newspaper")}
                            </button>
                            {/* <button
                                onClick={() => toggleGrouping('url')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.url?.active ? 'bg-primary text-white hover:bg-primary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("url")}
                            </button> */}
                            {/* <button
                                onClick={() => toggleGrouping('date')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.date?.active ? 'bg-primary text-white hover:bg-primary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("date")}
                            </button> */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupingMenu; 