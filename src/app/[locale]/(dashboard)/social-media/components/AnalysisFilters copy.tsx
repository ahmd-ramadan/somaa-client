// import { AnalysisClassifyEnum, IAnalysis, PlatformsEnum, ContentTypesEnum } from "@/interfaces/analysis.types";
// import { useTranslations } from "next-intl";
// import { X, Filter, ChevronDown, Layers } from 'lucide-react';
// import { useState, useEffect } from "react";
// import { useAppDispatch } from "@/lib/hooks";
// import { fetchAllAnalysis } from "@/lib/features/socialMedia/analysisThunks";

// type StatisticType = 'reactions' | 'comments' | 'shares' | 'views' | 'appearance';

// interface FilterState {
//     platform?: PlatformsEnum;
//     classify?: AnalysisClassifyEnum;
//     contentType?: ContentTypesEnum;
//     sector?: string;
//     subAnalysis?: string;
//     dateRange?: {
//         start?: Date;
//         end?: Date;
//     };
//     statistics?: {
//         [key in StatisticType]?: { min?: number; max?: number };
//     };
//     selectedStatistic?: StatisticType;
//     addedBy?: string;
//     url?: string;
// }

// interface GroupingState {
//     sector?: boolean;
//     addedBy?: boolean;
//     platform?: boolean;
//     subAnalysis?: boolean;
//     classify?: boolean;
//     contentType?: boolean;
// }

// interface AnalysisFiltersProps {
//     filters: FilterState;
//     setFilters: (filters: FilterState) => void;
//     showFilters: boolean;
//     setShowFilters: (show: boolean) => void;
//     groupings: GroupingState;
//     setGroupings: (groupings: GroupingState) => void;
//     allAnalysis: IAnalysis[];
// }

// interface DateRange {
//     from: string;
//     to: string;
// }

// const AnalysisFilters = ({ 
//     filters, 
//     setFilters, 
//     showFilters, 
//     setShowFilters, 
//     groupings,
//     setGroupings,
//     allAnalysis 
// }: AnalysisFiltersProps) => {
//     const t = useTranslations("SocialMediaPage.AllAnalysisTable");
//     const dispatch = useAppDispatch();
//     const [showDateFilter, setShowDateFilter] = useState(false);
//     const [dateRange, setDateRange] = useState<DateRange>({
//         from: new Date().toISOString().slice(0, 16),
//         to: new Date().toISOString().slice(0, 16)
//     });

//     // Initialize with today's date range
//     useEffect(() => {
//         const today = new Date();
//         const start = new Date(today);
//         start.setHours(0, 0, 0, 0);
//         const end = new Date(today);
//         end.setHours(23, 59, 59, 999);

//         setFilters({
//             ...filters,
//             dateRange: {
//                 start,
//                 end
//             }
//         });

//         dispatch(fetchAllAnalysis({
//             startDate: start,
//             endDate: end
//         }));
//     }, []);

//     // Get unique addedBy names
//     const uniqueAddedBy = Array.from(new Set(allAnalysis.map(a => a.addedByData?.name).filter(Boolean)));

//     // Get active filters count
//     const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
//         if (key === 'statistics') {
//             return Object.values(value || {}).some(stat => {
//                 const typedStat = stat as { min?: number; max?: number };
//                 return typedStat?.min || typedStat?.max;
//             });
//         }
//         if (key === 'dateRange') {
//             return value?.start || value?.end;
//         }
//         return value;
//     }).length;

//     const clearFilter = (key: keyof FilterState) => {
//         if (key === 'dateRange') {
//             // Reset to today's date
//             const today = new Date();
//             const start = new Date(today);
//             start.setHours(0, 0, 0, 0);
//             const end = new Date(today);
//             end.setHours(23, 59, 59, 999);

//             setFilters({
//                 ...filters,
//                 dateRange: {
//                     start,
//                     end
//                 }
//             });

//             // Call API with today's date
//             dispatch(fetchAllAnalysis({
//                 startDate: start,
//                 endDate: end
//             }));
//         } else {
//             setFilters({ ...filters, [key]: undefined });
//         }
//     };

//     const handleStatisticSelect = (statistic: StatisticType) => {
//         if (statistic === filters.selectedStatistic) {
//             // If the same statistic is selected again, remove it
//             setFilters({
//                 ...filters,
//                 selectedStatistic: undefined,
//                 statistics: {
//                     ...filters.statistics,
//                     [statistic]: undefined
//                 }
//             });
//         } else {
//             // If a new statistic is selected, set it as selected
//             setFilters({
//                 ...filters,
//                 selectedStatistic: statistic
//             });
//         }
//     };

