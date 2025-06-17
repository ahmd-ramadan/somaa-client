'use client'

import { motion, AnimatePresence } from "framer-motion";
import { AnalysisClassifyEnum, IAnalysis } from "@/interfaces/analysis.types";
import { BarChart, Bell, EyeIcon, Heart, LineChart, MessageCircle, Pause, Play, Share2, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createTickerVariants } from "./animations";
import Image from "next/image";
import { formatDistanceToNow } from "./utils";
import { useLocale } from "next-intl";

interface IImportantAnalysisSectionProps {
    allAnalysis: IAnalysis[]
}
const ImportantAnalysisSection = ({ allAnalysis }: IImportantAnalysisSectionProps) => {

    const locale = useLocale();

    const [importantAnalysis, setImportantAnalysis] = useState<IAnalysis[]>([])
    const [isImportantAnalysisAnimating, setIsImportantAnalysisAnimating] = useState(true);
    const importantTickerRef = useRef<HTMLDivElement>(null);
    const [importantTickerPosition, setImportantTickerPosition] = useState(0);
    const [isImportantTickerPaused, setIsImportantTickerPaused] = useState(false);

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
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-2 hover:shadow-xl transition-all duration-300 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1 items-center">
                    <button 
                        onClick={toggleImportantAnalysisAnimation}
                        className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                    >
                        {isImportantAnalysisAnimating ? (
                            <Pause className="h-4 w-4 text-gray-300" />
                        ) : (
                            <Play className="h-4 w-4 text-gray-300" />
                        )}
                    </button>
                    <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                        <Bell className="w-5 h-5" />
                        الرصد الهام
                    </h3>
                </div>
                <div className="p-1 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-300">{importantAnalysis.length}</span>
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
                                className="bg-gray-700/50 p-2 rounded-lg"
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
                                                <Image 
                                                    src={analysis.publisher.avatar}
                                                    alt={analysis.publisher?.name?.charAt(0)}
                                                    width={50}
                                                    height={50}
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
                                                        <Users className="w-3 h-3 text-gray-300" fill="white"/>
                                                        <span className="text-xs font-medium text-gray-300">{analysis.publisher.followers}</span>
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
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {analysis.classify === AnalysisClassifyEnum.POSITIVE 
                                                ? 'إيجابي' 
                                                : analysis.classify === AnalysisClassifyEnum.NEUTRAL 
                                                ? 'محايد'
                                                : 'سلبي'}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="">
                                        <p className="text-xs text-gray-400 my-2 px-2 line-clamp-2">
                                            {analysis.content?.body || analysis.subAnalysis?.body || 'No content available'}
                                        </p>

                                        {/* Statistics */}
                                        <div className="flex items-center justify-around text-xs text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <EyeIcon className="w-3 h-3" fill="white"/>
                                                {analysis.statistics?.views || 0}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Share2 className="w-3 h-3" fill="white"/>
                                                {analysis.statistics?.shares || 0}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-3 h-3" fill="white"/>
                                                {analysis.statistics?.reactions || 0}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="w-3 h-3" fill="white"/>
                                                {analysis.statistics?.comments || 0}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BarChart className="w-3 h-3" fill="white"/>
                                                {analysis.statistics?.appearance || 0}
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