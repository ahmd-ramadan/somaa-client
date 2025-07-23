'use client'

import { useSocket } from "@/hooks/useSocket";
import { IAnalysis } from "@/interfaces/analysis.types";
import { INews } from "@/interfaces/news.types";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import ClassificationSection from "./sections/ClassificationSection";
import ImportantAnalysisSection from "./sections/ImportantAnalysisSection";
import LiveAnalysisSection from "./sections/LiveAnalysisSection";
import MapSection from "./sections/MapSection";
import PlatformsSections from "./sections/PlatformsSection";
import SubAnalysisCharts from "./sections/SubAnalysisCharts";
import SectorsSection from "./sections/SectorsSection";
import PublishersSection from "./sections/PublishersSection";
import TwoBadgesSection from "./sections/TowBadgesSection";
import { Maximize2, Minimize2 } from "lucide-react";
import SubAnalysisAndSectorsSection from "./sections/SubAnalysisAndSectorsSection";
import { toZonedTime, format } from 'date-fns-tz'
import { useTranslations } from "next-intl";

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

const timeZone = 'Asia/Riyadh';

const DashboardLayout = () => {

    const t = useTranslations("DashboardPage")
    const { socket, isConnected } = useSocket();
    const [allAnalysis, setAllAnalysis] = useState<IAnalysis[]>([]); 
    const [allNews, setAllNews] = useState<INews[]>([]); 

    const [error, setError] = useState<string | null>(null);

    // Add refs to track animation positions
    const [isMounted, setIsMounted] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if(startDate || endDate) { return }

        // console.log(startDate, "Start ....", endDate)

        // Set default values: from = today 00:00, to = now
        const now = new Date();

        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        
        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);
        
        const startInKSA = toZonedTime(startOfToday, timeZone);
        const endInKSA = toZonedTime(endOfToday, timeZone);
        
        const formatDate = (date: Date) => format(date, 'yyyy-MM-dd\'T\'HH:mm', { timeZone });
        
        setStartDate(formatDate(startInKSA));
        setEndDate(formatDate(endInKSA));

        // console.log(startDate, " *** ", endDate)
    }, [isMounted]);

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
            // console.log("newsData: ", newsData)
            setAllNews(newsData);
            setError(null);
        });

        socket.emit('getAllAnalysis', { startDate: new Date(startDate), endDate: new Date(endDate) })
        socket.emit('getAllNews', { startDate: new Date(startDate), endDate: new Date(endDate) })

        return () => {
            socket.off('error');
            socket.off('allAnalysis');
            socket.off('allNews');
        };
    }, [socket, isConnected])
    
    useEffect(() => {
        return () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        };
    }, []);

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

    const handleToggleFullscreen = () => {
        if (!document.fullscreenElement) {
            dashboardRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // console.log("Date ", startDate, endDate)
    
    return (
        <div
            ref={dashboardRef}
            className="w-full h-screen bg-gray-900 p-4 overflow-y-auto overflow-x-hidden"
        >
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
                            {/* Date Input */}
                            <div className="flex items-center gap-1 mb-1">
                                <label className="text-[10px] text-gray-400 flex items-center gap-0.5 whitespace-nowrap">
                                    {t("from")}
                                </label>
                                <input
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value.slice(0, 16))}
                                    className="bg-gray-800 text-gray-200 rounded px-1 py-0.5 border border-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition outline-none w-32 text-xs"
                                />
                                <label className="text-[10px] text-gray-400 flex items-center gap-0.5 whitespace-nowrap">
                                    {t("to")}
                                </label>
                                <input
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value.slice(0, 16))}
                                    className="bg-gray-800 text-gray-200 rounded px-1 py-0.5 border border-gray-700 focus:ring-1 focus:ring-green-500 focus:border-green-500 transition outline-none w-32 text-xs"
                                />
                                <button
                                    onClick={() => {
                                        if (socket && isConnected && startDate && endDate) {
                                            socket.emit('getAllAnalysis', { startDate: new Date(startDate), endDate: new Date(endDate) });
                                            socket.emit('getAllNews', { startDate: new Date(startDate), endDate: new Date(endDate) });
                                        }
                                    }}
                                    className="flex-1 bg-gradient-to-r from-primary to-green-500 text-white px-2 py-0.5 rounded shadow hover:from-blue-700 hover:to-green-600 transition font-semibold text-xs whitespace-nowrap"
                                    // className="flex-1 bg-gray-700 text-white px-2 py-0.5 rounded shadow hover:from-blue-700 hover:to-green-600 transition font-semibold text-xs whitespace-nowrap"
                                >
                                    {t("updateTime")}
                                </button>
                            </div>

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
                            <div className="flex flex-row gap-1 flex-1">
                                {/* Map Track */}
                                <MapSection allAnalysis={allAnalysis} />

                                <PublishersSection allAnalysis={allAnalysis} />
                            </div>

                            {/* Section 2.2 SubAnalysis & Sectors Data */}
                            <SubAnalysisAndSectorsSection allAnalysis={allAnalysis} allNews={allNews}/>

                            {/* Section 2.3 New Statistics and Charts Section */}
                            <div className="h-1/3">
                                <SubAnalysisCharts allAnalysis={allAnalysis}/>
                            </div>
                        </motion.div>

                        {/* Side #3 */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col gap-2 h-full"
                        >
                            <ClassificationSection allAnalysis={allAnalysis} allNews={allNews} />
                            
                            {/* Section 3.1 Sectors Data */}
                            <SectorsSection allAnalysis={allAnalysis} allNews={allNews}/>

                        </motion.div>
                    </div>
                    <button
                        onClick={handleToggleFullscreen}
                        className="absolute top-2 end-2 z-50 bg-gray-800/30 hover:bg-gray-800/80 p-1 rounded transition"
                        title={isFullscreen ? "خروج من ملء الشاشة" : "ملء الشاشة"}
                    >
                        {isFullscreen ? <Minimize2 className="w-5 h-5 text-white" /> : <Maximize2 className="w-5 h-5 text-white" />}
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default DashboardLayout;
  