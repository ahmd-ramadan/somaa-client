'use client'

import { motion } from "framer-motion";
import { AnalysisClassifyEnum, IAnalysis } from "@/interfaces/analysis.types";
import { BarChart, EyeIcon, Heart, MessageCircle, Pause, Play, Share2, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createTickerVariants } from "./animations";
import { formatDistanceToNow } from "./utils";
import { useLocale, useTranslations } from "next-intl";

interface IImportantAnalysisSectionProps {
    allAnalysis: IAnalysis[]
}
const ImportantAnalysisSection = ({ allAnalysis }: IImportantAnalysisSectionProps) => {
    
    const t = useTranslations("DashboardPage")
    const locale = useLocale();

    const [importantAnalysis, setImportantAnalysis] = useState<IAnalysis[]>([])
    const [isImportantAnalysisAnimating, setIsImportantAnalysisAnimating] = useState(true);
    const importantTickerRef = useRef<HTMLDivElement>(null);
    const [importantTickerPosition, setImportantTickerPosition] = useState(0);

    useEffect(() => {
        if(allAnalysis) setImportantAnalysis(deriveImportantAnalysis(allAnalysis));
    }, [allAnalysis]);

    const deriveImportantAnalysis = (analysisData: IAnalysis[]): IAnalysis[] => {
        return analysisData.filter(a => a.isHighlighted === true)
    }

    const toggleImportantAnalysisAnimation = () => {
        if (importantTickerRef.current) {
            const transform = window.getComputedStyle(importantTickerRef.current).transform;
            const matrix = new DOMMatrix(transform);
            const currentY = matrix.m42;
            setImportantTickerPosition(currentY);
        }
        setIsImportantAnalysisAnimating(prev => !prev);
    };

    return (
        <div
            className={
                "rounded-lg shadow-lg border border-gray-700/50 p-1 hover:shadow-xl transition-all duration-300 flex-1 flex flex-col " +
                (importantAnalysis.length === 0
                    // ? "bg-gradient-to-br from-primary via-blue-800 to-blue-700"
                    ? "bg-gradient-to-r from-primary to-green-500"
                    : "bg-gradient-to-r from-primary to-green-500")
            }
        >
            <div className="p-1 flex items-center justify-between">
                <div className="flex gap-1 items-center">
                    <button 
                        onClick={toggleImportantAnalysisAnimation}
                        className="rounded-full hover:bg-gray-700 transition-colors"
                    >
                        {isImportantAnalysisAnimating ? (
                            <Pause className="h-4 w-4 text-blue-300" />
                        ) : (
                            <Play className="h-4 w-4 text-blue-300" />
                        )}
                    </button>
                    <h3 className="text-sm text-gray-300 flex items-center gap-1">
                        {/* <Bell className="w-5 h-5 text-blue-300" /> */}
                        {t("importantMonitoring")}
                    </h3>
                </div>
                <div className="flex items-center justify-center">
                    <span className="text-sm text-gray-300">{importantAnalysis.length.toLocaleString()}</span>
                </div>
            </div>
            
            <div className="relative flex-1 overflow-hidden">
                <motion.div
                    ref={importantTickerRef}
                    className="absolute inset-0"
                    variants={createTickerVariants(importantTickerPosition)}
                    animate={!isImportantAnalysisAnimating ? "pause" : "animate"}
                >
                    <div className="space-y-2">
                        {importantAnalysis.map((analysis, index) => (
                            <motion.div 
                                key={analysis._id || index} 
                                className="bg-primary p-2 rounded-lg animate-pulse"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between">
                                        {/* UserInfo */}
                                        <div className="flex gap-1">
                                            { analysis.publisher.avatar ? 
                                                <img 
                                                    src={analysis?.publisher?.avatar}
                                                    alt={analysis.publisher?.name?.charAt(0)}
                                                    // width={50}
                                                    // height={50}
                                                    className="rounded-full w-10 h-10 bg-gray-600 flex items-center justify-center text-gray-300"
                                                /> :
                                                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
                                                {analysis.publisher?.name?.charAt(0) || '?'
                                            }
                                            </div>}
                                            <div className="flex flex-col justify-start items-start gap-1 mb-1">
                                                <span className="text-xs font-medium text-gray-300">
                                                    {analysis.publisher?.name || 'Unknown Publisher'}
                                                </span>
                                                <div className="flex gap-2">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-3 h-3 text-blue-300"/>
                                                        <span className="text-xs font-medium text-gray-300">{analysis.publisher.followers.toLocaleString()}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {formatDistanceToNow({ date: analysis.createdAt, locale }) }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Classification Badge */}
                                        <div className={`h-fit w-fit p-1 rounded-md text-xs ${
                                            analysis.classify === AnalysisClassifyEnum.POSITIVE 
                                                ? 'bg-green-500/20 text-green-400' 
                                                : analysis.classify === AnalysisClassifyEnum.NEUTRAL 
                                                ? 'bg-gray-500/20 text-gray-400'
                                                : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {t(analysis.classify)}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="">
                                        <p className="text-xs text-gray-400 my-2 px-2 line-clamp-2">
                                            {analysis.content?.body || analysis.subAnalysisData?.body || 'No content available'}
                                        </p>

                                        {/* Statistics */}
                                        <div className="flex items-center justify-around text-xs text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <EyeIcon className="w-3 h-3 text-blue-300"/>
                                                {analysis.statistics?.views.toLocaleString() || 0}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Share2 className="w-3 h-3 text-blue-300"/>
                                                {analysis.statistics?.shares.toLocaleString() || 0}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-3 h-3 text-blue-300"/>
                                                {analysis.statistics?.reactions.toLocaleString() || 0}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="w-3 h-3 text-blue-300"/>
                                                {analysis.statistics?.comments.toLocaleString() || 0}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BarChart className="w-3 h-3 text-blue-300"/>
                                                {analysis.statistics?.appearance.toLocaleString() || 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default ImportantAnalysisSection