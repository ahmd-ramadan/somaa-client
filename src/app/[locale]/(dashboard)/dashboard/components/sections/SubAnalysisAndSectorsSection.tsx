'use client'

import { AnalysisClassifyEnum, IAnalysis } from "@/interfaces/analysis.types"
import { motion, useAnimation } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import { IDashboardSubAnalysis } from "./types"
import { INews, NewsClassifyEnum } from "@/interfaces/news.types"
import { ISectorEngagement } from "./SectorsSection"
import { useTranslations } from "next-intl"

interface ISubAnalysisSectionProps {
    allAnalysis: IAnalysis[],
    allNews: INews[]
}

const SubAnalysisAndSectorsSection = ({ allAnalysis, allNews }: ISubAnalysisSectionProps) => {
    const t = useTranslations("DashboardPage")

    const [allSubAnalysis, setAllSubAnalysis] = useState<IDashboardSubAnalysis[]>([])
    const [allSectors, setAllSectors] = useState<ISectorEngagement[]>([])
    const [isSubAnalysisAnimating, setIsSubAnalysisAnimating] = useState(true);
    const controls = useAnimation(); // Hook for controlling the animation

    // Derives and counts sub-analysis data
    const deriveSubAnalysis = useCallback(
        (analysisData: IAnalysis[]): IDashboardSubAnalysis[] => {
            const analysisMap = new Map<string, { count: number, classifications: Map<AnalysisClassifyEnum, number>, totalEngagement: number }>();
            
            analysisData.forEach(analysis => {
                const name = analysis?.subAnalysisData?.body;
                if (!name) return;
                
                if (!analysisMap.has(name)) {
                    analysisMap.set(name, {
                        count: 0,
                        classifications: new Map<AnalysisClassifyEnum, number>(),
                        totalEngagement: 0
                    });
                }
                
                const current = analysisMap.get(name)!;
                current.count++;
                
                // Calculate total engagement from statistics
                const engagement = analysis.statistics.reactions + analysis.statistics.comments + analysis.statistics.shares;
                current.totalEngagement += engagement;
                
                // Update classifications count
                if (analysis.classify) {
                    const currentCount = current.classifications.get(analysis.classify) || 0;
                    current.classifications.set(analysis.classify, currentCount + 1);
                }
            })
        
            const response = Array.from(analysisMap.entries()).map(([name, data]) => ({
                name,
                count: data.count,
                totalEngagement: data.totalEngagement,
                classifications: Array.from(data.classifications.entries()).map(([type, count]) => ({
                    type,
                    count
                }))
            }));
            return response.sort((a, b) => b.count - a.count).slice(0, Math.min(response.length, 5))
    }, [allAnalysis]);

    const deriveTopSectorsByEngagement = useCallback(
        (analysisData: IAnalysis[], newsData: INews[]): ISectorEngagement[] => {
            const sectorsMap = new Map<string, ISectorEngagement>();

            // Process analysis data
            for (const analysis of analysisData) {
                const sectorName = analysis.sectorData.name;
                const classification = analysis.classify;
                const statistics = analysis.statistics;
                const platform = analysis.platform.toLowerCase();

                if (!sectorsMap.has(sectorName)) {
                    sectorsMap.set(sectorName, {
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
                    });
                }

                const sectorData = sectorsMap.get(sectorName)!;
                sectorData.appearances++;
                sectorData.totalMonitoringFromAnalysis++;
                
                // Update platform count
                if (platform in sectorData.platforms) {
                    sectorData.platforms[platform as keyof typeof sectorData.platforms]++;
                }
                
                // Use real statistics from analysis
                sectorData.reactions += statistics.reactions || 0;
                sectorData.comments += statistics.comments || 0;
                sectorData.shares += statistics.shares || 0;
                sectorData.views += statistics.views || 0;
                sectorData.total = sectorData.reactions + sectorData.comments + sectorData.shares;

                const classificationEntry = sectorData.classifications.find(
                    (cls) => cls.type === classification
                );

                if (classificationEntry) {
                    classificationEntry.count++;
                }
            }

            // Process news data
            for (const news of newsData) {
                const sectorName = news.sectorData.name;

                if (!sectorsMap.has(sectorName)) {
                    sectorsMap.set(sectorName, {
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
                    });
                }

                const sectorData = sectorsMap.get(sectorName)!;
                sectorData.appearances++;
                sectorData.totalMonitoringFromNews++;

                // Map NewsClassifyEnum to AnalysisClassifyEnum
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

                const classificationEntry = sectorData.classifications.find(
                    (cls) => cls.type === mappedClassification
                );

                if (classificationEntry) {
                    classificationEntry.count++;
                }
            }

            
            const result = Array.from(sectorsMap.values())
                .sort((a, b) => b.total - a.total)

            return result.slice(0, Math.min(5, result.length));
    }, [allAnalysis, allNews]);

    // Update data when the allAnalysis prop changes
    useEffect(() => {
        if(allAnalysis) {
            setAllSubAnalysis(deriveSubAnalysis(allAnalysis))
        }
        if(allAnalysis && allNews) {
            setAllSectors(deriveTopSectorsByEngagement(allAnalysis, allNews));
        }
    }, [allAnalysis, allNews])

    // Effect to control the start and stop of the animation
    useEffect(() => {
        // Dynamic duration for consistent scroll speed
        const scrollDuration = allSubAnalysis.length * 4; // Adjusted for potentially larger items

        if (isSubAnalysisAnimating) {
            controls.start({
                y: "-50%", // Animate up by the height of one list
                transition: {
                    ease: "linear",
                    duration: scrollDuration < 15 ? 15 : scrollDuration, // Set a minimum duration
                    repeat: Infinity,
                }
            });
        } else {
            controls.stop(); // Pause the animation
        }
    }, [isSubAnalysisAnimating, controls, allSubAnalysis]);

    return (
        <div className="min-h-36 w-full flex flex-col lg:flex-row gap-1 overflow-hidden backdrop-blur-sm">
            <motion.div
                // className="absolute top-0 left-0 right-0 flex flex-col gap-2"
                className="w-full lg:w-1/2 h-full border border-gray-700/50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
                <table className="w-full text-sm" dir="rtl">
                    <thead className="">
                        <tr className="border-b border-gray-700/50">
                            <th className="py-1 px-2 text-gray-300 text-[10px] text-start">{t("monitoring")}</th>
                            <th className="py-1 px-2 text-gray-300 text-[10px] text-center">{t("topSubAnalysis")}</th>
                            <th className="py-1 px-2 text-gray-300 text-[10px] text-end">{t("statistics")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allSubAnalysis.map((subAnalysis, index) => (
                            <tr key={index} className="border-b text-xs border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                                <td className="text-start py-1 px-2 text-blue-300">{subAnalysis.count}</td>
                                <td className="text-center py-1 px-2 text-gray-300 truncate max-w-[200px]">{subAnalysis.name}</td>
                                <td className="text-end py-1 px-2 text-blue-300">
                                    {subAnalysis.totalEngagement.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
            <motion.div
                // className="absolute top-0 left-0 right-0 flex flex-col gap-2"
                className="w-full lg:w-1/2 h-full border border-gray-700/50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
                <table className="w-full text-sm" dir="rtl">
                    <thead>
                        <tr className="border-b border-gray-700/50">
                            <th className="py-1 px-2 text-gray-300 text-[10px] text-start">{t("monitoring")}</th>
                            <th className="py-1 px-2 text-gray-300 text-[10px] text-center">{t("topSectors")}</th>
                            <th className="py-1 px-2 text-gray-300 text-[10px] text-end">{t("statistics")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allSectors.map((sector, index) => (
                            <tr key={index} className="border-b text-xs border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                                <td className="text-start py-1 px-2 text-blue-300">{sector.totalMonitoringFromAnalysis + sector.totalMonitoringFromNews}</td>
                                <td className="text-center py-1 px-2 text-gray-300 truncate max-w-[200px]">{sector.name}</td>
                                <td className="text-end py-1 px-2 text-blue-300">
                                    {sector.total.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </div>
    )
}

export default SubAnalysisAndSectorsSection;