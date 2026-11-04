'use client'

import { AnalysisClassifyEnum, IAnalysis } from "@/interfaces/analysis.types"
import { analyseComplexValue, AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IDashboardClassify, IDashboardSector } from "./types";
import {
    MessageCircle,
    Share2,
    Eye,
    ChevronDown,
    Activity,
    Heart,
    NewspaperIcon,
    Rss
} from "lucide-react";
import XIcon from "@/components/icons/SocialMedia/X";
import TikTokIcon from "@/components/icons/SocialMedia/TikTok";
import InstagramIcon from "@/components/icons/SocialMedia/Instagram";
import LinkedInIcon from "@/components/icons/SocialMedia/LinkedIn";
import FacebookIcon from "@/components/icons/SocialMedia/Facebook";
import YoutubeIcon from "@/components/icons/SocialMedia/Youtube";
import { INews, NewsClassifyEnum } from "@/interfaces/news.types";
import { useTranslations } from "next-intl";

interface ISectorsSectionProps {
    allAnalysis: IAnalysis[]
    allNews: INews[]
}

export interface ISectorEngagement {
    name: string;
    total: number;
    reactions: number;
    comments: number;
    shares: number;
    views: number;
    appearances: number;
    totalMonitoringFromAnalysis: number;
    totalMonitoringFromNews: number;
    platforms: {
        x: number;
        facebook: number;
        instagram: number;
        tiktok: number;
        youtube: number;
        linkedin: number;
    };
    classifications: IDashboardClassify[];
    newsClassifications: IDashboardClassify[];
    analysisClassifications: IDashboardClassify[];
}