//     const toggleGrouping = (key: keyof GroupingState) => {
//         setGroupings({
//             ...groupings,
//             [key]: !groupings[key]
//         });
//     };

//     const handleDateFilterSubmit = () => {
//         const newFilters = {
//             ...filters,
//             dateRange: {
//                 start: new Date(dateRange.from),
//                 end: new Date(dateRange.to)
//             }
//         };
//         setFilters(newFilters);
//         setShowDateFilter(false);

//         // Call fetchAllAnalysis with date query parameters
//         dispatch(fetchAllAnalysis({
//             startDate: new Date(dateRange.from),
//             endDate: new Date(dateRange.to)
//         }));
//     };

//     const clearDateFilter = () => {
//         // Reset to today's date
//         const today = new Date().toISOString().slice(0, 16);
//         setDateRange({
//             from: today,
//             to: today
//         });

//         // Clear date range from filters
//         const start = new Date();
//         const end = new Date();
//         start.setHours(0, 0, 0, 0);
//         end.setHours(23, 59, 59, 999);

//         const newFilters = {
//             ...filters,
//             dateRange: {
//                 start,
//                 end
//             }
//         };
//         setFilters(newFilters);

//         dispatch(fetchAllAnalysis({}));
//     };

//     const formatDateTime = (date: Date) => {
//         return new Intl.DateTimeFormat('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         }).format(date);
//     };

//     return (
//         <div className="bg-white p-3 rounded-lg">
//             <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                     <button
//                         onClick={() => setShowFilters(!showFilters)}
//                         className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
//                     >
//                         <Filter className="w-4 h-4" />
//                         <span className="font-medium">{t("filters")}</span>
//                         {activeFiltersCount > 0 && (
//                             <span className="bg-adminPrimary text-white px-1.5 py-1 rounded-full text-xs">
//                                 {activeFiltersCount}
//                             </span>
//                         )}
//                         <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
//                     </button>

//                     {/* <div className="relative">
//                         <button
//                             onClick={() => setShowDateFilter(!showDateFilter)}
//                             className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
//                         >
//                             <Calendar className="w-4 h-4" />
//                             <span className="font-medium">{t("dateFilter")}</span>
//                             {filters.dateRange && (
//                                 <div className="flex items-center gap-1">
//                                     <span className="bg-adminPrimary text-white px-1.5 py-1 rounded-full text-xs">
//                                         {formatDateTime(filters.dateRange.start!)} - {formatDateTime(filters.dateRange.end!)}
//                                     </span>
//                                     <button
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             clearDateFilter();
//                                         }}
//                                         className="text-gray-500 hover:text-red-500"
//                                     >
//                                         <X className="w-3 h-3" />
//                                     </button>
//                                 </div>
//                             )}
//                         </button>

//                         {showDateFilter && (
//                             <div className="absolute right-0 mt-2 bg-white p-4 rounded-lg shadow-lg z-10 border border-gray-200">
//                                 <div className="space-y-3">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             {t("fromDateTime")}
//                                         </label>
//                                         <input
//                                             type="datetime-local"
//                                             value={dateRange.from}
//                                             onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
//                                             className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-adminPrimary focus:ring-1 focus:ring-adminPrimary/20 focus:outline-none"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             {t("toDateTime")}
//                                         </label>
//                                         <input
//                                             type="datetime-local"
//                                             value={dateRange.to}
//                                             onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
//                                             className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-adminPrimary focus:ring-1 focus:ring-adminPrimary/20 focus:outline-none"
//                                         />
//                                     </div>
//                                     <div className="flex justify-end gap-2">
//                                         <button
//                                             onClick={() => {
//                                                 setShowDateFilter(false);
//                                                 clearDateFilter();
//                                             }}
//                                             className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
//                                         >
//                                             {t("clear")}
//                                         </button>
//                                         <button
//                                             onClick={handleDateFilterSubmit}
//                                             className="px-3 py-1.5 bg-adminPrimary text-white rounded-md hover:bg-adminPrimary/90 transition-colors text-sm"
//                                         >
//                                             {t("apply")}
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div> */}

