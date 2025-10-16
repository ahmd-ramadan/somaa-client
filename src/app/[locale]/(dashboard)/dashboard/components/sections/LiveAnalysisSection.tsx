'use client'

import { motion } from "framer-motion";
import { AnalysisClassifyEnum, IAnalysis } from "@/interfaces/analysis.types";
import { BarChart, EyeIcon, Heart, MessageCircle, Pause, Play, Share2, Users } from "lucide-react";
import { useRef, useState } from "react";
import { createTickerVariants } from "./animations";
import { useLocale, useTranslations } from "next-intl";
import { formatDistanceToNow } from "./utils";
import { getPlatformIcon } from "../../../social-media/components/AllAnalysisTable/components/TableRow";

interface ILiveAnalysisSectionProps {
    allAnalysis: IAnalysis[]
}
const LiveAnalysisSection = ({ allAnalysis }: ILiveAnalysisSectionProps) => {

	const t = useTranslations("DashboardPage");
    const locale = useLocale();

    const [isLiveAnalysisAnimating, setIsLiveAnalysisAnimating] = useState(true);
    const liveTickerRef = useRef<HTMLDivElement>(null);
    const [liveTickerPosition, setLiveTickerPosition] = useState(0);
    const [imageError, setImageError] = useState<Map<string, boolean>>(new Map());


    const toggleLiveAnalysisAnimation = () => {
        if (liveTickerRef.current) {
            const transform = window.getComputedStyle(liveTickerRef.current).transform;
            const matrix = new DOMMatrix(transform);
            const currentY = matrix.m42;
            setLiveTickerPosition(currentY);
        }
        setIsLiveAnalysisAnimating(prev => !prev);
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-1 hover:shadow-xl transition-all duration-300 flex-1 flex flex-col">
            <div
                className="p-1 flex items-center justify-between"
            >    
                <div className="flex justify-between items-center">
                    <button 
                        onClick={toggleLiveAnalysisAnimation}
                        className="rounded-full hover:bg-gray-700 transition-colors"
                    >
                        {isLiveAnalysisAnimating ? (
                            <Pause className="h-4 w-4 text-blue-300" />
                        ) : (
                            <Play className="h-4 w-4 text-blue-300" />
                        )}
                    </button>
                    <h3 className="text-sm text-gray-300 flex items-center gap-1">
                        {/* <LineChart className="w-5 h-5 text-blue-300" /> */}
                        {t("liveMonitoring")}
                    </h3>
                    
                </div>
                <div className="flex items-center justify-center">
                        <span className="text-sm text-gray-300">{allAnalysis.length.toLocaleString()}</span>
                </div>
            </div>
            <div className="relative flex-1 overflow-hidden">
                <motion.div
                    ref={liveTickerRef}
                    className="absolute inset-0"
                    variants={createTickerVariants(liveTickerPosition, allAnalysis.length)}
                    animate={!isLiveAnalysisAnimating ? "pause" : "animate"}
                >
                    <div className="space-y-2">
                    {allAnalysis.slice(0, 40).map((analysis, index) => (
                            <motion.div 
                                key={index} 
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
                                            { analysis?.publisher?.avatar && !imageError.get(analysis._id) ? (
                                                    <img
                                                        src={analysis.publisher.avatar}
                                                        onError={() => setImageError(prev => new Map(prev).set(analysis._id, true))}
                                                        alt="Publisher avatar"
                                                        className="h-10 w-10 rounded-md cursor-pointer transition-transform duration-200 group-hover:scale-105 text-xs"
                                                    />
                                                ) : (
                                                    <div className='bg-gray-100 w-10 h-10 flex items-center justify-center rounded-md'>
                                                        {getPlatformIcon(analysis.platform)}
                                                    </div>
                                                )
                                            }
                                            <div className="flex flex-col justify-start items-start gap-1 mb-1">
                                                <span className="text-xs font-medium text-gray-300">
                                                    {analysis.publisher?.name || 'Unknown Publisher'}
                                                </span>
                                                <div className="flex gap-2">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-3 h-3 text-blue-300" />
                                                        <span className="text-xs font-medium text-gray-300">{analysis.publisher.followers.toLocaleString()}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        { formatDistanceToNow({ locale, date: analysis.createdAt })}
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
                                                {/* <span className="w-2 h-2 rounded-full bg-blue-500"></span> */}
                                                <EyeIcon className="w-3 h-3 text-blue-300"/>
                                                {analysis.statistics?.views.toLocaleString() || 0}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {/* <span className="w-2 h-2 rounded-full bg-green-500"></span> */}
                                                <Share2 className="w-3 h-3 text-blue-300"/>
                                                {analysis.statistics?.shares.toLocaleString() || 0}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {/* <span className="w-2 h-2 rounded-full bg-orange-500"></span> */}
                                                <Heart className="w-3 h-3 text-blue-300"/>
                                                {analysis.statistics?.reactions.toLocaleString() || 0}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {/* <span className="w-2 h-2 rounded-full bg-orange-500"></span> */}
                                                <MessageCircle className="w-3 h-3 text-blue-300"/>
                                                {analysis.statistics?.comments.toLocaleString() || 0}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {/* <span className="w-2 h-2 rounded-full bg-orange-500"></span> */}
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

export default LiveAnalysisSection;