const SectorsSection = ({ allAnalysis, allNews }: ISectorsSectionProps) => {
    const t = useTranslations("DashboardPage")
    const [allSectors, setAllSectors] = useState<IDashboardSector[]>([]);
    const [topSectors, setTopSectors] = useState<ISectorEngagement[]>([]);
    const [top3Sectors, setTop3Sectors] = useState<ISectorEngagement[]>([]);
    const [selectedSector, setSelectedSector] = useState<ISectorEngagement | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [showSectorMenu, setShowSectorMenu] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (allAnalysis) {
            const sectors = deriveSectors(allAnalysis);
            setAllSectors(sectors);
            const topEngagement = deriveTopSectorsByEngagement(allAnalysis, allNews);
            setTopSectors(topEngagement);
            if (topEngagement.length > 0 && !selectedSector) {
                setSelectedSector(topEngagement[Math.min(topEngagement.length - 1, 2)]);
            }
        }
    }, [allAnalysis, allNews]);

    useEffect(() => {
        if (selectedSector) {
            const ok = top3Sectors.filter(s => s.name === selectedSector.name);
            if (!ok.length) {
                if (top3Sectors.length == 0) setTop3Sectors([selectedSector])
                if (top3Sectors.length == 1) setTop3Sectors([top3Sectors[0], selectedSector])
                if (top3Sectors.length == 2) setTop3Sectors([top3Sectors[0], top3Sectors[1], selectedSector])
                if (top3Sectors.length == 3) setTop3Sectors([top3Sectors[1], top3Sectors[2], selectedSector])
            }
        }
    }, [selectedSector])

    const totalNewsClassifications = useMemo<IDashboardClassify[]>(() => {
        const counts = {
            [AnalysisClassifyEnum.POSITIVE]: 0,
            [AnalysisClassifyEnum.NEUTRAL]: 0,
            [AnalysisClassifyEnum.NEGATIVE]: 0,
        };

        (allNews || []).forEach((news) => {
            if (news.classify === NewsClassifyEnum.POSITIVE) counts[AnalysisClassifyEnum.POSITIVE]++;
            else if (news.classify === NewsClassifyEnum.NEGATIVE) counts[AnalysisClassifyEnum.NEGATIVE]++;
            else counts[AnalysisClassifyEnum.NEUTRAL]++;
        });

        return [
            { type: AnalysisClassifyEnum.POSITIVE, count: counts[AnalysisClassifyEnum.POSITIVE] },
            { type: AnalysisClassifyEnum.NEUTRAL, count: counts[AnalysisClassifyEnum.NEUTRAL] },
            { type: AnalysisClassifyEnum.NEGATIVE, count: counts[AnalysisClassifyEnum.NEGATIVE] },
        ];
    }, [allNews]);

    
    const totalAnalysisClassifications = useMemo<IDashboardClassify[]>(() => {
        const counts = {
            [AnalysisClassifyEnum.POSITIVE]: 0,
            [AnalysisClassifyEnum.NEUTRAL]: 0,
            [AnalysisClassifyEnum.NEGATIVE]: 0,
        };

        (allAnalysis || []).forEach((analysis) => {
            if (analysis.classify === AnalysisClassifyEnum.POSITIVE) counts[AnalysisClassifyEnum.POSITIVE]++;
            else if (analysis.classify === AnalysisClassifyEnum.NEGATIVE) counts[AnalysisClassifyEnum.NEGATIVE]++;
            else counts[AnalysisClassifyEnum.NEUTRAL]++;
        });

        return [
            { type: AnalysisClassifyEnum.POSITIVE, count: counts[AnalysisClassifyEnum.POSITIVE] },
            { type: AnalysisClassifyEnum.NEUTRAL, count: counts[AnalysisClassifyEnum.NEUTRAL] },
            { type: AnalysisClassifyEnum.NEGATIVE, count: counts[AnalysisClassifyEnum.NEGATIVE] },
        ];
    }, [allAnalysis]);

    
    const deriveSectors = useCallback(
        (analysisData: IAnalysis[]): IDashboardSector[] => {
            const sectorsMap = new Map<string, { total: number; classifications: IDashboardClassify[] }>();

            for (const analysis of analysisData) {
                const sectorName = analysis.sectorData.name;
                const classification = analysis.classify;

                if (!sectorsMap.has(sectorName)) {
                    sectorsMap.set(sectorName, {
                        total: 0,
                        classifications: [
                            { type: AnalysisClassifyEnum.POSITIVE, count: 0 },
                            { type: AnalysisClassifyEnum.NEUTRAL, count: 0 },
                            { type: AnalysisClassifyEnum.NEGATIVE, count: 0 },
                        ],
                    });
                }

                const sectorData = sectorsMap.get(sectorName)!;
                sectorData.total++;

                const classificationEntry = sectorData.classifications.find(
                    (cls) => cls.type === classification
                );

                if (classificationEntry) {
                    classificationEntry.count++;
                }
            }

            return Array.from(sectorsMap.entries()).map(([name, data]) => ({
                name,
                total: data.total,
                classifications: data.classifications,
            }));
        },
        [allAnalysis]);

    const deriveTopSectorsByEngagement = useCallback(
        (analysisData: IAnalysis[], newsData: INews[]): ISectorEngagement[] => {
            const sectorsMap = new Map<string, ISectorEngagement>();

            const initSector = (sectorName: string): ISectorEngagement => ({
                name: sectorName,
                total: 0,
                reactions: 0,
                comments: 0,
                shares: 0,
                views: 0,
                appearances: 0,
                totalMonitoringFromAnalysis: 0,
                totalMonitoringFromNews: 0,
                platforms: {
                    x: 0,
                    facebook: 0,
                    instagram: 0,
                    tiktok: 0,
                    youtube: 0,
                    linkedin: 0
                },
                classifications: [
                    { type: AnalysisClassifyEnum.POSITIVE, count: 0 },
                    { type: AnalysisClassifyEnum.NEUTRAL, count: 0 },
                    { type: AnalysisClassifyEnum.NEGATIVE, count: 0 },
                ],
                newsClassifications: [
                    { type: AnalysisClassifyEnum.POSITIVE, count: 0 },
                    { type: AnalysisClassifyEnum.NEUTRAL, count: 0 },
                    { type: AnalysisClassifyEnum.NEGATIVE, count: 0 },
                ],
                analysisClassifications: [
                    { type: AnalysisClassifyEnum.POSITIVE, count: 0 },
                    { type: AnalysisClassifyEnum.NEUTRAL, count: 0 },
                    { type: AnalysisClassifyEnum.NEGATIVE, count: 0 },
                ]
            });

            // Process analysis data
            for (const analysis of analysisData) {
                const sectorName = analysis.sectorData.name;
                const classification = analysis.classify;
                const statistics = analysis.statistics;
                const platform = analysis.platform.toLowerCase();

                if (!sectorsMap.has(sectorName)) {
                    sectorsMap.set(sectorName, initSector(sectorName));
                }

                const sectorData = sectorsMap.get(sectorName)!;
                sectorData.appearances++;
                sectorData.totalMonitoringFromAnalysis++;

                if (platform in sectorData.platforms) {
                    sectorData.platforms[platform as keyof typeof sectorData.platforms]++;
                }

                sectorData.reactions += statistics.reactions || 0;
                sectorData.comments += statistics.comments || 0;
                sectorData.shares += statistics.shares || 0;
                sectorData.views += statistics.views || 0;
                sectorData.total = sectorData.reactions + sectorData.comments + sectorData.shares + sectorData.appearances + sectorData.views;

                let mappedClassification: AnalysisClassifyEnum;
                switch (analysis.classify) {
                    case AnalysisClassifyEnum.POSITIVE:
                        mappedClassification = AnalysisClassifyEnum.POSITIVE;
                        break;
                    case AnalysisClassifyEnum.NEGATIVE:
                        mappedClassification = AnalysisClassifyEnum.NEGATIVE;
                        break;
                    case AnalysisClassifyEnum.NEUTRAL:
                    default:
                        mappedClassification = AnalysisClassifyEnum.NEUTRAL;
                        break;
                }
                // تحديث تصنيف الأخبار الخاص بالقطاع
                const analysisEntry = sectorData.analysisClassifications.find(
                    (cls) => cls.type === mappedClassification
                );
                if (analysisEntry) {
                    analysisEntry.count++;
                }

                const classificationEntry = sectorData.classifications.find(
                    (cls) => cls.type === mappedClassification
                );

                if (classificationEntry) {
                    classificationEntry.count++;
                }
            }

            // Process news data
            for (const news of newsData) {
                const sectorName = news.sectorData.name;

                if (!sectorsMap.has(sectorName)) {
                    sectorsMap.set(sectorName, initSector(sectorName));
                }

                const sectorData = sectorsMap.get(sectorName)!;
                sectorData.appearances++;
                sectorData.totalMonitoringFromNews++;

                let mappedClassification: AnalysisClassifyEnum;
                switch (news.classify) {
                    case NewsClassifyEnum.POSITIVE:
                        mappedClassification = AnalysisClassifyEnum.POSITIVE;
                        break;
                    case NewsClassifyEnum.NEGATIVE:
                        mappedClassification = AnalysisClassifyEnum.NEGATIVE;
                        break;
                    case NewsClassifyEnum.NEUTRAL:
                    default:
                        mappedClassification = AnalysisClassifyEnum.NEUTRAL;
                        break;
                }

                // تحديث تصنيف الأخبار الخاص بالقطاع
                const newsEntry = sectorData.newsClassifications.find(
                    (cls) => cls.type === mappedClassification
                );
                if (newsEntry) {
                    newsEntry.count++;
                }

                const classificationEntry = sectorData.classifications.find(
                    (cls) => cls.type === mappedClassification
                );
                if (classificationEntry) {
                    classificationEntry.count++;
                }
            }

            const result = Array.from(sectorsMap.values())
                .sort((a, b) => b.total - a.total);

            setTop3Sectors(result.slice(0, Math.min(result.length, 3)));

            return result;
        },
        [allAnalysis, allNews]
    );

    const getPlatformCount = useCallback((platform: string) => {
        return allAnalysis.filter(analysis => analysis.platform === platform).length;
    }, [allAnalysis]);

    return (
        <div className="flex flex-col gap-2 flex-1 bg-transparent/20 shadow-secondary shadow-md">
            <div className="h-full overflow-hidden">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        className="flex flex-col gap-1"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Component 1: General Information */}
                        <motion.div
                            className="bg-transparent/20 shadow-secondary backdrop-blur-sm rounded-lg shadow-lmdg border border-gray-700/50 p-1 transition-all duration-300 hover:shadow-xl"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.05 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex flex-col gap-3 text-white">
                                {/* Header with Sector Selector */}
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col gap-1 justify-start items-start">
                                        <h3 className="text-sm font-semibold text-gray-100 flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-blue-300" />
                                            {t("allSectors")}
                                        </h3>
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => setShowSectorMenu(!showSectorMenu)}
                                            className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded text-xs hover:border border-gray-700/70 transition-colors border"
                                        >
                                            <span className="text-xs text-white">{t("selectSector")}</span>
                                            <ChevronDown className={`w-3 h-3 transition-transform ${showSectorMenu ? 'rotate-180' : ''}`} />
                                        </button>
                                        {showSectorMenu && (
                                            <div className="custom-scrollbar absolute top-full end-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 min-w-[150px] max-h-32 overflow-y-auto">
                                                {topSectors.map((sector, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => {
                                                            setSelectedSector(sector);
                                                            setShowSectorMenu(false);
                                                        }}
                                                        className="w-full text-center px-2 py-1 hover:bg-gray-800/50 transition-colors text-xs border-b border-gray-700/50 last:border-b-0"
                                                    >
                                                        {sector.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content Layout */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2 text-[10px]">

                                        {/* General Stats */}
                                        <div className="w-full text-end">
                                            <span className="text-[10px] pr-5 text-blue-300">{(allAnalysis.length + allNews.length).toLocaleString()} {t("totalMonitoring")}</span>
                                        </div>
                                        
                                        {/* قسم الأخبار - إجمالي القطاعات */}
                                        <div className="flex gap-1 flex-col">
                                            <div className="flex-1 flex flex-col gap-1 border border-gray-700 p-1.5 rounded-lg">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-1">
                                                        <NewspaperIcon className="w-4 h-4 text-blue-300" />
                                                        <span className="text-white font-medium">{t("news")}</span>
                                                    </div>
                                                    <span className="text-blue-300">{allNews.length.toLocaleString()} {t("totalMonitoring")}</span>
                                                </div>
                                                
                                                {/* تصنيفات الأخبار لإجمالي القطاعات */}
                                                <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-700/40">
                                                    {totalNewsClassifications.map((cls, idx) => (
                                                        <div key={idx} className="flex items-center gap-0.5">
                                                            <span className={`text-[11px] font-semibold ${
                                                                cls.type === AnalysisClassifyEnum.POSITIVE ? 'text-green-400' :
                                                                cls.type === AnalysisClassifyEnum.NEUTRAL ? 'text-gray-400' :
                                                                'text-red-400'
                                                            }`}>
                                                                {cls.count.toLocaleString()}
                                                            </span>
                                                            <span className={`text-[9px] ${
                                                                cls.type === AnalysisClassifyEnum.POSITIVE ? 'text-green-400/90' :
                                                                cls.type === AnalysisClassifyEnum.NEUTRAL ? 'text-gray-400/90' :
                                                                'text-red-400/90'
                                                            }`}>
                                                                {t(cls.type)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Platform Stats */}
                                        <div className="w-full flex flex-col gap-3 border border-gray-700 p-2 rounded-lg">
                                            <div className="flex items-center justify-between gap-1">
                                                <div className="flex items-center gap-1">
                                                    <Rss className="w-4 h-4 text-blue-300" />
                                                    <span className="text-white">{t("socialMedia")}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-blue-300">{allAnalysis.length.toLocaleString()} {t("totalMonitoring")}</span>
                                                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-1 rounded border border-blue-500/30">
                                                        <span className="text-white">{topSectors.reduce((acc, curr) => (acc + curr.reactions + curr.shares + curr.comments + curr.views + curr.appearances), 0).toLocaleString()} {t("totalStatistics")}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-700/40">
                                                {totalAnalysisClassifications.map((cls, idx) => (
                                                    <div key={idx} className="flex items-center gap-0.5">
                                                        <span className={`text-[11px] font-semibold ${
                                                            cls.type === AnalysisClassifyEnum.POSITIVE ? 'text-green-400' :
                                                            cls.type === AnalysisClassifyEnum.NEUTRAL ? 'text-gray-400' :
                                                            'text-red-400'
                                                        }`}>
                                                            {cls.count.toLocaleString()}
                                                        </span>
                                                        <span className={`text-[9px] ${
                                                            cls.type === AnalysisClassifyEnum.POSITIVE ? 'text-green-400/90' :
                                                            cls.type === AnalysisClassifyEnum.NEUTRAL ? 'text-gray-400/90' :
                                                            'text-red-400/90'
                                                        }`}>
                                                            {t(cls.type)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="w-full text-blue-300 grid grid-cols-6 gap-2">
                                                <div className="flex items-center gap-1">
                                                    <XIcon className="h-4 w-4" />
                                                    <span className="text-white">{getPlatformCount("x")}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <TikTokIcon className="h-4 w-4" />
                                                    <span className="text-white">{getPlatformCount("tiktok")}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <InstagramIcon className="h-4 w-4" />
                                                    <span className="text-white">{getPlatformCount("instagram")}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <YoutubeIcon className="h-4 w-4" />
                                                    <span className="text-white">{getPlatformCount("youtube")}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <LinkedInIcon className="h-4 w-4" />
                                                    <span className="text-white">{getPlatformCount("linkedin")}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FacebookIcon className="w-4 h-4" />
                                                    <span className="text-white">{getPlatformCount("facebook")}</span>
                                                </div>
                                            </div>

                                            {/* Engagement Stats */}
                                            <div className="flex justify-between gap-1 items-center">
                                                <div className="flex-1 flex justify-between items-center gap-1 border border-gray-700 p-1 rounded-lg">
                                                    <Heart className="w-4 h-4 text-blue-300" />
                                                    <span className="text-white">{topSectors.reduce((acc, curr) => (acc + curr.reactions), 0).toLocaleString()}</span>
                                                </div>
                                                <div className="flex-1 flex justify-between gap-1 border border-gray-700 p-1 rounded-lg">
                                                    <MessageCircle className="w-4 h-4 text-blue-300" />
                                                    <span className="text-white">{topSectors.reduce((acc, curr) => (acc + curr.comments), 0).toLocaleString()}</span>
                                                </div>
                                                <div className="flex-1 flex justify-between gap-1 border border-gray-700 p-1 rounded-lg">
                                                    <Share2 className="w-4 h-4 text-blue-300" />
                                                    <span className="text-white">{topSectors.reduce((acc, curr) => (acc + curr.shares), 0).toLocaleString()}</span>
                                                </div>
                                                <div className="flex-1 flex justify-between gap-1 border border-gray-700 p-1 rounded-lg">
                                                    <Eye className="w-4 h-4 text-blue-300" />
                                                    <span className="text-white">{topSectors.reduce((acc, curr) => (acc + curr.views), 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Top Sectors Cards */}
                        {top3Sectors && top3Sectors.map((sectorItem, indx) => (
                            <motion.div
                                key={indx}
                                className="text-[10px] bg-transparent/20 shadow-secondary backdrop-blur-sm rounded-lg shadow-md border border-gray-700/50 p-1 transition-all duration-300 hover:shadow-xl"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: (indx) * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex flex-col gap-2">
                                    {/* Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex justify-start gap-1">
                                            <h3 className="text-sm font-semibold text-gray-100">{sectorItem.name}</h3>
                                        </div>
                                        <div className="flex flex-col justify-end items-end gap-1">
                                            <div className="flex gap-1 items-center">
                                                {sectorItem.classifications.map((cls, clsIndex) => (
                                                    <div key={clsIndex} className="flex items-center gap-0.5">
                                                        <span className={`text-xs ${
                                                            cls.type === AnalysisClassifyEnum.POSITIVE ? 'text-green-400' :
                                                            cls.type === AnalysisClassifyEnum.NEUTRAL ? 'text-gray-400' :
                                                            'text-red-400'
                                                        }`}>
                                                            {cls.count}
                                                        </span>
                                                        <span className={`text-[10px] ${
                                                            cls.type === AnalysisClassifyEnum.POSITIVE ? 'text-green-400' :
                                                            cls.type === AnalysisClassifyEnum.NEUTRAL ? 'text-gray-400' :
                                                            'text-red-400'
                                                        }`}>{t(cls.type)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <span className={`text-blue-300`}>
                                                {(sectorItem.totalMonitoringFromAnalysis + sectorItem.totalMonitoringFromNews).toLocaleString()}  {t("totalMonitoring")}
                                            </span>
                                        </div>
                                    </div>

                                    {/* قسم الأخبار الخاص بكل قطاع مع تصنيفاته */}
                                    <div className="flex gap-1 flex-col">
                                        <div className="flex-1 flex flex-col gap-1 border border-gray-700 p-1.5 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1">
                                                    <NewspaperIcon className="w-4 h-4 text-blue-300" />
                                                    <span className="text-white font-medium">{t("news")}</span>
                                                </div>
                                                <span className="text-blue-300">{sectorItem.totalMonitoringFromNews.toLocaleString()} {t("totalMonitoring")}</span>
                                            </div>

                                            <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-700/40">
                                                {sectorItem.newsClassifications.map((cls, clsIndex) => (
                                                    <div key={clsIndex} className="flex items-center gap-0.5">
                                                        <span className={`text-[11px] font-semibold ${
                                                            cls.type === AnalysisClassifyEnum.POSITIVE ? 'text-green-400' :
                                                            cls.type === AnalysisClassifyEnum.NEUTRAL ? 'text-gray-400' :
                                                            'text-red-400'
                                                        }`}>
                                                            {cls.count.toLocaleString()}
                                                        </span>
                                                        <span className={`text-[9px] ${
                                                            cls.type === AnalysisClassifyEnum.POSITIVE ? 'text-green-400/90' :
                                                            cls.type === AnalysisClassifyEnum.NEUTRAL ? 'text-gray-400/90' :
                                                            'text-red-400/90'
                                                        }`}>
                                                            {t(cls.type)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Platform Stats */}
                                    <div className="w-full flex flex-col gap-3 border border-gray-700 p-2 rounded-lg">
                                        <div className="flex items-center justify-between gap-1">
                                            <div className="flex items-center gap-1">
                                                <Rss className="w-4 h-4 text-blue-300" />
                                                <span className="text-white">{t("socialMedia")}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-blue-300">{sectorItem.totalMonitoringFromAnalysis.toLocaleString()} {t("totalMonitoring")}</span>
                                                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-1 rounded border border-blue-500/30">
                                                    <span className="text-white">{sectorItem.total.toLocaleString()} {t("totalStatistics")}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-700/40">
                                            {sectorItem.analysisClassifications.map((cls, clsIndex) => (
                                                <div key={clsIndex} className="flex items-center gap-0.5">
                                                    <span className={`text-[11px] font-semibold ${
                                                        cls.type === AnalysisClassifyEnum.POSITIVE ? 'text-green-400' :
                                                        cls.type === AnalysisClassifyEnum.NEUTRAL ? 'text-gray-400' :
                                                        'text-red-400'
                                                    }`}>
                                                        {cls.count.toLocaleString()}
                                                    </span>
                                                    <span className={`text-[9px] ${
                                                        cls.type === AnalysisClassifyEnum.POSITIVE ? 'text-green-400/90' :
                                                        cls.type === AnalysisClassifyEnum.NEUTRAL ? 'text-gray-400/90' :
                                                        'text-red-400/90'
                                                    }`}>
                                                        {t(cls.type)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="w-full text-blue-300 grid grid-cols-6 gap-2">
                                            <div className="flex items-center gap-1">
                                                <XIcon className="h-4 w-4" />
                                                <span className="text-white">{sectorItem.platforms.x}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <TikTokIcon className="h-4 w-4" />
                                                <span className="text-white">{sectorItem.platforms.tiktok}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <InstagramIcon className="h-4 w-4" />
                                                <span className="text-white">{sectorItem.platforms.instagram}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <YoutubeIcon className="h-4 w-4" />
                                                <span className="text-white">{sectorItem.platforms.youtube}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <LinkedInIcon className="h-4 w-4" />
                                                <span className="text-white">{sectorItem.platforms.linkedin}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FacebookIcon className="w-4 h-4" />
                                                <span className="text-white">{sectorItem.platforms.facebook}</span>
                                            </div>
                                        </div>

                                        {/* Engagement Stats */}
                                        <div className="flex justify-between gap-1 items-center">
                                            <div className="flex-1 flex justify-between items-center gap-1 border border-gray-700 p-1 rounded-lg">
                                                <Heart className="w-4 h-4 text-blue-300" />
                                                <span className="text-white">{sectorItem.reactions.toLocaleString()}</span>
                                            </div>
                                            <div className="flex-1 flex justify-between gap-1 border border-gray-700 p-1 rounded-lg">
                                                <MessageCircle className="w-4 h-4 text-blue-300" />
                                                <span className="text-white">{sectorItem.comments.toLocaleString()}</span>
                                            </div>
                                            <div className="flex-1 flex justify-between gap-1 border border-gray-700 p-1 rounded-lg">
                                                <Share2 className="w-4 h-4 text-blue-300" />
                                                <span className="text-white">{sectorItem.shares.toLocaleString()}</span>
                                            </div>
                                            <div className="flex-1 flex justify-between gap-1 border border-gray-700 p-1 rounded-lg">
                                                <Eye className="w-4 h-4 text-blue-300" />
                                                <span className="text-white">{sectorItem.views.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default SectorsSection;