//                     <div className="flex items-center gap-1.5">
//                         <Layers className="w-4 h-4 text-gray-500" />
//                         <div className="flex flex-wrap gap-1">
//                             <button
//                                 onClick={() => toggleGrouping('sector')}
//                                 className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
//                                     groupings.sector
//                                         ? 'bg-adminPrimary text-white'
//                                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                 }`}
//                             >
//                                 {t("groupBySector")}
//                             </button>
//                             <button
//                                 onClick={() => toggleGrouping('addedBy')}
//                                 className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
//                                     groupings.addedBy
//                                         ? 'bg-adminPrimary text-white'
//                                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                 }`}
//                             >
//                                 {t("groupByAddedBy")}
//                             </button>
//                             <button
//                                 onClick={() => toggleGrouping('platform')}
//                                 className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
//                                     groupings.platform
//                                         ? 'bg-adminPrimary text-white'
//                                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                 }`}
//                             >
//                                 {t("groupByPlatform")}
//                             </button>
//                             <button
//                                 onClick={() => toggleGrouping('subAnalysis')}
//                                 className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
//                                     groupings.subAnalysis
//                                         ? 'bg-adminPrimary text-white'
//                                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                 }`}
//                             >
//                                 {t("groupBySubAnalysis")}
//                             </button>
//                             <button
//                                 onClick={() => toggleGrouping('classify')}
//                                 className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
//                                     groupings.classify
//                                         ? 'bg-adminPrimary text-white'
//                                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                 }`}
//                             >
//                                 {t("groupByClassification")}
//                             </button>
//                             <button
//                                 onClick={() => toggleGrouping('contentType')}
//                                 className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
//                                     groupings.contentType
//                                         ? 'bg-adminPrimary text-white'
//                                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                 }`}
//                             >
//                                 {t("groupByContentType")}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Active Filters Display */}
//             {activeFiltersCount > 0 && (
//                 <div className="flex flex-wrap gap-1.5 mb-3 p-2 bg-gray-50 rounded-lg">
//                     {filters.platform && (
//                         <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs shadow-sm">
//                             <span className="font-medium">{t("platform")}:</span>
//                             <span>{t(filters.platform)}</span>
//                             <button onClick={() => clearFilter('platform')} className="text-gray-500 hover:text-red-500">
//                                 <X className="w-3 h-3" />
//                             </button>
//                         </div>
//                     )}
//                     {filters.classify && (
//                         <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs shadow-sm">
//                             <span className="font-medium">{t("classification")}:</span>
//                             <span>{t(filters.classify)}</span>
//                             <button onClick={() => clearFilter('classify')} className="text-gray-500 hover:text-red-500">
//                                 <X className="w-3 h-3" />
//                             </button>
//                         </div>
//                     )}
//                     {filters.contentType && (
//                         <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs shadow-sm">
//                             <span className="font-medium">{t("contentType")}:</span>
//                             <span>{t(filters.contentType)}</span>
//                             <button onClick={() => clearFilter('contentType')} className="text-gray-500 hover:text-red-500">
//                                 <X className="w-3 h-3" />
//                             </button>
//                         </div>
//                     )}
//                     {filters.sector && (
//                         <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs shadow-sm">
//                             <span className="font-medium">{t("sector")}:</span>
//                             <span>{allAnalysis.find(a => a.sector.sectorId === filters.sector)?.sector.name}</span>
//                             <button onClick={() => clearFilter('sector')} className="text-gray-500 hover:text-red-500">
//                                 <X className="w-3 h-3" />
//                             </button>
//                         </div>
//                     )}
//                     {filters.subAnalysis && (
//                         <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs shadow-sm">
//                             <span className="font-medium">{t("subAnalysis")}:</span>
//                             <span>{filters.subAnalysis}</span>
//                             <button onClick={() => clearFilter('subAnalysis')} className="text-gray-500 hover:text-red-500">
//                                 <X className="w-3 h-3" />
//                             </button>
//                         </div>
//                     )}
//                     {filters.addedBy && (
//                         <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs shadow-sm">
//                             <span className="font-medium">{t("addedBy")}:</span>
//                             <span>{filters.addedBy}</span>
//                             <button onClick={() => clearFilter('addedBy')} className="text-gray-500 hover:text-red-500">
//                                 <X className="w-3 h-3" />
//                             </button>
//                         </div>
//                     )}
//                     {filters.url && (
//                         <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs shadow-sm">
//                             <span className="font-medium">{t("url")}:</span>
//                             <span>{filters.url}</span>
//                             <button onClick={() => clearFilter('url')} className="text-gray-500 hover:text-red-500">
//                                 <X className="w-3 h-3" />
//                             </button>
//                         </div>
//                     )}
//                     {filters.dateRange && (
//                         <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs shadow-sm">
//                             <span className="font-medium">{t("timeRange")}:</span>
//                             <span>{formatDateTime(filters.dateRange.start!)} - {formatDateTime(filters.dateRange.end!)}</span>
//                             <button onClick={() => clearFilter('dateRange')} className="text-gray-500 hover:text-red-500">
//                                 <X className="w-3 h-3" />
//                             </button>
//                         </div>
//                     )}
//                     {Object.entries(filters.statistics || {}).map(([key, value]) => {
//                         if (value?.min || value?.max) {
//                             return (
//                                 <div key={key} className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs shadow-sm">
//                                     <span className="font-medium">{t(key)}:</span>
//                                     <span>{value.min || 0} - {value.max || '∞'}</span>
//                                     <button onClick={() => setFilters({
//                                         ...filters,
//                                         statistics: {
//                                             ...filters.statistics,
//                                             [key]: undefined
//                                         }
//                                     })} className="text-gray-500 hover:text-red-500">
//                                         <X className="w-3 h-3" />
//                                     </button>
//                                 </div>
//                             );
//                         }
//                         return null;
//                     })}
//                 </div>
//             )}

