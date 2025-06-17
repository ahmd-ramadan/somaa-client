'use client'

import { IAnalysis, PlatformsEnum } from "@/interfaces/analysis.types";
import { IDashboardPlatform } from "./types";
import { useEffect, useState } from "react";
import { Globe, Pause, Play } from "lucide-react";
import { motion, useAnimation } from "framer-motion"; // Import useAnimation
import { getPlatformIcon, getPlatformName } from "../utils";

interface IPlatformsSectionProps {
    allAnalysis: IAnalysis[]
}

const PlatformsSections = ({ allAnalysis }: IPlatformsSectionProps) => {

    const [allPlatforms, setAllPlatforms] = useState<IDashboardPlatform[]>([]);
    const [isPlatformsAnimating, setIsPlatformsAnimating] = useState(true);
    const controls = useAnimation(); // Hook for controlling the animation

    // Derives and counts platforms from the analysis data
    const derivePlatforms = (analysisData: IAnalysis[]): IDashboardPlatform[] => {
        const analysisMap = new Map<PlatformsEnum, { total: number }>();
        for (const { platform } of analysisData) {
            if (analysisMap.has(platform)) {
                const platformObject = analysisMap.get(platform)!;
                analysisMap.set(platform, { total: platformObject?.total + 1 })
            } else {
                analysisMap.set(platform, { total: 1 })
            }
        }
        return Array.from(analysisMap.entries()).map(([platform, { total }]) => ({ platform, total }));
    };

    // Update platforms when allAnalysis prop changes
    useEffect(() => {
        if (allAnalysis) {
            setAllPlatforms(derivePlatforms(allAnalysis));
        }
    }, [allAnalysis]);

    // This effect starts or stops the animation based on the isPlatformsAnimating state
    useEffect(() => {
        // We set a dynamic duration based on the number of items to keep scroll speed consistent
        const scrollDuration = allPlatforms.length * 1.5;

        if (isPlatformsAnimating) {
            controls.start({
                y: "-50%", // Move up by the height of one full list
                transition: {
                    ease: "linear",
                    duration: scrollDuration < 10 ? 10 : scrollDuration, // Ensure a minimum duration
                    repeat: Infinity,
                }
            });
        } else {
            controls.stop(); // This instantly pauses the animation in its current state
        }
    }, [isPlatformsAnimating, controls, allPlatforms]);

    const togglePlatformsAnimation = () => {
        setIsPlatformsAnimating(!isPlatformsAnimating);
    };

    // A reusable component for a single platform item to keep the JSX clean
    const PlatformItem = ({ platform, total, ...props }: IDashboardPlatform & { [key: string]: any }) => (
        <motion.div
            className="flex items-center justify-between gap-1 p-1 rounded-lg bg-gray-700/50"
            whileHover={{ scale: 1.02, backgroundColor: "rgba(55, 65, 81, 0.8)" }} // Example: darken on hover
            {...props}
        >
            <div className="flex items-center gap-1">
                {getPlatformIcon(platform)}
                <span className="text-sm font-medium text-gray-300">{getPlatformName(platform)}</span>
            </div>
            <span className="text-sm text-blue-500 font-semibold">{total}</span>
        </motion.div>
    );

    return (
        <div className="w-1/2 h-full p-1 overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 hover:shadow-xl transition-all duration-300">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1 items-center">
                    <button
                        onClick={togglePlatformsAnimation}
                        className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                        aria-label={isPlatformsAnimating ? "Pause animation" : "Play animation"}
                    >
                        {isPlatformsAnimating ? (
                            <Pause className="h-4 w-4 text-gray-300" />
                        ) : (
                            <Play className="h-4 w-4 text-gray-300" />
                        )}
                    </button>
                    <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                        <Globe className="w-5 h-5" />
                        المنصات
                    </h3>
                </div>
                <div className="p-1 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-300">{allPlatforms.length}</span>
                </div>
            </div>

            {/* Scrolling Animation Container */}
            <div className="relative h-[calc(100%-2.5rem)] overflow-hidden">
                <motion.div
                    className="absolute top-0 left-0 right-0 flex flex-col gap-2"
                    animate={controls}
                    initial={{ y: 0 }}
                >
                    {/* We render the list twice to create a seamless loop */}
                    {allPlatforms.map((platform, index) => (
                        <PlatformItem key={`first-${index}`} {...platform} />
                    ))}
                    {allPlatforms.map((platform, index) => (
                        <PlatformItem key={`second-${index}`} {...platform} />
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

export default PlatformsSections;