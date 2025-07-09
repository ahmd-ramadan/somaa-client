import React, { useEffect, useRef } from 'react';
import { AnalysisClassifyEnum, ContentTypesEnum, TweetTypesEnum } from "@/interfaces/analysis.types";
import { useLocale } from 'next-intl';
import { FilterTypeMenuProps } from '../types';

const FilterTypeMenu: React.FC<FilterTypeMenuProps> = ({
    filters,
    setFilters,
    allAnalysis,
    t
}) => {
    const locale = useLocale()

    const [showFilterTypeMenu, setShowFilterTypeMenu] = React.useState(false);
    const [filterTypeSearch, setFilterTypeSearch] = React.useState('');

    const menueRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menueRef.current && !menueRef.current.contains(event.target as Node)) {
                setShowFilterTypeMenu(false);
            }
        };

        if (showFilterTypeMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFilterTypeMenu]);

    // Get unique values for each filter type
    const getFilterOptions = (type: keyof typeof filters): string[] => {
        switch (type) {
            case 'sector':
                return Array.from(new Set(allAnalysis.map(a => a.sectorData.name)));
            case 'subAnalysis':
                return Array.from(new Set(allAnalysis.map(a => a.subAnalysisData.body)));
            case 'classify':
                return Object.values(AnalysisClassifyEnum);
            case 'contentType':
                return Object.values(ContentTypesEnum);
            case 'tweetType':
                return Object.values(TweetTypesEnum);
            case 'addedBy':
                return Array.from(new Set(allAnalysis.map(a => a.addedByData?.name).filter(Boolean)));
            case 'publisher':
                return Array.from(new Set(allAnalysis.map(a => a.publisher.name).filter(Boolean)));
            case 'platform':
                return Array.from(new Set(allAnalysis.map(a => a.platform).filter(Boolean)));
            case 'url':
                return Array.from(new Set(allAnalysis.map(a => a.url).filter(Boolean)));
            default:
                return [];
        }
    };

    const handleFilterTypeSelect = (type: keyof typeof filters) => {
        if (!filterTypeSearch.trim()) {
            return;
        }

        // Initialize array if it doesn't exist
        const newFilters = { ...filters };
        if (!newFilters[type]) {
            newFilters[type] = [] as any;
        }

        // For sector and subAnalysis, find all items that contain the search value
        if (type === 'sector' || type === 'subAnalysis') {
            const matchingValues = getFilterOptions(type).filter(option => 
                option.toLowerCase().includes(filterTypeSearch.toLowerCase())
            );
            
            if (matchingValues.length > 0) {
                newFilters[type] = matchingValues as any;
            }
        } else if (type === 'publisher') {
            // For publisher, search in name or handle
            const matchingPublishers = allAnalysis
                .filter(analysis => {
                    const name = analysis.publisher.name.toLowerCase();
                    const handle = analysis.publisher.handle?.toLowerCase() || '';
                    const searchValue = filterTypeSearch.toLowerCase();
                    return name.includes(searchValue) || handle.includes(searchValue);
                })
                .map(analysis => analysis.publisher.name);
            
            const uniqueMatchingPublishers = Array.from(new Set(matchingPublishers));
            if (uniqueMatchingPublishers.length > 0) {
                newFilters[type] = uniqueMatchingPublishers as any;
            }
        } else if (type === 'tweetType' || type === 'classify' || type === 'contentType' || type === 'platform') {
            // For tweetType, add the exact value if it exists in options
            const matchingValues = getFilterOptions(type).filter(option => {
                return !!(t(option)?.toLowerCase()?.includes(filterTypeSearch?.toLowerCase())) ||
                !!(option.toLowerCase().includes(filterTypeSearch.toLowerCase()))
            });
            
            if (matchingValues.length > 0) {
                for(const m of matchingValues) {    
                    const currentValues = (newFilters[type] as string[]) || [];
                    if(m && !currentValues.includes(m)) {
                        (newFilters[type] as string[]) = [...currentValues, m];
                    }
                }

                console.log(newFilters[type]);
            }
        } else {
            // For other filter types, add the exact value
            const currentValues = newFilters[type] as string[];
            if (filterTypeSearch && !currentValues.includes(filterTypeSearch)) {
                newFilters[type] = [...currentValues, filterTypeSearch] as any;
            }
        }

        setFilters(newFilters);
        setShowFilterTypeMenu(false);
        setFilterTypeSearch('');
    };

    // Check if search term has matches in any filter type
    const hasMatches = React.useMemo(() => {
        if (!filterTypeSearch.trim()) return false;
        
        const filterTypes = ['sector', 'subAnalysis', 'classify', 'contentType', 'tweetType', 'publisher', 'addedBy', 'platform'];
        
        return filterTypes.some(type => {
            const options = getFilterOptions(type as keyof typeof filters);
            return options.some(option => {
                let isOk: boolean = false;
                if (type === 'classify' 
                    || type === 'tweetType' 
                    || type === 'platform' 
                    || type === 'contentType'
                ) {
                    isOk = !!(t(option)?.toLowerCase()?.includes(filterTypeSearch?.toLowerCase())); 
                }
                isOk = isOk || !!(option.toLowerCase().includes(filterTypeSearch.toLowerCase()))

                // if(isOk) console.log("isOk in", option)
                return isOk;
            });
        });
    }, [filterTypeSearch, allAnalysis]);

    return (
        <div className="relative" ref={menueRef}>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={filterTypeSearch}
                    onChange={(e) => {
                        setFilterTypeSearch(e.target.value);
                        setShowFilterTypeMenu(e.target.value.length > 0);
                    }}
                    placeholder={t("searchFilterType")}
                    className="w-48 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-adminPrimary focus:ring-2 focus:ring-adminPrimary/20 focus:outline-none bg-gray-50"
                />
            </div>

            {showFilterTypeMenu && filterTypeSearch && (
                <div className={`absolute top-full start-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-10 w-72`}>
                    <div className="p-2 space-y-1">
                        {hasMatches ? (
                            Object.entries({
                                sector: t("sector"),
                                subAnalysis: t("subAnalysis"),
                                classify: t("classify"),
                                contentType: t("contentType"),
                                tweetType: t("tweetType"),
                                publisher: t("publisher"),
                                addedBy: t("addedBy"),
                                platform: t("platform"),
                                url: t("url"),
                            }).map(([key, label]) => {
                                const filterKey = key as keyof typeof filters;
                                const options = getFilterOptions(filterKey);
                                const hasMatch = options.some(option => {
                                    let isOk: boolean = false;
                                    if (filterKey === 'classify' 
                                        || filterKey === 'tweetType' 
                                        || filterKey === 'platform' 
                                        || filterKey === 'contentType'
                                    ) {
                                        isOk = !!(t(option)?.toLowerCase()?.includes(filterTypeSearch?.toLowerCase())); 
                                    }
                                    isOk = isOk || !!(option.toLowerCase().includes(filterTypeSearch.toLowerCase()))

                                    return isOk;
                                })
                                
                                if (!hasMatch) return null;
                                
                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleFilterTypeSelect(filterKey)}
                                        className="w-full px-4 py-2.5 text-sm hover:bg-gray-50 rounded-lg transition-colors text-gray-700 text-start"
                                    >
                                        {t("searchBy")} {label}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="text-sm text-gray-500 text-center py-3">
                                {t("noResultsFoundFilters")}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterTypeMenu; 