//             {showFilters && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
//                     <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">{t("timeRange")}</label>
//                         <div className="flex gap-1.5">
//                             <div className="flex-1">
//                                 <input
//                                     type="datetime-local"
//                                     value={filters.dateRange?.start?.toISOString().slice(0, 16) || ''}
//                                     onChange={(e) => {
//                                         const newStart = e.target.value ? new Date(e.target.value) : undefined;
//                                         const newFilters = {
//                                             ...filters,
//                                             dateRange: {
//                                                 ...filters.dateRange,
//                                                 start: newStart
//                                             }
//                                         };
//                                         setFilters(newFilters);
//                                         if (newStart && filters.dateRange?.end) {
//                                             dispatch(fetchAllAnalysis({
//                                                 startDate: newStart,
//                                                 endDate: filters.dateRange.end
//                                             }));
//                                         }
//                                     }}
//                                     className="w-full rounded-lg border border-gray-300 p-1 text-xs focus:border-adminPrimary focus:ring-1 focus:ring-adminPrimary/20 focus:outline-none"
//                                 />
//                             </div>
//                             <div className="flex-1">
//                                 <input
//                                     type="datetime-local"
//                                     value={filters.dateRange?.end?.toISOString().slice(0, 16) || ''}
//                                     onChange={(e) => {
//                                         const newEnd = e.target.value ? new Date(e.target.value) : undefined;
//                                         const newFilters = {
//                                             ...filters,
//                                             dateRange: {
//                                                 ...filters.dateRange,
//                                                 end: newEnd
//                                             }
//                                         };
//                                         setFilters(newFilters);
//                                         if (filters.dateRange?.start && newEnd) {
//                                             dispatch(fetchAllAnalysis({
//                                                 startDate: filters.dateRange.start,
//                                                 endDate: newEnd
//                                             }));
//                                         }
//                                     }}
//                                     className="w-full rounded-lg border border-gray-300 p-1 text-xs focus:border-adminPrimary focus:ring-1 focus:ring-adminPrimary/20 focus:outline-none"
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">{t("sector")}</label>
//                         <select
//                             value={filters.sector || ''}
//                             onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
//                             className="w-full rounded-lg border border-gray-300 p-1 text-xs focus:border-adminPrimary focus:ring-1 focus:ring-adminPrimary/20 focus:outline-none"
//                         >
//                             <option value="">{t("allSectors")}</option>
//                             {Array.from(new Set(allAnalysis.map(a => a.sector.sectorId))).map(sectorId => {
//                                 const sector = allAnalysis.find(a => a.sector.sectorId === sectorId)?.sector;
//                                 return (
//                                     <option key={sectorId} value={sectorId}>{sector?.name}</option>
//                                 );
//                             })}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">{t("subAnalysis")}</label>
//                         <select
//                             value={filters.subAnalysis || ''}
//                             onChange={(e) => setFilters({ ...filters, subAnalysis: e.target.value })}
//                             className="w-full rounded-lg border border-gray-300 p-1 text-xs focus:border-adminPrimary focus:ring-1 focus:ring-adminPrimary/20 focus:outline-none"
//                         >
//                             <option value="">{t("allSubAnalysis")}</option>
//                             {Array.from(new Set(allAnalysis.map(a => a.subAnalysis.body))).map(body => (
//                                 <option key={body} value={body}>{body}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">{t("classification")}</label>
//                         <select
//                             value={filters.classify || ''}
//                             onChange={(e) => setFilters({ ...filters, classify: e.target.value as AnalysisClassifyEnum })}
//                             className="w-full rounded-lg border border-gray-300 p-1 text-xs focus:border-adminPrimary focus:ring-1 focus:ring-adminPrimary/20 focus:outline-none"
//                         >
//                             <option value="">{t("allClassifications")}</option>
//                             {Object.values(AnalysisClassifyEnum).map(classify => (
//                                 <option key={classify} value={classify}>{t(classify)}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">{t("contentType")}</label>
//                         <select
//                             value={filters.contentType || ''}
//                             onChange={(e) => setFilters({ ...filters, contentType: e.target.value as ContentTypesEnum })}
//                             className="w-full rounded-lg border border-gray-300 p-1 text-xs focus:border-adminPrimary focus:ring-1 focus:ring-adminPrimary/20 focus:outline-none"
//                         >
//                             <option value="">{t("allContentTypes")}</option>
//                             {Object.values(ContentTypesEnum).map(type => (
//                                 <option key={type} value={type}>{t(type)}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">{t("addedBy")}</label>
//                         <select
//                             value={filters.addedBy || ''}
//                             onChange={(e) => setFilters({ ...filters, addedBy: e.target.value })}
//                             className="w-full rounded-lg border border-gray-300 p-1 text-xs focus:border-adminPrimary focus:ring-1 focus:ring-adminPrimary/20 focus:outline-none"
//                         >
//                             <option value="">{t("allAddedBy")}</option>
//                             {uniqueAddedBy.map(name => (
//                                 <option key={name} value={name}>{name}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">{t("url")}</label>
//                         <input
//                             type="text"
//                             value={filters.url || ''}
//                             onChange={(e) => setFilters({ ...filters, url: e.target.value })}
//                             placeholder={t("enterUrl")}
//                             className="w-full rounded-lg border border-gray-300 p-1 text-xs focus:border-adminPrimary focus:ring-1 focus:ring-adminPrimary/20 focus:outline-none"
//                         />
//                     </div>

