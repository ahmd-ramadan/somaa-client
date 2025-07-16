'use clieAnalysisClassifyEnum, nt'

import { AnalysisClassifyEnum, IAnalysis } from "@/interfaces/analysis.types"
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IDashboardClassify, IDashboardSector } from "./types";
import { BarChart } from "lucide-react";
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';


interface ISectorsSectionProps {
    allAnalysis: IAnalysis[]
}
const SectorsSection = ({ allAnalysis }: ISectorsSectionProps) => {

    const [allSectors, setAllSectors] = useState<IDashboardSector[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);


    useEffect(() => {
        if (allAnalysis) setAllSectors(deriveSectors(allAnalysis))
    }, [allAnalysis])

    const deriveSectors = (analysisData: IAnalysis[]): IDashboardSector[] => {
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
    };

    const prepareSectorChartData = (sectors: IDashboardSector[]) => {
        const labels = sectors.map(sector => sector.name);
        const data = sectors.map(sector => sector.total);
        const backgroundColors = sectors.map(sector => {
            // Assign colors based on the dominant classification or total count
            const dominantColor = handleClassificationsBigColor(sector);
            if (dominantColor === 'green-500') return 'rgba(34, 197, 94, 0.8)'; // Tailwind green-500 with alpha
            if (dominantColor === 'blue-500') return 'rgba(59, 130, 246, 0.8)'; // Tailwind blue-500 with alpha
            if (dominantColor === 'red-500') return 'rgba(239, 68, 68, 0.8)';   // Tailwind red-500 with alpha
            return 'rgba(156, 163, 175, 0.8)'; // Default gray-400 with alpha
        });

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Total Analysis',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.8', '1')), // Solid border
                    borderWidth: 1,
                },
            ],
        };
    };

    const scrollVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        exit: { 
            opacity: 0, 
            y: -20,
            transition: {
                duration: 0.3,
                ease: "easeIn"
            }
        }
    };

    const handleClassificationsBigColor = (sector: IDashboardSector) => {
        const positiveCount = sector.classifications[0].count;
        const nueturalCount = sector.classifications[1].count;
        const negativeCount = sector.classifications[2].count;

        const maxCount = Math.max(positiveCount, negativeCount, nueturalCount);

        if(positiveCount === maxCount) return 'green-500' 
        if(nueturalCount === maxCount) return 'blue-500'
        if(negativeCount === maxCount) return 'red-500'
    }

    return (
        <div className="flex flex-col gap-2 flex-1">
            <div className="relative h-full overflow-hidden">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        className="absolute inset-0 flex flex-col"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        // variants={scrollVariants}
                    >
                        {/* Top 4 Sectors */}
                        {allSectors
                            .sort((a, b) => b.total - a.total)
                            .slice(0, 4)
                            .map((sector, index) => (
                                <motion.div 
                                    key={index} 
                                    className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-2 transition-all duration-300 mb-2 relative overflow-hidden hover:shadow-xl"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex justify-between items-center gap-2">
                                        {/* Name and Classifications */}
                                        <div className="flex flex-col items-center ml-2">
                                            <span className="text-xs font-semibold text-gray-100 mb-1">{sector.name}</span>
                                            <div className="flex gap-1.5 text-xs text-gray-300">
                                                {sector.classifications.map((cls, clsIndex) => (
                                                    <div key={clsIndex} className="flex items-center gap-0.5">
                                                        <div className={`w-1 h-1 rounded-full ${
                                                            cls.type === AnalysisClassifyEnum.POSITIVE ? 'bg-green-500' :
                                                            cls.type === AnalysisClassifyEnum.NEUTRAL ? 'bg-blue-500' :
                                                            'bg-red-500'
                                                        }`} />
                                                        <span className={`${
                                                            cls.type === AnalysisClassifyEnum.POSITIVE ? 'text-green-500' : 
                                                            cls.type === AnalysisClassifyEnum.NEUTRAL ? 'text-blue-500' : 
                                                            'text-red-500'
                                                        }`}>
                                                            {cls.count}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Chart */}
                                        <div className="flex-1 h-16 min-w-[120px]">
                                            {isMounted && (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart
                                                        data={[
                                                            { 
                                                                name: 'إيجابي', 
                                                                positive: sector.classifications[0].count,
                                                                neutral: 0,
                                                                negative: 0,
                                                                total: sector.total
                                                            },
                                                            { 
                                                                name: 'محايد', 
                                                                positive: 0,
                                                                neutral: sector.classifications[1].count,
                                                                negative: 0,
                                                                total: sector.total
                                                            },
                                                            { 
                                                                name: 'سلبي', 
                                                                positive: 0,
                                                                neutral: 0,
                                                                negative: sector.classifications[2].count,
                                                                total: sector.total
                                                            }
                                                        ]}
                                                        margin={{ top: 2, right: 2, left: -5, bottom: 2 }}
                                                    >
                                                        <defs>
                                                            <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity={0.9}/>
                                                                <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity={0.2}/>
                                                            </linearGradient>
                                                            <linearGradient id="neutralGradient" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity={0.9}/>
                                                                <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity={0.2}/>
                                                            </linearGradient>
                                                            <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity={0.9}/>
                                                                <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity={0.2}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid
                                                            strokeDasharray="3 3"
                                                            stroke="rgba(255, 255, 255, 0.1)"
                                                            strokeOpacity={0.2}
                                                            vertical={false}
                                                        />
                                                        <XAxis
                                                            dataKey="name"
                                                            stroke="rgba(255, 255, 255, 0.5)"
                                                            fontSize={8}
                                                            tickLine={false}
                                                            axisLine={false}
                                                            height={20}
                                                        />
                                                        <YAxis
                                                            stroke="rgba(255, 255, 255, 0.5)"
                                                            fontSize={8}
                                                            tickLine={false}
                                                            axisLine={false}
                                                            width={20}
                                                            tickFormatter={(value) => `${value}`}
                                                        />
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                borderRadius: '4px',
                                                                color: 'white',
                                                                padding: '8px 12px',
                                                                fontSize: '12px',
                                                            }}
                                                            labelStyle={{ 
                                                                color: 'rgba(255, 255, 255, 0.7)',
                                                                marginBottom: '4px',
                                                                fontSize: '12px',
                                                                fontWeight: '500'
                                                            }}
                                                            itemStyle={{
                                                                color: 'white',
                                                                fontSize: '12px',
                                                                padding: '2px 0'
                                                            }}
                                                            formatter={(value: number, name: string) => {
                                                                const total = sector.classifications.reduce((acc, curr) => acc + curr.count, 0);
                                                                const percentage = ((value) / total * 100).toFixed(1);
                                                                return [`${value} (${percentage}%)`, 
                                                                    name === 'positive' ? 'إيجابي' :
                                                                    name === 'neutral' ? 'محايد' : 'سلبي'
                                                                ];
                                                            }}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="positive"
                                                            stroke="rgb(34, 197, 94)"
                                                            strokeWidth={2}
                                                            fill="url(#positiveGradient)"
                                                            fillOpacity={0.8}
                                                            animationDuration={2000}
                                                            animationBegin={0}
                                                            animationEasing="ease-out"
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="neutral"
                                                            stroke="rgb(59, 130, 246)"
                                                            strokeWidth={2}
                                                            fill="url(#neutralGradient)"
                                                            fillOpacity={0.8}
                                                            animationDuration={2000}
                                                            animationBegin={200}
                                                            animationEasing="ease-out"
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="negative"
                                                            stroke="rgb(239, 68, 68)"
                                                            strokeWidth={2}
                                                            fill="url(#negativeGradient)"
                                                            fillOpacity={0.8}
                                                            animationDuration={2000}
                                                            animationBegin={400}
                                                            animationEasing="ease-out"
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                        {/* Other Sectors Card */}
                        {allSectors.length > 4 && (
                            <motion.div 
                                className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-2 transition-all duration-300"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex justify-between items-center mb-1.5">
                                    <h3 className="text-xs font-semibold text-gray-300 flex items-center gap-1">
                                        <BarChart className="w-3 h-3 text-blue-400" />
                                        القطاعات الأخرى
                                    </h3>
                                    <span className="text-xs text-gray-400 bg-gray-700/50 px-1.5 py-0.5 rounded-full">
                                        {allSectors.length - 4} قطاعات
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {allSectors
                                        .sort((a, b) => b.total - a.total)
                                        .slice(4)
                                        .map((sector, index) => (
                                            <motion.div
                                                key={index}
                                                className="bg-gray-700/30 backdrop-blur-sm p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-medium text-gray-300">{sector.name}</span>
                                                    <div className="flex gap-1">
                                                        {sector.classifications.map((cls, clsIndex) => (
                                                            <div key={clsIndex} className="flex items-center gap-0.5">
                                                                <div className={`w-1 h-1 rounded-full ${
                                                                    cls.type === AnalysisClassifyEnum.POSITIVE ? 'bg-green-500' :
                                                                    cls.type === AnalysisClassifyEnum.NEUTRAL ? 'bg-blue-500' :
                                                                    'bg-red-500'
                                                                }`} />
                                                                <span className="text-xs text-gray-400">{cls.count}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default SectorsSection;