'use client'

import { useSocket } from "@/hooks/useSocket";
import { IAnalysis } from "@/interfaces/analysis.types";
import { INews } from "@/interfaces/news.types";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import ClassificationSection from "./sections/ClassificationSection";
import ImportantAnalysisSection from "./sections/ImportantAnalysisSection";
import LiveAnalysisSection from "./sections/LiveAnalysisSection";
import MapSection from "./sections/MapSection";
import SubAnalysisSection from "./sections/SubAnalysisSection";
import PlatformsSections from "./sections/PlatformsSection";
import SubAnalysisCharts from "./sections/SubAnalysisCharts";
import SectorsSection from "./sections/SectorsSection";
import PublishersSection from "./sections/PublishersSection";
import SocialMediaIcon from "@/components/icons/sidebar/SocialMedia";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadialBarChart, RadialBar, PolarGrid, PolarRadiusAxis, Label } from "recharts";
import { TrendingUp } from "lucide-react";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const DashboardLayout = () => {

    const { socket, isConnected } = useSocket();
    const [allAnalysis, setAllAnalysis] = useState<IAnalysis[]>([]); 
    const [allNews, setAllNews] = useState<INews[]>([]); 

    const [error, setError] = useState<string | null>(null);

    // Add refs to track animation positions
    const [isMounted, setIsMounted] = useState(false);
  
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if(!socket || !isConnected) {
            return;
        }

        const handleError = (error: any) => {
            console.error('Socket error:', error);
            setError(error.message || 'An error occurred');
        };

        socket.on('error', handleError);
        socket.on('allAnalysis', (analysisData: IAnalysis[]) => {
            setAllAnalysis(analysisData);
            setError(null);
        });

        socket.on('allNews', (newsData: INews[]) => {
            console.log("newsData: ", newsData)
            setAllNews(newsData);
            setError(null);
        });

        socket.emit('getAllAnalysis')
        socket.emit('getAllNews')

        return () => {
            socket.off('error');
            socket.off('allAnalysis');
            socket.off('allNews');
        };
    }, [socket, isConnected])
    
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    // Function to duplicate items for seamless loop
    const createInfiniteItems = (items: any[]) => {
        // Create multiple copies to ensure smooth infinite loop
        return [...items, ...items, ...items, ...items];
    };

    // const prepareAnalysisTrendData = (analysisData: IAnalysis[]) => {
    //     // Get the date range
    //     const dates = analysisData.map(a => new Date(a.createdAt));
    //     const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
    //     const endDate = new Date(Math.max(...dates.map(d => d.getTime())));
    //     const now = new Date();

    //     // Calculate time difference in milliseconds
    //     const timeDiff = now.getTime() - startDate.getTime();
    //     const oneDay = 24 * 60 * 60 * 1000;
    //     const oneWeek = 7 * oneDay;
    //     const oneMonth = 30 * oneDay;
    //     const oneYear = 365 * oneDay;

    //     let labels: string[] = [];
    //     let dateFormat: Intl.DateTimeFormatOptions = {};

    //     // Determine time interval based on the date range
    //     if (timeDiff <= oneDay) {
    //         // If less than a day, show hours
    //         const hours = Math.ceil(timeDiff / (60 * 60 * 1000));
    //         labels = Array.from({ length: hours }, (_, i) => {
    //             const date = new Date(now.getTime() - (hours - i) * 60 * 60 * 1000);
    //             return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    //         });
    //         dateFormat = { hour: '2-digit', minute: '2-digit' };
    //     } else if (timeDiff <= oneWeek) {
    //         // If less than a week, show days
    //         const days = Math.ceil(timeDiff / oneDay);
    //         labels = Array.from({ length: days }, (_, i) => {
    //             const date = new Date(now.getTime() - (days - i) * oneDay);
    //             return date.toLocaleDateString('ar-SA', { weekday: 'short' });
    //         });
    //         dateFormat = { weekday: 'short' };
    //     } else if (timeDiff <= oneMonth) {
    //         // If less than a month, show weeks
    //         const weeks = Math.ceil(timeDiff / oneWeek);
    //         labels = Array.from({ length: weeks }, (_, i) => {
    //             const date = new Date(now.getTime() - (weeks - i) * oneWeek);
    //             return `الأسبوع ${i + 1}`;
    //         });
    //         dateFormat = {};
    //     } else if (timeDiff <= oneYear) {
    //         // If less than a year, show months
    //         const months = Math.ceil(timeDiff / oneMonth);
    //         labels = Array.from({ length: months }, (_, i) => {
    //             const date = new Date(now.getTime() - (months - i) * oneMonth);
    //             return date.toLocaleDateString('ar-SA', { month: 'long' });
    //         });
    //         dateFormat = { month: 'long' };
    //     } else {
    //         // If more than a year, show years
    //         const years = Math.ceil(timeDiff / oneYear);
    //         labels = Array.from({ length: years }, (_, i) => {
    //             const date = new Date(now.getTime() - (years - i) * oneYear);
    //             return date.toLocaleDateString('ar-SA', { year: 'numeric' });
    //         });
    //         dateFormat = { year: 'numeric' };
    //     }

    //     // Prepare datasets for each classification
    //     const datasets = [
    //         {
    //             label: 'إيجابي',
    //             data: labels.map((_, index) => {
    //                 const date = new Date(now.getTime() - (labels.length - index - 1) * getTimeInterval(timeDiff));
    //                 return analysisData.filter(a => {
    //                     const analysisDate = new Date(a.createdAt);
    //                     return isWithinInterval(analysisDate, date, timeDiff) && 
    //                            a.classify === AnalysisClassifyEnum.POSITIVE;
    //                 }).length;
    //             }),
    //             borderColor: 'rgb(34, 197, 94)',
    //             backgroundColor: 'rgba(34, 197, 94, 0.1)',
    //             tension: 0.4,
    //             fill: true,
    //             pointBackgroundColor: 'rgb(34, 197, 94)',
    //             pointBorderColor: '#fff',
    //             pointBorderWidth: 2,
    //             pointRadius: 4,
    //             pointHoverRadius: 6
    //         },
    //         {
    //             label: 'محايد',
    //             data: labels.map((_, index) => {
    //                 const date = new Date(now.getTime() - (labels.length - index - 1) * getTimeInterval(timeDiff));
    //                 return analysisData.filter(a => {
    //                     const analysisDate = new Date(a.createdAt);
    //                     return isWithinInterval(analysisDate, date, timeDiff) && 
    //                            a.classify === AnalysisClassifyEnum.NEUTRAL;
    //                 }).length;
    //             }),
    //             borderColor: 'rgb(59, 130, 246)',
    //             backgroundColor: 'rgba(59, 130, 246, 0.1)',
    //             tension: 0.4,
    //             fill: true,
    //             pointBackgroundColor: 'rgb(59, 130, 246)',
    //             pointBorderColor: '#fff',
    //             pointBorderWidth: 2,
    //             pointRadius: 4,
    //             pointHoverRadius: 6
    //         },
    //         {
    //             label: 'سلبي',
    //             data: labels.map((_, index) => {
    //                 const date = new Date(now.getTime() - (labels.length - index - 1) * getTimeInterval(timeDiff));
    //                 return analysisData.filter(a => {
    //                     const analysisDate = new Date(a.createdAt);
    //                     return isWithinInterval(analysisDate, date, timeDiff) && 
    //                            a.classify === AnalysisClassifyEnum.NEGATIVE;
    //                 }).length;
    //             }),
    //             borderColor: 'rgb(239, 68, 68)',
    //             backgroundColor: 'rgba(239, 68, 68, 0.1)',
    //             tension: 0.4,
    //             fill: true,
    //             pointBackgroundColor: 'rgb(239, 68, 68)',
    //             pointBorderColor: '#fff',
    //             pointBorderWidth: 2,
    //             pointRadius: 4,
    //             pointHoverRadius: 6
    //         }
    //     ];

    //     return { labels, datasets };
    // };

    // Helper function to get time interval in milliseconds
    
    const getTimeInterval = (timeDiff: number): number => {
        const oneDay = 24 * 60 * 60 * 1000;
        const oneWeek = 7 * oneDay;
        const oneMonth = 30 * oneDay;
        const oneYear = 365 * oneDay;

        if (timeDiff <= oneDay) return 60 * 60 * 1000; // 1 hour
        if (timeDiff <= oneWeek) return oneDay; // 1 day
        if (timeDiff <= oneMonth) return oneWeek; // 1 week
        if (timeDiff <= oneYear) return oneMonth; // 1 month
        return oneYear; // 1 year
    };

    // Helper function to check if a date is within the current interval
    const isWithinInterval = (date: Date, intervalStart: Date, timeDiff: number): boolean => {
        const interval = getTimeInterval(timeDiff);
        const intervalEnd = new Date(intervalStart.getTime() + interval);
        return date >= intervalStart && date < intervalEnd;
    };
    

    const totalAllNews = allNews.length
    const totalAllAnalysis = allAnalysis.length
    const totalContent = totalAllAnalysis + totalAllNews
    
    const radius = 55
    const circumference = 2 * Math.PI * radius
    
    const newsPercentage = totalAllNews / totalContent
    const analysisPercentage = totalAllAnalysis / totalContent
    
    const newsStrokeDashoffset = circumference * (1 - newsPercentage)
    const analysisStrokeDashoffset = circumference * (1 - analysisPercentage)


    return (
        <div className="w-full h-screen bg-gray-900 p-4 overflow-y-auto overflow-x-hidden">
            {error && (
                <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    {error}
                </div>
            )}
            {!isConnected && (
                <div className="fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    Connecting to server...
                </div>
            )}
            {isMounted && (
                <motion.div 
                    className="flex flex-col h-full gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="grid grid-cols-4 gap-2 h-full">
                        {/* Side #1 */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col gap-1 h-full"
                        >
                            {/* Section 1.1 Classifications Section */}
                            <ClassificationSection allAnalysis={allAnalysis} allNews={allNews} key={1}/>

                            {/* Section 1.2 Important Analysis Section */}
                            <ImportantAnalysisSection allAnalysis={allAnalysis}/>

                            {/* Section 1.3 Analysis Section */}
                            <LiveAnalysisSection allAnalysis={allAnalysis} />
                        </motion.div>

                        {/* Side #2 */}
                        <motion.div
                            variants={itemVariants}
                            className="col-span-2 flex flex-col gap-2 h-full"
                        >
                            {/* Section 2.1 Map and News/Social */}
                            <div className="flex flex-row gap-1 h-1/3">
                                {/* Map Track */}
                                <MapSection allAnalysis={allAnalysis} />

                                {/* News/Social Section */}
                                <div className="w-1/5">
                                    {/* <Card className="flex flex-col bg-gray-800/50 backdrop-blur-sm border-gray-700/50 h-full">
                                        <CardHeader className="items-center pb-2">
                                            <CardTitle className="text-sm">إحصائيات المحتوى</CardTitle>
                                            <CardDescription>آخر تحديث</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col justify-center gap-4"> */}
                                            {/* Social Media Radial Chart */}
                                            
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
                                            {/* News Radial Chart */}
                                            {/* <div className="flex items-center gap-4">
                                                <div className="w-24 h-24">
                                                    <ChartContainer
                                                        config={{
                                                            news: {
                                                                label: "News",
                                                                color: "var(--orange-500)",
                                                            },
                                                        }}
                                                        className="mx-auto aspect-square"
                                                    >
                                                        <RadialBarChart
                                                            data={[{ name: 'News', value: allNews.length }]}
                                                            startAngle={0}
                                                            endAngle={250}
                                                            innerRadius={25}
                                                            outerRadius={40}
                                                        >
                                                            <PolarGrid
                                                                gridType="circle"
                                                                radialLines={false}
                                                                stroke="none"
                                                                className="first:fill-muted last:fill-background"
                                                                polarRadius={[30, 35]}
                                                            />
                                                            <RadialBar 
                                                                dataKey="value" 
                                                                background 
                                                                cornerRadius={10}
                                                                fill="#f97316"
                                                            />
                                                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                                                <Label
                                                                    content={({ viewBox }) => {
                                                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                                            return (
                                                                                <text
                                                                                    x={viewBox.cx}
                                                                                    y={viewBox.cy}
                                                                                    textAnchor="middle"
                                                                                    dominantBaseline="middle"
                                                                                >
                                                                                    <tspan
                                                                                        x={viewBox.cx}
                                                                                        y={viewBox.cy}
                                                                                        className="fill-orange-500 text-lg font-bold"
                                                                                    >
                                                                                        {allNews.length}
                                                                                    </tspan>
                                                                                    <tspan
                                                                                        x={viewBox.cx}
                                                                                        y={(viewBox.cy || 0) + 16}
                                                                                        className="fill-gray-400 text-xs"
                                                                                    >
                                                                                        خبر
                                                                                    </tspan>
                                                                                </text>
                                                                            )
                                                                        }
                                                                    }}
                                                                />
                                                            </PolarRadiusAxis>
                                                        </RadialBarChart>
                                                    </ChartContainer>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-300">الأخبار</span>
                                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                                        <TrendingUp className="w-3 h-3 text-orange-500" />
                                                        <span>آخر تحديث</span>
                                                    </div>
                                                </div>
                                            </div> */}
                                        {/* </CardContent>
                                    </Card> */}
                                </div>
                            </div>

                            {/* Section 2.2 SubAnalysis Data & Platforms */}
                            <div className="flex items-center gap-1 bg-gray-900/50 backdrop-blur-sm flex-1">
                                {/* Section 2.2.1 Platforms Section */}
                                <PlatformsSections allAnalysis={allAnalysis} />

                                {/* Section 2.2.2 SubAnalysis Section */}
                                <SubAnalysisSection allAnalysis={allAnalysis} />
                            </div>

                            {/* Section 2.3 New Statistics and Charts Section */}
                            <SubAnalysisCharts allAnalysis={allAnalysis}/>
                        </motion.div>

                        {/* Side #3 */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col gap-2 h-full"
                        >
                            {/* Section 3.1 Sectors Data */}
                            <SectorsSection allAnalysis={allAnalysis} />

                            {/* Section 3.2 Publishers Data */}
                            <PublishersSection allAnalysis={allAnalysis} />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default DashboardLayout;
  