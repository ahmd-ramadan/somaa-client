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
                                    groupings.sector?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("sector")}
                            </button>
                            <button
                                onClick={() => toggleGrouping('subAnalysis')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.subAnalysis?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("subAnalysis")}
                            </button>
                            <button
                                onClick={() => toggleGrouping('classify')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.classify?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("classify")}
                            </button>
                            <button
                                onClick={() => toggleGrouping('contentType')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.contentType?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("contentType")}
                            </button>
                            <button
                                onClick={() => toggleGrouping('publisher')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.publisher?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("publisher")}
                            </button>
                            <button
                                onClick={() => toggleGrouping('addedBy')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.addedBy?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("addedBy")}
                            </button>
                            <button
                                onClick={() => toggleGrouping('platform')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.platform?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("platform")}
                            </button>
                            <button
                                onClick={() => toggleGrouping('tweetType')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.tweetType?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("tweetType")}
                            </button>
                            <button
                                onClick={() => toggleGrouping('isRelated')}
                                className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-secondary rounded-lg transition-colors ${
                                    groupings.isRelated?.active ? 'bg-adminPrimary text-white hover:bg-adminPrimary/90' : 'text-gray-700'
                                }`}
                            >
                                {t("postRelationship")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupingMenu; 