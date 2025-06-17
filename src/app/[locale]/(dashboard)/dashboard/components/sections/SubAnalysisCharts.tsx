'use client'

import { AnalysisClassifyEnum, IAnalysis } from "@/interfaces/analysis.types";
import { motion } from "framer-motion";
import { BarChart as BarChartIcon, LineChart, PieChart, TrendingUp } from "lucide-react";
import { Bar as ChartBar, Doughnut } from "react-chartjs-2";
import { DashboardClassificationsDefault, IDashboardClassify, IDashboardSubAnalysis } from "./types";
import { useEffect, useState } from "react";
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface ISubAnalysischarts {
    allAnalysis: IAnalysis[]
}

const SubAnalysisCharts = ({ allAnalysis }: ISubAnalysischarts) => {

    const [allCalssifications, setAllcassifications] = useState<IDashboardClassify[]>(DashboardClassificationsDefault)
    const [allSubAnalysis, setAllSubAnalysis] = useState<IDashboardSubAnalysis[]>([])
    const [isSubAnalysisAnimating, setIsSubAnalysisAnimating] = useState(true);

    useEffect(() => {
        if(allAnalysis) {
            setAllcassifications(deriveClassifications(allAnalysis));
            setAllSubAnalysis(deriveSubAnalysis(allAnalysis))
        }
    }, [allAnalysis])

    const deriveClassifications = (analysisData: IAnalysis[]): IDashboardClassify[] => {
        const positiveAnalysis = analysisData.filter(a => a.classify === AnalysisClassifyEnum.POSITIVE).length
        const nuetralAnalysis = analysisData.filter(a => a.classify === AnalysisClassifyEnum.NEUTRAL).length
        const negativeAnalysis = analysisData.filter(a => a.classify === AnalysisClassifyEnum.NEGATIVE).length

        return [
            { type: AnalysisClassifyEnum.POSITIVE, count: positiveAnalysis },
            { type: AnalysisClassifyEnum.NEUTRAL, count: nuetralAnalysis },
            { type: AnalysisClassifyEnum.NEGATIVE, count: negativeAnalysis },
        ]
    }

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
        
        return Array.from(analysisMap.entries()).map(([name, data]) => ({
            name,
            count: data.count,
            classifications: Array.from(data.classifications.entries()).map(([type, count]) => ({
                type,
                count
            }))
        }));
    };

    const prepareSubAnalysisChartData = (subAnalysis: IDashboardSubAnalysis[]) => {
        // Sort by count and get top 3
        const sortedAnalysis = [...subAnalysis].sort((a, b) => b.count - a.count);
        const top3 = sortedAnalysis.slice(0, 3);
        const others = sortedAnalysis.slice(3);

        // Calculate totals for others by classification type
        const othersByType = others.reduce((acc, item) => {
            item.classifications.forEach(classification => {
                if (!acc[classification.type]) {
                    acc[classification.type] = 0;
                }
                acc[classification.type] += classification.count;
            });
            return acc;
        }, {} as Record<AnalysisClassifyEnum, number>);

        // Create labels array with top 3 and others
        const labels = [...top3.map(item => item.name), 'Others'];

        // Create datasets for each classification type
        const datasets = [
            {
                label: 'Positive',
                data: [
                    ...top3.map(item => 
                        item.classifications.find(c => c.type === AnalysisClassifyEnum.POSITIVE)?.count || 0.1
                    ),
                    othersByType[AnalysisClassifyEnum.POSITIVE] || 0.1
                ],
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'Neutral',
                data: [
                    ...top3.map(item => 
                        item.classifications.find(c => c.type === AnalysisClassifyEnum.NEUTRAL)?.count || 0.1
                    ),
                    othersByType[AnalysisClassifyEnum.NEUTRAL] || 0.1
                ],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'Negative',
                data: [
                    ...top3.map(item => 
                        item.classifications.find(c => c.type === AnalysisClassifyEnum.NEGATIVE)?.count || 0.1
                    ),
                    othersByType[AnalysisClassifyEnum.NEGATIVE] || 0.1
                ],
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1,
                borderRadius: 4,
            }
        ];

        return {
            labels,
            datasets,
        };
    };

    const getAreaChartData = () => {
        // Sort sub-analyses by total count
        const sortedAnalysis = [...allSubAnalysis].sort((a, b) => {
            const totalA = a.classifications.reduce((sum, c) => sum + c.count, 0);
            const totalB = b.classifications.reduce((sum, c) => sum + c.count, 0);
            return totalB - totalA;
        });

        // Get top 5 sub-analyses
        const top5 = sortedAnalysis.slice(0, 5);

        // Transform data for the chart
        return top5.map(item => {
            // Get counts for each classification type
            const positive = item.classifications.find(c => c.type === AnalysisClassifyEnum.POSITIVE)?.count || 0;
            const neutral = item.classifications.find(c => c.type === AnalysisClassifyEnum.NEUTRAL)?.count || 0;
            const negative = item.classifications.find(c => c.type === AnalysisClassifyEnum.NEGATIVE)?.count || 0;

            // Calculate total for this item
            const total = positive + neutral + negative;

            // Debug log to check values
            // console.log('SubAnalysis:', item.name, {
            //     positive,
            //     neutral,
            //     negative,
            //     total,
            //     classifications: item.classifications
            // });

            return {
                name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
                positive,
                neutral,
                negative,
                total,
                // Add percentage calculations
                positivePercentage: total > 0 ? (positive / total) * 100 : 0,
                neutralPercentage: total > 0 ? (neutral / total) * 100 : 0,
                negativePercentage: total > 0 ? (negative / total) * 100 : 0
            };
        });
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-2 over:shadow-xl transition-all duration-300">
            {/* Statistics Row */}
            <div className="flex justify-between items-center mb-2">
                <motion.div 
                    className="flex items-center gap-2 bg-gray-700/30 backdrop-blur-sm p-1 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <BarChartIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">إجمالي رصد المنشورات</span>
                    <span className="text-sm font-semibold text-blue-400">{allAnalysis.length}</span>
                </motion.div>
                <motion.div 
                    className="flex items-center gap-2 bg-gray-700/30 backdrop-blur-sm p-2 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">إجمالي تفاعلات المنشورات</span>
                    <span className="text-sm font-semibold text-green-400">
                        {allAnalysis.reduce((acc, curr) => 
                            acc + (curr.statistics?.views || 0) + 
                            (curr.statistics?.shares || 0) + 
                            (curr.statistics?.reactions || 0) + 
                            (curr.statistics?.comments || 0) + 
                            (curr.statistics?.appearance || 0), 0
                        )}
                    </span>
                </motion.div>
            </div>

            {/* Charts Row */}
            <div className="w-full">
                {/* Classification Trend Chart */}
                <div className="bg-gray-700/30 backdrop-blur-sm p-2 rounded-lg w-full">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <LineChart className="w-5 h-5 text-blue-400" />
                            اتجاه التحليلات
                        </h4>
                        <div className="flex gap-3">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-xs text-gray-400">إيجابي</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-xs text-gray-400">محايد</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <span className="text-xs text-gray-400">سلبي</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart 
                                data={getAreaChartData()}
                                margin={{ top: 10, right: 0, left: -30, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#9CA3AF"
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    axisLine={{ stroke: '#4B5563' }}
                                    tickLine={{ stroke: '#4B5563' }}
                                    padding={{ left: 0, right: 0 }}
                                />
                                <YAxis 
                                    stroke="#9CA3AF"
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    axisLine={{ stroke: '#4B5563' }}
                                    tickLine={{ stroke: '#4B5563' }}
                                    padding={{ top: 10, bottom: 10 }}
                                    tickMargin={24}
                                    orientation="left"
                                />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                    labelStyle={{ color: '#9CA3AF' }}
                                    formatter={(value: number, name: string) => {
                                        const data = getAreaChartData().find(d => d.name === name);
                                        if (!data) return [value, name];
                                        const percentage = name === 'positive' ? data.positivePercentage :
                                                         name === 'neutral' ? data.neutralPercentage :
                                                         data.negativePercentage;
                                        return [`${value} (${percentage.toFixed(1)}%)`, name];
                                    }}
                                />
                                <Area 
                                    type="monotone"
                                    dataKey="positive" 
                                    stackId="1" 
                                    stroke="#22c55e" 
                                    fill="url(#colorPositive)" 
                                    name="إيجابي"
                                />
                                <Area 
                                    type="monotone"
                                    dataKey="neutral" 
                                    stackId="1" 
                                    stroke="#3b82f6" 
                                    fill="url(#colorNeutral)" 
                                    name="محايد"
                                />
                                <Area 
                                    type="monotone"
                                    dataKey="negative" 
                                    stackId="1" 
                                    stroke="#ef4444" 
                                    fill="url(#colorNegative)" 
                                    name="سلبي"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubAnalysisCharts;