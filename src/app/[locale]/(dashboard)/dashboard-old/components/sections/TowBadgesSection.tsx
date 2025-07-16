
interface ITwoBadgesSectionProps {
    allAnalysisCount: number;
    allNewsCount: number
}

const TwoBadgesSection = ({ allAnalysisCount, allNewsCount }: ITwoBadgesSectionProps) => {

    const totalAllNews = allNewsCount
    const totalAllAnalysis = allAnalysisCount
    const totalContent = totalAllAnalysis + totalAllNews
    
    const radius = 55
    const circumference = 2 * Math.PI * radius
    
    const newsPercentage = totalAllNews / totalContent
    const analysisPercentage = totalAllAnalysis / totalContent
    
    const newsStrokeDashoffset = circumference * (1 - newsPercentage)
    const analysisStrokeDashoffset = circumference * (1 - analysisPercentage)

    return (
        <div className="w-1/5">
            <div className="flex flex-col gap-1 items-center justify-center p-1 bg-gray-800/50 rounded-lg">                        
                <div className="flex-1 flex items-center justify-center max-h-[200px]">
                    <svg width="110" height="110" viewBox="0 0 140 140" className="relative">
                        {/* Background circle */}
                        <circle
                            cx="70"
                            cy="70"
                            r={radius}
                            fill="none"
                            stroke="#1f2937"
                            strokeWidth="16"
                            className="opacity-50"
                        />
                        {/* Analysis progress circle */}
                        <circle
                            cx="70"
                            cy="70"
                            r={radius}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="16"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={analysisStrokeDashoffset}
                            transform="rotate(-90 70 70)"
                            className="transition-all duration-1000 ease-in-out"
                            style={{
                                filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))'
                            }}
                        />
                        {/* Center text */}
                        <text x="70" y="70" textAnchor="middle" dominantBaseline="middle" className="fill-white text-3xl font-bold">
                            {totalAllAnalysis}
                        </text>
                        <text x="70" y="100" textAnchor="middle" className="text-[8px] fill-gray-300">
                            التواصل الإجتماعي
                        </text>
                    </svg>
                </div>

                <div className="flex-1 flex items-center justify-center max-h-[200px]">
                    <svg width="110" height="110" viewBox="0 0 140 140" className="relative">
                        {/* Background circle */}
                        <circle
                            cx="70"
                            cy="70"
                            r={radius}
                            fill="none"
                            stroke="#1f2937"
                            strokeWidth="16"
                            className="opacity-50"
                        />
                        {/* News progress circle */}
                        <circle
                            cx="70"
                            cy="70"
                            r={radius}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="16"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={newsStrokeDashoffset}
                            transform="rotate(90 70 70)"
                            className="transition-all duration-1000 ease-in-out"
                            style={{
                                filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
                            }}
                        />
                        {/* Center text */}
                        <text x="70" y="70" textAnchor="middle" dominantBaseline="middle" className="fill-white text-3xl font-bold">
                            {totalAllNews}
                        </text>
                        <text x="70" y="100" textAnchor="middle" className="text-[8px] fill-gray-300">
                            الأخبار
                        </text>
                    </svg>
                </div>

        
            </div>
        </div>
    )
}

export default TwoBadgesSection;

