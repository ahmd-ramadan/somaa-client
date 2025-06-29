'use client'

import { AnalysisClassifyEnum, IAnalysis } from "@/interfaces/analysis.types"
import { AnimatePresence, motion, useAnimation } from "framer-motion"
import { BarChart, Pause, Play } from "lucide-react" // Import Pause and Play icons
import { useEffect, useState } from "react"
import { IDashboardSubAnalysis } from "./types"

interface ISubAnalysisSectionProps {
    allAnalysis: IAnalysis[]
}

const SubAnalysisSection = ({ allAnalysis }: ISubAnalysisSectionProps) => {

    const [allSubAnalysis, setAllSubAnalysis] = useState<IDashboardSubAnalysis[]>([])
    const [isSubAnalysisAnimating, setIsSubAnalysisAnimating] = useState(true);
    const controls = useAnimation(); // Hook for controlling the animation

    // Derives and counts sub-analysis data
    const deriveSubAnalysis = (analysisData: IAnalysis[]): IDashboardSubAnalysis[] => {
        const analysisMap = new Map<string, { count: number, classifications: Map<AnalysisClassifyEnum, number> }>();
        
        analysisData.forEach(analysis => {
            const name = analysis.subAnalysis.body;
            if (!name) return;
            
            if (!analysisMap.has(name)) {
                analysisMap.set(name, {
                    count: 0,
                    classifications: new Map<AnalysisClassifyEnum, number>()
                });
            }
            
            const current = analysisMap.get(name)!;
            current.count++;
            
            // Update classifications count
            if (analysis.classify) {
                const currentCount = current.classifications.get(analysis.classify) || 0;
                current.classifications.set(analysis.classify, currentCount + 1);
            }
        });
        
        const response = Array.from(analysisMap.entries()).map(([name, data]) => ({
            name,
            count: data.count,
            classifications: Array.from(data.classifications.entries()).map(([type, count]) => ({
                type,
                count
            }))
        }));
        return response.sort((a, b) => b.count - a.count).slice(0, Math.min(response.length, 5))
    };
    
    // Update data when the allAnalysis prop changes
    useEffect(() => {
        if(allAnalysis) {
            setAllSubAnalysis(deriveSubAnalysis(allAnalysis));
        }
    }, [allAnalysis])

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

    const toggleSubAnalysisAnimation = () => {
        setIsSubAnalysisAnimating(!isSubAnalysisAnimating);
    };

    // A reusable component for a single sub-analysis item
    const SubAnalysisItem = ({ item, ...props }: { item: IDashboardSubAnalysis, [key: string]: any }) => (
        <motion.div
            className="bg-gray-700/50 p-2 rounded-lg"
            whileHover={{ scale: 1.02, backgroundColor: "rgba(55, 65, 81, 0.8)" }}
            {...props}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-6 h-6 rounded-full bg-gray-600/50 flex items-center justify-center flex-shrink-0">
                        <BarChart className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-xs font-medium text-gray-300 truncate">
                        {item.name}
                    </span>
                </div>
                <span className="text-sm font-semibold text-blue-400 ml-2">
                    {item.count}
                </span>
            </div>
        </motion.div>
    );

    return (
        <div className="w-1/2 h-full p-1 overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 hover:shadow-xl transition-all duration-300">
            {/* Header Section */}
            <div className="flex items-center justify-between p-1">
                <div className="flex gap-1 items-center">
                    <button
                        onClick={toggleSubAnalysisAnimation}
                        className="rounded-full hover:bg-gray-700 transition-colors"
                        aria-label={isSubAnalysisAnimating ? "Pause animation" : "Play animation"}
                    >
                        {isSubAnalysisAnimating ? (
                            <Pause className="h-4 w-4 text-blue-400" />
                        ) : (
                            <Play className="h-4 w-4 text-blue-400" />
                        )}
                    </button>
                    <h3 className="text-sm text-gray-300 flex items-center gap-1">
                        {/* <BarChart className="w-5 h-5 text-blue-400" /> */}
                        التحليلات الأبرز
                    </h3>
                </div>
                <div className="flex items-center justify-center">
                    <span className="text-sm text-gray-300">{allSubAnalysis.length.toLocaleString()}</span>
                </div>
            </div>
            
            {/* Scrolling Animation Container */}
            <div className="relative h-[calc(100%-2.5rem)] overflow-hidden">
                <motion.div
                    className="absolute top-0 left-0 right-0 flex flex-col gap-2"
                    animate={controls}
                    initial={{ y: 0 }}
                >
                    {/* Render the list twice for a seamless loop */}
                    {allSubAnalysis.map((subAnalysis, index) => (
                        <SubAnalysisItem key={`first-${index}`} item={subAnalysis} />
                    ))}
                    {allSubAnalysis.map((subAnalysis, index) => (
                        <SubAnalysisItem key={`second-${index}`} item={subAnalysis} />
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

export default SubAnalysisSection;