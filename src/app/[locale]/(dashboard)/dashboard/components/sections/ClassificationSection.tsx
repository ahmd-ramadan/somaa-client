import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { DashboardClassificationsDefault, IDashboardClassify } from "./types";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { AnalysisClassifyEnum, IAnalysis } from "@/interfaces/analysis.types";
import { INews, NewsClassifyEnum } from "@/interfaces/news.types";



interface ClassificationSectionProps {
    allAnalysis: IAnalysis[];
    allNews: INews[]
} 
const ClassificationSection = ({ allAnalysis, allNews }: ClassificationSectionProps) => {

    const [allCalssifications, setAllcassifications] = useState<IDashboardClassify[]>(DashboardClassificationsDefault)

    useEffect(() => {
        if(allAnalysis && allNews) {
            setAllcassifications(deriveClassifications(allAnalysis, allNews))
        }
    }, [allAnalysis, allNews])

    const deriveClassifications = (analysisData: IAnalysis[], newsData: INews[]): IDashboardClassify[] => {
        const positiveAnalysis = analysisData.filter(a => a.classify === AnalysisClassifyEnum.POSITIVE).length
        const nuetralAnalysis = analysisData.filter(a => a.classify === AnalysisClassifyEnum.NEUTRAL).length
        const negativeAnalysis = analysisData.filter(a => a.classify === AnalysisClassifyEnum.NEGATIVE).length
        
        const positiveNews = newsData.filter(a => a.classify === NewsClassifyEnum.POSITIVE).length
        const nuetralNews = newsData.filter(a => a.classify === NewsClassifyEnum.NEUTRAL).length
        const negativeNews = newsData.filter(a => a.classify === NewsClassifyEnum.NEGATIVE).length

        return [
            { type: AnalysisClassifyEnum.POSITIVE, count: positiveAnalysis + positiveNews },
            { type: AnalysisClassifyEnum.NEUTRAL, count: nuetralAnalysis + nuetralNews },
            { type: AnalysisClassifyEnum.NEGATIVE, count: negativeAnalysis + negativeNews},
        ]
    }

    const getClassificationIcon = (type: AnalysisClassifyEnum) => {
        switch (type) {
            case AnalysisClassifyEnum.POSITIVE:
                return <TrendingUp className="w-8 h-8 text-green-500" />;
            case AnalysisClassifyEnum.NEUTRAL:
                return <Minus className="w-8 h-8 text-blue-500" />;
            case AnalysisClassifyEnum.NEGATIVE:
                return <TrendingDown className="w-8 h-8 text-red-500" />;
        }
    };

    return (
        <div className="flex items-center justify-center p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between gap-6 w-full">
                {allCalssifications.map((cls, index) => (
                    <motion.div 
                        key={index} 
                        className="flex flex-col items-center hologram-effect animate-float"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <div className={`w-16 h-16 rounded-xl border-2 ${
                            cls.type === AnalysisClassifyEnum.POSITIVE ? 'border-green-500 bg-green-500/10' : 
                            cls.type === AnalysisClassifyEnum.NEUTRAL ? 'border-blue-500 bg-blue-500/10' : 
                            'border-red-500 bg-red-500/10'
                        } flex items-center justify-center shadow-lg`}>
                            {getClassificationIcon(cls.type)}
                        </div>
                        <div className={`mt-2 px-3 py-1 rounded-full ${
                            cls.type === AnalysisClassifyEnum.POSITIVE ? 'bg-green-500/20 text-green-400' : 
                            cls.type === AnalysisClassifyEnum.NEUTRAL ? 'bg-blue-500/20 text-blue-400' : 
                            'bg-red-500/20 text-red-400'
                        } text-lg font-bold`}>
                            {cls.count}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default ClassificationSection;