//                     <div className="col-span-full">
//                         <label className="block text-xs font-medium text-gray-700 mb-1">{t("statistics")}</label>
//                         <div className="flex flex-wrap gap-1.5 mb-2">
//                             {(['reactions', 'comments', 'shares', 'views', 'appearance'] as StatisticType[]).map((stat) => (
//                                 <button
//                                     key={stat}
//                                     onClick={() => handleStatisticSelect(stat)}
//                                     className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
//                                         filters.selectedStatistic === stat
//                                             ? 'bg-adminPrimary text-white'
//                                             : 'bg-white text-gray-700 hover:bg-gray-100'
//                                     }`}
//                                 >
//                                     {t(stat)}
//                                 </button>
//                             ))}
//                         </div>
//                         {filters.selectedStatistic && (
//                             <div className="bg-white p-2 rounded-lg shadow-sm">
//                                 <div className="flex items-center gap-2">
//                                     <div className="flex-1">
//                                         <label className="block text-xs font-medium text-gray-700 mb-0.5">{t("from")}</label>
//                                         <input
//                                             type="number"
//                                             value={filters.statistics?.[filters.selectedStatistic]?.min || ''}
//                                             onChange={(e) => {
//                                                 const selectedStat = filters.selectedStatistic;
//                                                 if (selectedStat) {
//                                                     setFilters({
//                                                         ...filters,
//                                                         statistics: {
//                                                             ...filters.statistics,
//                                                             [selectedStat]: {
//                                                                 ...filters.statistics?.[selectedStat],
//                                                                 min: e.target.value ? parseInt(e.target.value) : undefined
//                                                             }
//                                                         }
//                                                     });
//                                                 }
//                                             }}
//                                             className="w-full rounded-lg border border-gray-300 p-1 text-xs focus:border-adminPrimary focus:ring-1 focus:ring-adminPrimary/20 focus:outline-none"
//                                             placeholder={t("min")}
//                                         />
//                                     </div>
//                                     <div className="flex-1">
//                                         <label className="block text-xs font-medium text-gray-700 mb-0.5">{t("to")}</label>
//                                         <input
//                                             type="number"
//                                             value={filters.statistics?.[filters.selectedStatistic]?.max || ''}
//                                             onChange={(e) => {
//                                                 const selectedStat = filters.selectedStatistic;
//                                                 if (selectedStat) {
//                                                     setFilters({
//                                                         ...filters,
//                                                         statistics: {
//                                                             ...filters.statistics,
//                                                             [selectedStat]: {
//                                                                 ...filters.statistics?.[selectedStat],
//                                                                 max: e.target.value ? parseInt(e.target.value) : undefined
//                                                             }
//                                                         }
//                                                     });
//                                                 }
//                                             }}
//                                             className="w-full rounded-lg border border-gray-300 p-1 text-xs focus:border-adminPrimary focus:ring-1 focus:ring-adminPrimary/20 focus:outline-none"
//                                             placeholder={t("max")}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AnalysisFilters; 