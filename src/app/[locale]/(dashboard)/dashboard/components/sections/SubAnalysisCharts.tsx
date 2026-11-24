'use client'

import { AnalysisClassifyEnum, IAnalysis } from "@/interfaces/analysis.types";
import { motion } from "framer-motion";
import { BarChart as BarChartIcon, TrendingUp, Smile } from "lucide-react";
import { IDashboardSubAnalysis } from "./types";
import { useCallback, useEffect, useState } from "react";
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LabelList
} from 'recharts';
import { getTotalStatistics } from "@/utils/numbers";
import html2canvas from "html2canvas";
import { useTranslations } from "next-intl";

interface ISubAnalysischarts {
    allAnalysis: IAnalysis[]
}

const SubAnalysisCharts = ({ allAnalysis }: ISubAnalysischarts) => {

    const t = useTranslations("DashboardPage")
    const [maxClassificationsType, setMaxClassificationsType] = useState<AnalysisClassifyEnum>(AnalysisClassifyEnum.POSITIVE)
    const [allSubAnalysis, setAllSubAnalysis] = useState<IDashboardSubAnalysis[]>([])
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if(allAnalysis) {
            setMaxClassificationsType(deriveClassifications(allAnalysis));
            setAllSubAnalysis(deriveSubAnalysis(allAnalysis))
        }
    }, [allAnalysis])

    const deriveClassifications =  useCallback((analysisData: IAnalysis[]): AnalysisClassifyEnum => {
        const positiveAnalysis = analysisData.filter(a => a.classify === AnalysisClassifyEnum.POSITIVE).length
        const nuetralAnalysis = analysisData.filter(a => a.classify === AnalysisClassifyEnum.NEUTRAL).length
        const negativeAnalysis = analysisData.filter(a => a.classify === AnalysisClassifyEnum.NEGATIVE).length

        if(positiveAnalysis >= negativeAnalysis && positiveAnalysis >= nuetralAnalysis) return AnalysisClassifyEnum.POSITIVE
        if(nuetralAnalysis >= negativeAnalysis && nuetralAnalysis >= positiveAnalysis) return AnalysisClassifyEnum.NEUTRAL
        if(negativeAnalysis >= nuetralAnalysis && negativeAnalysis >= positiveAnalysis) return AnalysisClassifyEnum.NEGATIVE
        return AnalysisClassifyEnum.POSITIVE
    }, [allAnalysis]);

    const deriveSubAnalysis = useCallback((analysisData: IAnalysis[]): any[] => {
        const analysisMap = new Map<string, { count: number, classifications: Map<AnalysisClassifyEnum, number> }>();
        
        analysisData.forEach(analysis => {
            const name = analysis.subAnalysisData.body;
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
    }, [allAnalysis]);

    const getAreaChartData = useCallback(() => {
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

            // Truncate name for chart, but keep full name for tooltip
            const shortName = item.name.length > 16 ? item.name.substring(0, 16) + '…' : item.name;

            return {
                name: shortName,
                fullName: item.name,
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
    }, [allSubAnalysis]);

    // Custom Tooltip for enhanced visuals
    const CustomTooltip = useCallback(({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            // Find the full name and total from the data
            const data = getAreaChartData().find(d => d.name === label);
            return (
                <div className="rounded-lg shadow-lg p-3 bg-gray-900/90 border border-gray-700/60 min-w-[120px] animate-fade-in">
                    <div className="font-semibold text-blue-300 mb-1" style={{ fontSize: data && data.fullName.length > 16 ? '0.85rem' : undefined }} title={data?.fullName}>
                        {data?.fullName || label}
                    </div>
                    {data && (
                        <div className="text-xs text-gray-400 mb-2">{t("analysisNumbers")}: <span className="font-bold text-white">{data.total}</span></div>
                    )}
                    {payload.map((entry: any, idx: number) => {
                        let arabicLabel = t(entry.dataKey);
                        return (
                            <div key={idx} className="flex items-center gap-2 mb-1 last:mb-0">
                                <span className={`inline-block w-3 h-3 rounded-full`} style={{ background: entry.color }}></span>
                                <span className="text-xs text-gray-200">{arabicLabel}:</span>
                                <span className="text-xs font-bold" style={{ color: entry.dataKey === 'neutral' ? '#9CA3AF' : entry.color }}>{entry.value}</span>
                                <span className="text-xs text-gray-400">({entry.payload[`${entry.dataKey}Percentage`]?.toFixed(1)}%)</span>
                            </div>
                        );
                    })}
                </div>
            );
        }
        return null;
    }, [allSubAnalysis]);

    // Animated dot
    const AnimatedDot = useCallback((props: any) => {
        const { cx, cy, stroke, key, value, onMouseOver, onMouseOut } = props;
        return (
            <circle
                key={key}
                cx={cx}
                cy={cy}
                r={6}
                fill="#fff"
                stroke={stroke}
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 0 6px ' + stroke + '33)' }}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
            />
        );
    }, []);

    // Responsive/collapsible legend
    const CustomLegend = useCallback(
        (props: any) => {
            const { payload } = props;
            // Responsive: collapse on small screens
            return (
                <div className="flex gap-3 flex-wrap justify-end items-center text-xs pb-2">
                    {payload.map((entry: any, idx: number) => {
                        let arabicLabel = t(entry.value);
                        return (
                            <div key={idx} className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full block" style={{ background: entry.color }}></span>
                                <span className={
                                    arabicLabel === t('positive') ? 'text-green-400' :
                                    arabicLabel === t('negative') ? 'text-red-400' :
                                    'text-gray-400'
                                }>
                                    {arabicLabel}
                                </span>
                            </div>
                        );
                    })}
                </div>
            );
    }, []);

    // Subtle SVG background pattern
    const ChartBackgroundPattern = useCallback(
        () => (
            <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none" style={{zIndex:0}}>
                <defs>
                    <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="1.5" fill="#374151" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pattern-circles)" />
            </svg>
    ), []);

    // Download chart as image
    const downloadChartAsImage = useCallback(
        async () => {
            setDownloading(true);
            const chartNode = document.getElementById('enhanced-area-chart');
            if (chartNode) {
                const canvas = await html2canvas(chartNode, {});
                const link = document.createElement('a');
                link.download = 'chart.png';
                link.href = canvas.toDataURL();
                link.click();
            }
            setDownloading(false);
        }, []
    );

    return (
        <div className="min-w-full overflow-x-auto flex-1 backdrop-blur-sm rounded-lg bg-transparent/20 border border-gray-700/50 p-1 over:shadow-xl transition-all duration-300">
            {/* Statistics Row */}
            {/*<div className="flex justify-between items-center mb-1">
                <motion.div 
                    className="flex items-center gap-2 bg-gray-700/30 backdrop-blur-sm p-1 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <BarChartIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">{t("totalMonitoring")}</span>
                    <span className="text-sm font-semibold text-gray-300">{allAnalysis.length}</span>
                </motion.div>
                
                <motion.div 
                    className={`flex items-center gap-1 bg-gray-700/30 backdrop-blur-sm p-1 rounded-lg 
                        ${maxClassificationsType === AnalysisClassifyEnum.POSITIVE ? 'text-green-400' : maxClassificationsType === AnalysisClassifyEnum.NEUTRAL ? 'text-gray-400' : 'text-red-400'}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <TrendingUp className={`w-4 h-4`}/>
                    <span className="text-sm text-gray-300">{t("totalStatistics")}</span>
                    <span className={`text-sm`}>
                        {allAnalysis.reduce((acc, curr) => (
                            acc + getTotalStatistics(curr?.statistics)
                        ), 0).toLocaleString()}
                    </span>
                </motion.div>
                
                <motion.div 
                    className={`flex items-center gap-1 bg-gray-700/30 backdrop-blur-sm p-1 rounded-lg`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <button
                        onClick={downloadChartAsImage}
                        className="px-3 py-1 rounded bg-blue-700/80 hover:bg-blue-800 text-white text-xs shadow transition flex items-center gap-2 min-w-[80px] justify-center"
                        disabled={downloading}
                    >
                        {downloading ? (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        ) : t("uploadImage")}
                    </button>
                </motion.div>
            </div>*/}

            {/* Charts Row */}
            <div className="w-full">
                {/* Chart Card with animated entrance and background pattern */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="relative bg-gray-700/30 backdrop-blur-sm p-2 rounded-lg w-full overflow-hidden"
                    id="enhanced-area-chart"
                    style={{ zIndex: 1 }}
                >
                    <ChartBackgroundPattern />
                    {/* Empty State */}
                    {getAreaChartData().length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
                            <Smile className="w-10 h-10 mb-2 text-blue-400" />
                            <span>{t("noDataToShow")}</span>
                        </div>
                    ) : (
                        <>
                            {/* <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <LineChart className="w-5 h-5 text-blue-400" />
                                    اتجاه التحليلات
                                </h4>
                            </div> */}
                            <div className="h-[220px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart 
                                        data={getAreaChartData()}
                                        margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.7}/>
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                                            </linearGradient>
                                            <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.7}/>
                                                <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0.1}/>
                                            </linearGradient>
                                            <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.7}/>
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                                            </linearGradient>
                                            {/* Glow filter for highlight */}
                                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur"/>
                                                    <feMergeNode in="SourceGraphic"/>
                                                </feMerge>
                                            </filter>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis 
                                            dataKey="name" 
                                            stroke="#9CA3AF"
                                            tick={({ x, y, payload }) => (
                                                <g transform={`translate(${x},${y})`}>
                                                    <title>{getAreaChartData().find(d => d.name === payload.value)?.fullName || payload.value}</title>
                                                    <text x={0} y={0} dy={16} textAnchor="middle" fill="#9CA3AF" fontSize={12} style={{ cursor: 'pointer' }}>
                                                        {payload.value}
                                                    </text>
                                                </g>
                                            )}
                                            axisLine={{ stroke: '#d1d5db' }}
                                            tickLine={{ stroke: '#d1d5db' }}
                                            padding={{ left: 10, right: 10 }}
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
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend content={<CustomLegend />} />
                                        <Area 
                                            type="monotone"
                                            dataKey="positive" 
                                            stackId="1" 
                                            stroke="#22c55e" 
                                            fill="url(#colorPositive)" 
                                            name="positive"
                                            isAnimationActive={true}
                                            animationDuration={1200}
                                            strokeWidth={3}
                                            dot={<AnimatedDot stroke="#22c55e" />}
                                            activeDot={{ r: 9, style: { filter: 'url(#glow)' } }}
                                        >
                                            <LabelList dataKey="positive" position="top" fill="#22c55e" fontSize={11} formatter={(v: number) => v > 0 ? v : ''} />
                                        </Area>
                                        <Area 
                                            type="monotone"
                                            dataKey="neutral" 
                                            stackId="1" 
                                            stroke="#9CA3AF" 
                                            fill="url(#colorNeutral)" 
                                            name="neutral"
                                            isAnimationActive={true}
                                            animationDuration={1200}
                                            strokeWidth={3}
                                            dot={<AnimatedDot stroke="#9CA3AF" />}
                                            activeDot={{ r: 9, style: { filter: 'url(#glow)' } }}
                                        >
                                            <LabelList dataKey="neutral" position="top" fill="#9CA3AF" fontSize={11} formatter={(v: number) => v > 0 ? v : ''} />
                                        </Area>
                                        <Area 
                                            type="monotone"
                                            dataKey="negative" 
                                            stackId="1" 
                                            stroke="#ef4444" 
                                            fill="url(#colorNegative)" 
                                            name="negative"
                                            isAnimationActive={true}
                                            animationDuration={1200}
                                            strokeWidth={3}
                                            dot={<AnimatedDot stroke="#ef4444" />}
                                            activeDot={{ r: 9, style: { filter: 'url(#glow)' } }}
                                        >
                                            <LabelList dataKey="negative" position="top" fill="#ef4444" fontSize={11} formatter={(v: number) => v > 0 ? v : ''} />
                                        </Area>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default SubAnalysisCharts;