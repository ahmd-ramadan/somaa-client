// 'use client'

// import { useSocket } from "@/hooks/useSocket";
// import { formatDistanceToNow } from 'date-fns';
// import { arSA, enUS } from 'date-fns/locale';


// import { AnalysisClassifyEnum, IAnalysis, PlatformsEnum } from "@/interfaces/analysis.types";
// import { INews } from "@/interfaces/news.types";
// import { motion, AnimatePresence } from "framer-motion";
// import { Bell, Play, Pause, BarChart, LineChart, MapPin, Users, TrendingUp, TrendingDown, Minus, ViewIcon, EyeIcon, Share, ShareIcon, Share2, Heart, MessageCircle, Facebook, Instagram, Linkedin, Youtube, Twitter, PieChart, Globe } from "lucide-react";
// import { useEffect, useState, useRef } from "react";
// import dynamic from 'next/dynamic';
// import { Bar, Doughnut, Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
// import { useLocale } from "next-intl";
// import Image from "next/image";

// // Register Chart.js components
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement,
//     PointElement,
//     LineElement
// );

// // Dynamically import the map component with no SSR
// const MapWithNoSSR = dynamic(
//     () => import('./sections/MapComponent').then((mod) => mod.default),
//     {
//         ssr: false,
//         loading: () => (
//             <div className="aspect-video bg-gray-800 rounded-lg flex-grow flex items-center justify-center text-gray-400">
//                 Loading map...
//             </div>
//         ),
//     }
// );

// export interface IDashboardClassify {
//     type: AnalysisClassifyEnum,
//     count: number
// }
// export const DashboardClassificationsDefault: IDashboardClassify[] = [
//     { type: AnalysisClassifyEnum.POSITIVE, count: 0 },
//     { type: AnalysisClassifyEnum.NEUTRAL, count: 0 },
//     { type: AnalysisClassifyEnum.NEGATIVE, count: 0 },
// ]

// export interface IDashboardSubAnalysis {
//     name: string,
//     count: number,
//     classifications: IDashboardClassify[]
// }

// export interface IDashboardSector {
//     name: string,
//     total: number,
//     classifications: IDashboardClassify[]
// }

// export interface IDashboardPublisher {
//     name: string,
//     avatar?: string,
//     total: number,
//     reactions: number,
//     comments: number,
//     shares: number,
//     appearance: number,
//     views: number
//     // classifications: IDashboardClassify[]
// }

// export interface IDashboardPlatform {
//     platform: PlatformsEnum,
//     total: number,
//     // classifications: IDashboardClassify[]
// }

// const DashboardLayout = () => {

//     const locale = useLocale()
    
//     const { socket, isConnected } = useSocket();
//     const [allAnalysis, setAllAnalysis] = useState<IAnalysis[]>([]); 
//     const [allNews, setAllNews] = useState<INews[]>([]); 
//     const [allCalssifications, setAllcassifications] = useState<IDashboardClassify[]>(DashboardClassificationsDefault)
//     const [importantAnalysis, setImportantAnalysis] = useState<IAnalysis[]>([])
//     const [lastAnalysisLocation, setLastAnalysisLocation] = useState<any>(null)
//     const [allSubAnalysis, setAllSubAnalysis] = useState<IDashboardSubAnalysis[]>([])
//     const [allSectors, setAllSectors] = useState<IDashboardSector[]>([])
//     const [allPublishers, setAllPublishers] = useState<IDashboardPublisher[]>([])
//     const [allPlatforms, setAllPlatforms] = useState<IDashboardPlatform[]>([])
//     const [error, setError] = useState<string | null>(null);

//     const [isImportantAnalysisAnimating, setIsImportantAnalysisAnimating] = useState(true);
//     const [isLiveAnalysisAnimating, setIsLiveAnalysisAnimating] = useState(true);
//     const [isMounted, setIsMounted] = useState(false);

//     const [mapCenter, setMapCenter] = useState<[number, number]>([31.9522, 35.9231]); // Default to Jordan

//     // Add refs to track animation positions
//     const importantTickerRef = useRef<HTMLDivElement>(null);
//     const liveTickerRef = useRef<HTMLDivElement>(null);
//     const [importantTickerPosition, setImportantTickerPosition] = useState(0);
//     const [liveTickerPosition, setLiveTickerPosition] = useState(0);

//     // Add new animation variants for the ticker
//     const createTickerVariants = (startPosition: number) => ({
//         animate: {
//             y: [startPosition, -1000],
//             transition: {
//                 duration: 20,
//                 repeat: Infinity,
//                 ease: "linear"
//             }
//         },
//         pause: {
//             y: startPosition,
//             transition: {
//                 duration: 0
//             }
//         }
//     });

//     // Add state for hover pause
//     const [isImportantTickerPaused, setIsImportantTickerPaused] = useState(false);
//     const [isLiveTickerPaused, setIsLiveTickerPaused] = useState(false);

//     // Update toggle functions to handle animation state
//     const toggleImportantAnalysisAnimation = () => {
//         if (importantTickerRef.current) {
//             const transform = window.getComputedStyle(importantTickerRef.current).transform;
//             const matrix = new DOMMatrix(transform);
//             const currentY = matrix.m42;
//             setImportantTickerPosition(currentY);
//         }
//         setIsImportantAnalysisAnimating(prev => !prev);
//     };

//     const toggleLiveAnalysisAnimation = () => {
//         if (liveTickerRef.current) {
//             const transform = window.getComputedStyle(liveTickerRef.current).transform;
//             const matrix = new DOMMatrix(transform);
//             const currentY = matrix.m42;
//             setLiveTickerPosition(currentY);
//         }
//         setIsLiveAnalysisAnimating(prev => !prev);
//     };

//     const liveAnalysisItemVariants = {
//         animate: {
//             opacity: 1,
//             x: 0,
//             scale: 1,
//             transition: {
//                 duration: 0.5,
//             }
//         },
//         initial: {
//             opacity: 0,
//             x: -20,
//             scale: 0.9,
//         },
//         pulse: {
//             scale: [1, 1.05, 1],
//             transition: {
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//             }
//         }
//     };

//     const [isSubAnalysisAnimating, setIsSubAnalysisAnimating] = useState(true);
//     const [isPlatformsAnimating, setIsPlatformsAnimating] = useState(true);
//     const [isPublishersAnimating, setIsPublishersAnimating] = useState(true);

//     const toggleSubAnalysisAnimation = () => {
//         setIsSubAnalysisAnimating(!isSubAnalysisAnimating);
//     };

//     const togglePlatformsAnimation = () => {
//         setIsPlatformsAnimating(!isPlatformsAnimating);
//     };

//     const togglePublishersAnimation = () => {
//         setIsPublishersAnimating(!isPublishersAnimating);
//     };

//     useEffect(() => {
//         setIsMounted(true);
//     }, []);

//     useEffect(() => {
//         if(!socket || !isConnected) {
//             return;
//         }

//         const handleError = (error: any) => {
//             console.error('Socket error:', error);
//             setError(error.message || 'An error occurred');
//         };

//         socket.on('error', handleError);
//         socket.on('allAnalysis', (analysisData: IAnalysis[]) => {
//             setAllAnalysis(analysisData);
//             setAllcassifications(deriveClassifications(analysisData));
//             setImportantAnalysis(deriveImportantAnalysis(analysisData));
//             setLastAnalysisLocation(deriveLastAnalysisLocation(analysisData));
//             setAllSubAnalysis(deriveSubAnalysis(analysisData));
//             setAllSectors(deriveSectors(analysisData));
//             setAllPublishers(derivePublishers(analysisData));
//             setAllPlatforms(derivePlatforms(analysisData));
//             setError(null);
//         });

//         socket.on('allNews', (newsData: INews[]) => {
//             console.log("newsData: ", newsData)
//             setAllNews(newsData);
//             setError(null);
//         });

//         socket.emit('getAllAnalysis')
//         socket.emit('getAllNews')

//         return () => {
//             socket.off('error');
//             socket.off('allAnalysis');
//             socket.off('allNews');
//         };
//     }, [socket, isConnected])
    
//     const deriveClassifications = (analysisData: IAnalysis[]): IDashboardClassify[] => {
//         const positiveAnalysis = analysisData.filter(a => a.classify === AnalysisClassifyEnum.POSITIVE).length
//         const nuetralAnalysis = analysisData.filter(a => a.classify === AnalysisClassifyEnum.NEUTRAL).length
//         const negativeAnalysis = analysisData.filter(a => a.classify === AnalysisClassifyEnum.NEGATIVE).length

//         return [
//             { type: AnalysisClassifyEnum.POSITIVE, count: positiveAnalysis },
//             { type: AnalysisClassifyEnum.NEUTRAL, count: nuetralAnalysis },
//             { type: AnalysisClassifyEnum.NEGATIVE, count: negativeAnalysis },
//         ]
//     }

//     const deriveImportantAnalysis = (analysisData: IAnalysis[]): IAnalysis[] => {
//         return analysisData.filter(a => a.isFlagged === true)
//     }

//     const deriveLastAnalysisLocation = (analysisData: IAnalysis[]): any => {
//         // Implementation needed
//         return null;
//     }

//     const deriveSubAnalysis = (analysisData: IAnalysis[]): IDashboardSubAnalysis[] => {
//         const analysisMap = new Map<string, { count: number, classifications: Map<AnalysisClassifyEnum, number> }>();
        
//         analysisData.forEach(analysis => {
//             const name = analysis.subAnalysis.body;
//             if (!name) return;
            
//             if (!analysisMap.has(name)) {
//                 analysisMap.set(name, { 
//                     count: 0,
//                     classifications: new Map<AnalysisClassifyEnum, number>()
//                 });
//             }
            
//             const current = analysisMap.get(name)!;
//             current.count++;
            
//             // Update classifications count
//             if (analysis.classify) {
//                 const currentCount = current.classifications.get(analysis.classify) || 0;
//                 current.classifications.set(analysis.classify, currentCount + 1);
//             }
//         });
        
//         return Array.from(analysisMap.entries()).map(([name, data]) => ({
//             name,
//             count: data.count,
//             classifications: Array.from(data.classifications.entries()).map(([type, count]) => ({
//                 type,
//                 count
//             }))
//         }));
//     };

//     const deriveSectors = (analysisData: IAnalysis[]): IDashboardSector[] => {
//         const sectorsMap = new Map<string, { total: number; classifications: IDashboardClassify[] }>();

//         for (const analysis of analysisData) {
//             const sectorName = analysis.sector.name;
//             const classification = analysis.classify;

//             if (!sectorsMap.has(sectorName)) {
//                 sectorsMap.set(sectorName, {
//                     total: 0,
//                     classifications: [
//                         { type: AnalysisClassifyEnum.POSITIVE, count: 0 },
//                         { type: AnalysisClassifyEnum.NEUTRAL, count: 0 },
//                         { type: AnalysisClassifyEnum.NEGATIVE, count: 0 },
//                     ],
//                 });
//             }

//             const sectorData = sectorsMap.get(sectorName)!;
//             sectorData.total++;

//             const classificationEntry = sectorData.classifications.find(
//                 (cls) => cls.type === classification
//             );

//             if (classificationEntry) {
//                 classificationEntry.count++;
//             }
//         }

//         return Array.from(sectorsMap.entries()).map(([name, data]) => ({
//             name,
//             total: data.total,
//             classifications: data.classifications,
//         }));
//     };

//     const derivePublishers = (analysisData: IAnalysis[]): IDashboardPublisher[] => {
//         const analysisMap = new Map<string, { total: number, avatar: string, shares: number, views: number, appearance: number, reactions: number, comments: number  }>();
//         for(const { publisher: { name, avatar }, statistics: { shares, views, appearance, reactions, comments }} of analysisData) {
//             const totalStatistics = shares + reactions + appearance + views + comments;
            
//             if(analysisMap.has(name)) {
//                 const publisherObject = analysisMap.get(name)!;
//                 analysisMap.set(name, { 
//                     total: publisherObject?.total + totalStatistics, 
//                     avatar, 
//                     comments: publisherObject?.comments + comments,
//                     appearance: publisherObject?.appearance + appearance,
//                     reactions: publisherObject?.reactions + reactions,
//                     shares: publisherObject?.shares + shares,
//                     views: publisherObject?.views + views
//                 })
//             } else {
//                 analysisMap.set(name, { total: totalStatistics, avatar, shares, views, appearance, reactions, comments })
//             }
//         } 
        
//         return Array.from(analysisMap.entries()).map(([name, { total, avatar, shares, views, appearance, reactions, comments }]) => ({ name, avatar, total, shares, views, appearance, reactions, comments }));
//     }

//     const derivePlatforms = (analysisData: IAnalysis[]): IDashboardPlatform[] => {
//         const analysisMap = new Map<PlatformsEnum, { total: number }>();
//         for(const { platform } of analysisData) {
//             if(analysisMap.has(platform)) {
//                 const platformObject = analysisMap.get(platform)!;
//                 analysisMap.set(platform, { total: platformObject?.total + 1 })
//             } else {
//                 analysisMap.set(platform, { total: 1 })
//             }
//         } 
        
//         return Array.from(analysisMap.entries()).map(([platform, { total }]) => ({ platform, total }));
//     }

//     const handleClassificationsBigColor = (sector: IDashboardSector) => {
//         const positiveCount = sector.classifications[0].count;
//         const nueturalCount = sector.classifications[1].count;
//         const negativeCount = sector.classifications[2].count;

//         const maxCount = Math.max(positiveCount, negativeCount, nueturalCount);

//         if(positiveCount === maxCount) return 'green-500' 
//         if(nueturalCount === maxCount) return 'blue-500'
//         if(negativeCount === maxCount) return 'red-500'
//     }

//     // Function to prepare data for the sector chart
//     const prepareSectorChartData = (sectors: IDashboardSector[]) => {
//         const labels = sectors.map(sector => sector.name);
//         const data = sectors.map(sector => sector.total);
//         const backgroundColors = sectors.map(sector => {
//             // Assign colors based on the dominant classification or total count
//             const dominantColor = handleClassificationsBigColor(sector);
//             if (dominantColor === 'green-500') return 'rgba(34, 197, 94, 0.8)'; // Tailwind green-500 with alpha
//             if (dominantColor === 'blue-500') return 'rgba(59, 130, 246, 0.8)'; // Tailwind blue-500 with alpha
//             if (dominantColor === 'red-500') return 'rgba(239, 68, 68, 0.8)';   // Tailwind red-500 with alpha
//             return 'rgba(156, 163, 175, 0.8)'; // Default gray-400 with alpha
//         });

//         return {
//             labels: labels,
//             datasets: [
//                 {
//                     label: 'Total Analysis',
//                     data: data,
//                     backgroundColor: backgroundColors,
//                     borderColor: backgroundColors.map(color => color.replace('0.8', '1')), // Solid border
//                     borderWidth: 1,
//                 },
//             ],
//         };
//     };

//     // Animation variants
//     const containerVariants = {
//         hidden: { opacity: 0 },
//         visible: {
//             opacity: 1,
//             transition: {
//                 staggerChildren: 0.1
//             }
//         }
//     };

//     const itemVariants = {
//         hidden: { y: 20, opacity: 0 },
//         visible: {
//             y: 0,
//             opacity: 1,
//             transition: {
//                 duration: 0.5
//             }
//         }
//     };

//     // Add new animation variants
//     const scrollVariants = {
//         hidden: { opacity: 0, y: 20 },
//         visible: { 
//             opacity: 1, 
//             y: 0,
//             transition: {
//                 duration: 0.5,
//                 ease: "easeOut"
//             }
//         },
//         exit: { 
//             opacity: 0, 
//             y: -20,
//             transition: {
//                 duration: 0.3,
//                 ease: "easeIn"
//             }
//         }
//     };

//     const getClassificationIcon = (type: AnalysisClassifyEnum) => {
//         switch (type) {
//             case AnalysisClassifyEnum.POSITIVE:
//                 return <TrendingUp className="w-8 h-8 text-green-500" />;
//             case AnalysisClassifyEnum.NEUTRAL:
//                 return <Minus className="w-8 h-8 text-blue-500" />;
//             case AnalysisClassifyEnum.NEGATIVE:
//                 return <TrendingDown className="w-8 h-8 text-red-500" />;
//         }
//     };

//     // Function to duplicate items for seamless loop
//     const createInfiniteItems = (items: any[]) => {
//         // Create multiple copies to ensure smooth infinite loop
//         return [...items, ...items, ...items, ...items];
//     };

//     const getPlatformIcon = (platform: PlatformsEnum) => {
//         switch (platform) {
//             case PlatformsEnum.FACEBOOK:
//                 return <Facebook className="w-5 h-5 text-[#1877F2]" />;
//             case PlatformsEnum.INSTAGRAM:
//                 return <Instagram className="w-5 h-5 text-[#E4405F]" />;
//             case PlatformsEnum.LINKEDIN:
//                 return <Linkedin className="w-5 h-5 text-[#0A66C2]" />;
//             case PlatformsEnum.X:
//                 return <Twitter className="w-5 h-5 text-[#000000]" />;
//             case PlatformsEnum.YOUTUBE:
//                 return <Youtube className="w-5 h-5 text-[#FF0000]" />;
//             case PlatformsEnum.TIKTOK:
//                 return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" color="#000000">
//                     <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
//                 </svg>;
//             default:
//                 return <Share2 className="w-5 h-5 text-gray-400" />;
//         }
//     };

//     const getPlatformName = (platform: PlatformsEnum) => {
//         switch (platform) {
//             case PlatformsEnum.FACEBOOK:
//                 return 'فيسيوك';
//             case PlatformsEnum.INSTAGRAM:
//                 return 'إنستجرام';
//             case PlatformsEnum.LINKEDIN:
//                 return 'لينكد إن';
//             case PlatformsEnum.X:
//                 return 'إكس';
//             case PlatformsEnum.YOUTUBE:
//                 return 'يوتيوب';
//             case PlatformsEnum.TIKTOK:
//                 return 'تيك توك'
//             default:
//                 return <Share2 className="w-5 h-5 text-gray-400" />;
//         }
//     };

//     // const prepareAnalysisTrendData = (analysisData: IAnalysis[]) => {
//     //     // Get the date range
//     //     const dates = analysisData.map(a => new Date(a.createdAt));
//     //     const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
//     //     const endDate = new Date(Math.max(...dates.map(d => d.getTime())));
//     //     const now = new Date();

//     //     // Calculate time difference in milliseconds
//     //     const timeDiff = now.getTime() - startDate.getTime();
//     //     const oneDay = 24 * 60 * 60 * 1000;
//     //     const oneWeek = 7 * oneDay;
//     //     const oneMonth = 30 * oneDay;
//     //     const oneYear = 365 * oneDay;

//     //     let labels: string[] = [];
//     //     let dateFormat: Intl.DateTimeFormatOptions = {};

//     //     // Determine time interval based on the date range
//     //     if (timeDiff <= oneDay) {
//     //         // If less than a day, show hours
//     //         const hours = Math.ceil(timeDiff / (60 * 60 * 1000));
//     //         labels = Array.from({ length: hours }, (_, i) => {
//     //             const date = new Date(now.getTime() - (hours - i) * 60 * 60 * 1000);
//     //             return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
//     //         });
//     //         dateFormat = { hour: '2-digit', minute: '2-digit' };
//     //     } else if (timeDiff <= oneWeek) {
//     //         // If less than a week, show days
//     //         const days = Math.ceil(timeDiff / oneDay);
//     //         labels = Array.from({ length: days }, (_, i) => {
//     //             const date = new Date(now.getTime() - (days - i) * oneDay);
//     //             return date.toLocaleDateString('ar-SA', { weekday: 'short' });
//     //         });
//     //         dateFormat = { weekday: 'short' };
//     //     } else if (timeDiff <= oneMonth) {
//     //         // If less than a month, show weeks
//     //         const weeks = Math.ceil(timeDiff / oneWeek);
//     //         labels = Array.from({ length: weeks }, (_, i) => {
//     //             const date = new Date(now.getTime() - (weeks - i) * oneWeek);
//     //             return `الأسبوع ${i + 1}`;
//     //         });
//     //         dateFormat = {};
//     //     } else if (timeDiff <= oneYear) {
//     //         // If less than a year, show months
//     //         const months = Math.ceil(timeDiff / oneMonth);
//     //         labels = Array.from({ length: months }, (_, i) => {
//     //             const date = new Date(now.getTime() - (months - i) * oneMonth);
//     //             return date.toLocaleDateString('ar-SA', { month: 'long' });
//     //         });
//     //         dateFormat = { month: 'long' };
//     //     } else {
//     //         // If more than a year, show years
//     //         const years = Math.ceil(timeDiff / oneYear);
//     //         labels = Array.from({ length: years }, (_, i) => {
//     //             const date = new Date(now.getTime() - (years - i) * oneYear);
//     //             return date.toLocaleDateString('ar-SA', { year: 'numeric' });
//     //         });
//     //         dateFormat = { year: 'numeric' };
//     //     }

//     //     // Prepare datasets for each classification
//     //     const datasets = [
//     //         {
//     //             label: 'إيجابي',
//     //             data: labels.map((_, index) => {
//     //                 const date = new Date(now.getTime() - (labels.length - index - 1) * getTimeInterval(timeDiff));
//     //                 return analysisData.filter(a => {
//     //                     const analysisDate = new Date(a.createdAt);
//     //                     return isWithinInterval(analysisDate, date, timeDiff) && 
//     //                            a.classify === AnalysisClassifyEnum.POSITIVE;
//     //                 }).length;
//     //             }),
//     //             borderColor: 'rgb(34, 197, 94)',
//     //             backgroundColor: 'rgba(34, 197, 94, 0.1)',
//     //             tension: 0.4,
//     //             fill: true,
//     //             pointBackgroundColor: 'rgb(34, 197, 94)',
//     //             pointBorderColor: '#fff',
//     //             pointBorderWidth: 2,
//     //             pointRadius: 4,
//     //             pointHoverRadius: 6
//     //         },
//     //         {
//     //             label: 'محايد',
//     //             data: labels.map((_, index) => {
//     //                 const date = new Date(now.getTime() - (labels.length - index - 1) * getTimeInterval(timeDiff));
//     //                 return analysisData.filter(a => {
//     //                     const analysisDate = new Date(a.createdAt);
//     //                     return isWithinInterval(analysisDate, date, timeDiff) && 
//     //                            a.classify === AnalysisClassifyEnum.NEUTRAL;
//     //                 }).length;
//     //             }),
//     //             borderColor: 'rgb(59, 130, 246)',
//     //             backgroundColor: 'rgba(59, 130, 246, 0.1)',
//     //             tension: 0.4,
//     //             fill: true,
//     //             pointBackgroundColor: 'rgb(59, 130, 246)',
//     //             pointBorderColor: '#fff',
//     //             pointBorderWidth: 2,
//     //             pointRadius: 4,
//     //             pointHoverRadius: 6
//     //         },
//     //         {
//     //             label: 'سلبي',
//     //             data: labels.map((_, index) => {
//     //                 const date = new Date(now.getTime() - (labels.length - index - 1) * getTimeInterval(timeDiff));
//     //                 return analysisData.filter(a => {
//     //                     const analysisDate = new Date(a.createdAt);
//     //                     return isWithinInterval(analysisDate, date, timeDiff) && 
//     //                            a.classify === AnalysisClassifyEnum.NEGATIVE;
//     //                 }).length;
//     //             }),
//     //             borderColor: 'rgb(239, 68, 68)',
//     //             backgroundColor: 'rgba(239, 68, 68, 0.1)',
//     //             tension: 0.4,
//     //             fill: true,
//     //             pointBackgroundColor: 'rgb(239, 68, 68)',
//     //             pointBorderColor: '#fff',
//     //             pointBorderWidth: 2,
//     //             pointRadius: 4,
//     //             pointHoverRadius: 6
//     //         }
//     //     ];

//     //     return { labels, datasets };
//     // };

//     // Helper function to get time interval in milliseconds
    
//     const getTimeInterval = (timeDiff: number): number => {
//         const oneDay = 24 * 60 * 60 * 1000;
//         const oneWeek = 7 * oneDay;
//         const oneMonth = 30 * oneDay;
//         const oneYear = 365 * oneDay;

//         if (timeDiff <= oneDay) return 60 * 60 * 1000; // 1 hour
//         if (timeDiff <= oneWeek) return oneDay; // 1 day
//         if (timeDiff <= oneMonth) return oneWeek; // 1 week
//         if (timeDiff <= oneYear) return oneMonth; // 1 month
//         return oneYear; // 1 year
//     };

//     // Helper function to check if a date is within the current interval
//     const isWithinInterval = (date: Date, intervalStart: Date, timeDiff: number): boolean => {
//         const interval = getTimeInterval(timeDiff);
//         const intervalEnd = new Date(intervalStart.getTime() + interval);
//         return date >= intervalStart && date < intervalEnd;
//     };

//     const createPublisherTickerVariants = () => ({
//         animate: {
//             x: [0, -2000],
//             transition: {
//                 x: {
//                     repeat: Infinity,
//                     repeatType: "loop",
//                     duration: 30,
//                     ease: "linear",
//                     repeatDelay: 0,
//                 },
//             },
//         },
//         pause: {
//             x: 0,
//             transition: {
//                 duration: 0.5,
//             },
//         },
//     });

//     const prepareSubAnalysisChartData = (subAnalysis: IDashboardSubAnalysis[]) => {
//         // Sort by count and get top 3
//         const sortedAnalysis = [...subAnalysis].sort((a, b) => b.count - a.count);
//         const top3 = sortedAnalysis.slice(0, 3);
//         const others = sortedAnalysis.slice(3);

//         // Calculate totals for others by classification type
//         const othersByType = others.reduce((acc, item) => {
//             item.classifications.forEach(classification => {
//                 if (!acc[classification.type]) {
//                     acc[classification.type] = 0;
//                 }
//                 acc[classification.type] += classification.count;
//             });
//             return acc;
//         }, {} as Record<AnalysisClassifyEnum, number>);

//         // Create labels array with top 3 and others
//         const labels = [...top3.map(item => item.name), 'Others'];

//         // Create datasets for each classification type
//         const datasets = [
//             {
//                 label: 'Positive',
//                 data: [
//                     ...top3.map(item => 
//                         item.classifications.find(c => c.type === AnalysisClassifyEnum.POSITIVE)?.count || 0.1
//                     ),
//                     othersByType[AnalysisClassifyEnum.POSITIVE] || 0.1
//                 ],
//                 backgroundColor: 'rgba(34, 197, 94, 0.8)',
//                 borderColor: 'rgba(34, 197, 94, 1)',
//                 borderWidth: 1,
//                 borderRadius: 4,
//             },
//             {
//                 label: 'Neutral',
//                 data: [
//                     ...top3.map(item => 
//                         item.classifications.find(c => c.type === AnalysisClassifyEnum.NEUTRAL)?.count || 0.1
//                     ),
//                     othersByType[AnalysisClassifyEnum.NEUTRAL] || 0.1
//                 ],
//                 backgroundColor: 'rgba(59, 130, 246, 0.8)',
//                 borderColor: 'rgba(59, 130, 246, 1)',
//                 borderWidth: 1,
//                 borderRadius: 4,
//             },
//             {
//                 label: 'Negative',
//                 data: [
//                     ...top3.map(item => 
//                         item.classifications.find(c => c.type === AnalysisClassifyEnum.NEGATIVE)?.count || 0.1
//                     ),
//                     othersByType[AnalysisClassifyEnum.NEGATIVE] || 0.1
//                 ],
//                 backgroundColor: 'rgba(239, 68, 68, 0.8)',
//                 borderColor: 'rgba(239, 68, 68, 1)',
//                 borderWidth: 1,
//                 borderRadius: 4,
//             }
//         ];

//         return {
//             labels,
//             datasets,
//         };
//     };

//     const subAnalysisVariants = {
//         animate: {
//             opacity: 1,
//             y: 0,
//             transition: {
//                 duration: 0.5,
//             }
//         },
//         initial: {
//             opacity: 0,
//             y: 50,
//         },
//         continuous: {
//             y: [0, -10, 0],
//             transition: {
//                 duration: 3,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//             }
//         }
//     };

//     const publisherVariants = {
//         animate: {
//             opacity: 1,
//             x: 0,
//             scale: 1,
//             borderRadius: "50%",
//             transition: {
//                 duration: 0.5,
//             }
//         },
//         initial: {
//             opacity: 0,
//             x: 100,
//             scale: 0.8,
//             borderRadius: "8px",
//         },
//         continuous: {
//             x: [100, -100],
//             transition: {
//                 duration: 20,
//                 repeat: Infinity,
//                 ease: "linear"
//             }
//         }
//     };

//     return (
//         <div className="w-full h-screen bg-gray-900 p-4 overflow-y-auto overflow-x-hidden">
//             {error && (
//                 <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
//                     {error}
//                 </div>
//             )}
//             {!isConnected && (
//                 <div className="fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
//                     Connecting to server...
//                 </div>
//             )}
//             {isMounted && (
//                 <motion.div 
//                     className="flex flex-col h-full gap-4"
//                     variants={containerVariants}
//                     initial="hidden"
//                     animate="visible"
//                 >
//                     <div className="grid grid-cols-4 gap-2 h-full">
//                         {/* Side #1 */}
//                         <motion.div
//                             variants={itemVariants}
//                             className="flex flex-col gap-1 h-full"
//                         >
//                             {/* Section 1.1 Classifications Section */}
//                             <div className="flex items-center justify-center p-4 bg-gray-700/50 rounded-lg">
//                                 <div className="flex items-center justify-between gap-6 w-full">
//                                     {allCalssifications.map((cls, index) => (
//                                         <motion.div 
//                                             key={index} 
//                                             className="flex flex-col items-center"
//                                             initial={{ opacity: 0, scale: 0.8 }}
//                                             animate={{ opacity: 1, scale: 1 }}
//                                             whileHover={{ scale: 1.1 }}
//                                             transition={{ duration: 0.3, delay: index * 0.1 }}
//                                         >
//                                             <div className={`w-16 h-16 rounded-xl border-2 ${
//                                                 cls.type === AnalysisClassifyEnum.POSITIVE ? 'border-green-500 bg-green-500/10' : 
//                                                 cls.type === AnalysisClassifyEnum.NEUTRAL ? 'border-blue-500 bg-blue-500/10' : 
//                                                 'border-red-500 bg-red-500/10'
//                                             } flex items-center justify-center shadow-lg`}>
//                                                 {getClassificationIcon(cls.type)}
//                                             </div>
//                                             <div className={`mt-2 px-3 py-1 rounded-full ${
//                                                 cls.type === AnalysisClassifyEnum.POSITIVE ? 'bg-green-500/20 text-green-400' : 
//                                                 cls.type === AnalysisClassifyEnum.NEUTRAL ? 'bg-blue-500/20 text-blue-400' : 
//                                                 'bg-red-500/20 text-red-400'
//                                             } text-lg font-bold`}>
//                                                 {cls.count}
//                                             </div>
//                                         </motion.div>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Section 1.2 Important Analysis Section */}
//                             <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-2 hover:shadow-xl transition-all duration-300 flex-1 flex flex-col">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <div className="flex gap-1 items-center">
//                                         <button 
//                                             onClick={toggleImportantAnalysisAnimation}
//                                             className="p-1 rounded-full hover:bg-gray-700 transition-colors"
//                                         >
//                                             {isImportantAnalysisAnimating ? (
//                                                 <Pause className="h-4 w-4 text-gray-300" />
//                                             ) : (
//                                                 <Play className="h-4 w-4 text-gray-300" />
//                                             )}
//                                         </button>
//                                         <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1">
//                                             <Bell className="w-5 h-5" />
//                                             الرصد الهام
//                                         </h3>
//                                     </div>
//                                     <div className="p-1 flex items-center justify-center">
//                                         <span className="text-lg font-bold text-gray-300">{importantAnalysis.length}</span>
//                                     </div>
//                                 </div>
                                
//                                 <div className="relative flex-1 overflow-hidden">
//                                     <motion.div
//                                         ref={importantTickerRef}
//                                         className="absolute inset-0"
//                                         variants={createTickerVariants(importantTickerPosition)}
//                                         animate={!isImportantAnalysisAnimating ? "pause" : "animate"}
//                                     >
//                                         <div className="space-y-2">
//                                             {importantAnalysis.map((analysis, index) => (
//                                                 <motion.div 
//                                                     key={index} 
//                                                     className="bg-gray-700/50 p-2 rounded-lg"
//                                                     variants={liveAnalysisItemVariants}
//                                                     initial="initial"
//                                                     animate={isImportantAnalysisAnimating ? "pulse" : "animate"}
//                                                     whileHover={{ scale: 1.02 }}
//                                                 >
//                                                     <div className="flex flex-col gap-1">
//                                                         <div className="flex justify-between">
//                                                             {/* UserInfo */}
//                                                             <div className="flex gap-1">
//                                                                 { analysis.publisher.avatar ? 
//                                                                     <Image 
//                                                                         src={analysis.publisher.avatar}
//                                                                         alt={analysis.publisher?.name?.charAt(0)}
//                                                                         width={50}
//                                                                         height={50}
//                                                                         className="rounded-full w-10 h-10 bg-gray-600 flex items-center justify-center text-gray-300"
//                                                                     /> :
//                                                                     <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
//                                                                     {analysis.publisher?.name?.charAt(0) || '?'
//                                                                 }
//                                                                 </div>}
//                                                                 <div className="flex flex-col justify-start items-start gap-1 mb-1">
//                                                                     <span className="text-xs font-medium text-gray-300">
//                                                                         {analysis.publisher?.name || 'Unknown Publisher'}
//                                                                     </span>
//                                                                     <div className="flex gap-2">
//                                                                         <div className="flex items-center gap-1">
//                                                                             <Users className="w-3 h-3 text-gray-300" fill="white"/>
//                                                                             <span className="text-xs font-medium text-gray-300">{analysis.publisher.followers}</span>
//                                                                         </div>
//                                                                         <span className="text-xs text-gray-400">
//                                                                             {formatDistanceToNow(analysis.createdAt, { 
//                                                                                 addSuffix: true,
//                                                                                 locale: locale === 'ar' ? arSA : enUS }
//                                                                             )}
//                                                                         </span>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>

//                                                             {/* Classification Badge */}
//                                                             <div className={`h-fit w-fit p-1 rounded-md text-xs ${
//                                                                 analysis.classify === AnalysisClassifyEnum.POSITIVE 
//                                                                     ? 'bg-green-500/20 text-green-400' 
//                                                                     : analysis.classify === AnalysisClassifyEnum.NEUTRAL 
//                                                                     ? 'bg-blue-500/20 text-blue-400'
//                                                                     : 'bg-red-500/20 text-red-400'
//                                                             }`}>
//                                                                 {analysis.classify === AnalysisClassifyEnum.POSITIVE 
//                                                                     ? 'إيجابي' 
//                                                                     : analysis.classify === AnalysisClassifyEnum.NEUTRAL 
//                                                                     ? 'محايد'
//                                                                     : 'سلبي'}
//                                                             </div>
//                                                         </div>

//                                                         {/* Content */}
//                                                         <div className="">
//                                                             <p className="text-xs text-gray-400 my-2 px-2 line-clamp-2">
//                                                                 {analysis.content?.body || analysis.subAnalysis?.body || 'No content available'}
//                                                             </p>

//                                                             {/* Statistics */}
//                                                             <div className="flex items-center justify-around text-xs text-gray-400">
//                                                                 <div className="flex items-center gap-1">
//                                                                     {/* <span className="w-2 h-2 rounded-full bg-blue-500"></span> */}
//                                                                     <EyeIcon className="w-3 h-3" fill="white"/>
//                                                                     {analysis.statistics?.views || 0}
//                                                                 </div>
//                                                                 <div className="flex items-center gap-1">
//                                                                     {/* <span className="w-2 h-2 rounded-full bg-green-500"></span> */}
//                                                                     <Share2 className="w-3 h-3" fill="white"/>
//                                                                     {analysis.statistics?.shares || 0}
//                                                                 </div>
//                                                                 <div className="flex items-center gap-1">
//                                                                     {/* <span className="w-2 h-2 rounded-full bg-orange-500"></span> */}
//                                                                     <Heart className="w-3 h-3" fill="white"/>
//                                                                     {analysis.statistics?.reactions || 0}
//                                                                 </div>
//                                                                 <div className="flex items-center gap-1">
//                                                                     {/* <span className="w-2 h-2 rounded-full bg-orange-500"></span> */}
//                                                                     <MessageCircle className="w-3 h-3" fill="white"/>
//                                                                     {analysis.statistics?.comments || 0}
//                                                                 </div>
//                                                                 <div className="flex items-center gap-1">
//                                                                     {/* <span className="w-2 h-2 rounded-full bg-orange-500"></span> */}
//                                                                     <BarChart className="w-3 h-3" fill="white"/>
//                                                                     {analysis.statistics?.appearance || 0}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </motion.div>
//                                             ))}
//                                         </div>
//                                     </motion.div>
//                                 </div>
//                             </div>

//                             {/* Section 1.3 Analysis Section */}
//                             <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-2 hover:shadow-xl transition-all duration-300 flex-1 flex flex-col">
//                                 <div
//                                     className="flex items-center justify-between mb-2"
//                                 >    
//                                     <div className="flex justify-between items-center">
//                                         <button 
//                                             onClick={toggleLiveAnalysisAnimation}
//                                             className="p-1 rounded-full hover:bg-gray-700 transition-colors"
//                                         >
//                                             {isLiveAnalysisAnimating ? (
//                                                 <Pause className="h-4 w-4 text-gray-300" />
//                                             ) : (
//                                                 <Play className="h-4 w-4 text-gray-300" />
//                                             )}
//                                         </button>
//                                         <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1">
//                                             <LineChart className="w-5 h-5" />
//                                             الرصد المباشر
//                                         </h3>
                                        
//                                     </div>
//                                     <div className="p-1 flex items-center justify-center">
//                                             <span className="text-lg font-semibold text-gray-300">{allAnalysis.length}</span>
//                                     </div>
//                                 </div>
//                                 <div className="relative flex-1 overflow-hidden">
//                                     <motion.div
//                                         ref={liveTickerRef}
//                                         className="absolute inset-0"
//                                         variants={createTickerVariants(liveTickerPosition)}
//                                         animate={!isLiveAnalysisAnimating ? "pause" : "animate"}
//                                     >
//                                         <div className="space-y-2">
//                                         {allAnalysis.map((analysis, index) => (
//                                                 <motion.div 
//                                                     key={index} 
//                                                     className="bg-gray-700/50 p-2 rounded-lg"
//                                                     initial={{ x: -20, opacity: 0 }}
//                                                     animate={{ x: 0, opacity: 1 }}
//                                                     transition={{ delay: index * 0.1 }}
//                                                     whileHover={{ scale: 1.02 }}
//                                                 >
//                                                     <div className="flex flex-col gap-1">
//                                                         <div className="flex justify-between">
//                                                             {/* UserInfo */}
//                                                             <div className="flex gap-1">
//                                                                 { analysis.publisher.avatar ? 
//                                                                     <Image 
//                                                                         src={analysis.publisher.avatar}
//                                                                         alt={analysis.publisher?.name?.charAt(0)}
//                                                                         width={50}
//                                                                         height={50}
//                                                                         className="rounded-full w-10 h-10 bg-gray-600 flex items-center justify-center text-gray-300"
//                                                                     /> :
//                                                                     <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
//                                                                     {analysis.publisher?.name?.charAt(0) || '?'
//                                                                 }
//                                                                 </div>}
//                                                                 <div className="flex flex-col justify-start items-start gap-1 mb-1">
//                                                                     <span className="text-xs font-medium text-gray-300">
//                                                                         {analysis.publisher?.name || 'Unknown Publisher'}
//                                                                     </span>
//                                                                     <div className="flex gap-2">
//                                                                         <div className="flex items-center gap-1">
//                                                                             <Users className="w-3 h-3 text-gray-300" fill="white"/>
//                                                                             <span className="text-xs font-medium text-gray-300">{analysis.publisher.followers}</span>
//                                                                         </div>
//                                                                         <span className="text-xs text-gray-400">
//                                                                             {formatDistanceToNow(analysis.createdAt, { 
//                                                                                 addSuffix: true,
//                                                                                 locale: locale === 'ar' ? arSA : enUS }
//                                                                             )}
//                                                                         </span>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>

//                                                             {/* Classification Badge */}
//                                                             <div className={`h-fit w-fit p-1 rounded-md text-xs ${
//                                                                 analysis.classify === AnalysisClassifyEnum.POSITIVE 
//                                                                     ? 'bg-green-500/20 text-green-400' 
//                                                                     : analysis.classify === AnalysisClassifyEnum.NEUTRAL 
//                                                                     ? 'bg-blue-500/20 text-blue-400'
//                                                                     : 'bg-red-500/20 text-red-400'
//                                                             }`}>
//                                                                 {analysis.classify === AnalysisClassifyEnum.POSITIVE 
//                                                                     ? 'إيجابي' 
//                                                                     : analysis.classify === AnalysisClassifyEnum.NEUTRAL 
//                                                                     ? 'محايد'
//                                                                     : 'سلبي'}
//                                                             </div>
//                                                         </div>

//                                                         {/* Content */}
//                                                         <div className="">
//                                                             <p className="text-xs text-gray-400 my-2 px-2 line-clamp-2">
//                                                                 {analysis.content?.body || analysis.subAnalysis?.body || 'No content available'}
//                                                             </p>

//                                                             {/* Statistics */}
//                                                             <div className="flex items-center justify-around text-xs text-gray-400">
//                                                                 <div className="flex items-center gap-1">
//                                                                     {/* <span className="w-2 h-2 rounded-full bg-blue-500"></span> */}
//                                                                     <EyeIcon className="w-3 h-3" fill="white"/>
//                                                                     {analysis.statistics?.views || 0}
//                                                                 </div>
//                                                                 <div className="flex items-center gap-1">
//                                                                     {/* <span className="w-2 h-2 rounded-full bg-green-500"></span> */}
//                                                                     <Share2 className="w-3 h-3" fill="white"/>
//                                                                     {analysis.statistics?.shares || 0}
//                                                                 </div>
//                                                                 <div className="flex items-center gap-1">
//                                                                     {/* <span className="w-2 h-2 rounded-full bg-orange-500"></span> */}
//                                                                     <Heart className="w-3 h-3" fill="white"/>
//                                                                     {analysis.statistics?.reactions || 0}
//                                                                 </div>
//                                                                 <div className="flex items-center gap-1">
//                                                                     {/* <span className="w-2 h-2 rounded-full bg-orange-500"></span> */}
//                                                                     <MessageCircle className="w-3 h-3" fill="white"/>
//                                                                     {analysis.statistics?.comments || 0}
//                                                                 </div>
//                                                                 <div className="flex items-center gap-1">
//                                                                     {/* <span className="w-2 h-2 rounded-full bg-orange-500"></span> */}
//                                                                     <BarChart className="w-3 h-3" fill="white"/>
//                                                                     {analysis.statistics?.appearance || 0}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </motion.div>
//                                             ))}
//                                         </div>
//                                     </motion.div>
//                                 </div>
//                             </div>
//                         </motion.div>

//                         {/* Side #2 */}
//                         <motion.div
//                             variants={itemVariants}
//                             className="col-span-2 flex flex-col gap-2 h-full"
//                         >
//                             {/* Section 2.1 Map and News/Social */}
//                             <div className="flex flex-row gap-1 h-1/3">
//                                 {/* Map Track */}
//                                 <div className="w-3/4 bg-gray-800/50 backdrop-blur-sm rounded-lg shadow border border-gray-700/50 hover:shadow-xl transition-all duration-300 flex flex-col">
//                                     {/* <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
//                                         <MapPin className="w-5 h-5" />
//                                         خريطة التحليلات
//                                     </h3> */}
//                                     <div className="flex-1 relative">
//                                         {isMounted && (
//                                             <MapWithNoSSR 
//                                                 center={mapCenter}
//                                                 lastAnalysisLocation={lastAnalysisLocation}
//                                                 key="dashboard-map"
//                                             />
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* News/Social Section */}
//                                 <div className="w-1/4 bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-3 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-around">
//                                     <motion.div 
//                                         className="flex flex-col items-center gap-2"
//                                         whileHover={{ scale: 1.05 }}
//                                     >
//                                         <div className="w-14 h-14 rounded-full border-2 border-green-500 bg-green-500/10 flex items-center justify-center text-green-500 font-semibold">
//                                             <span className="text-2xl font-bold">
//                                                 {allAnalysis.length}
//                                             </span>
//                                         </div>
//                                         <span className="text-sm text-gray-300">التواصل الإجتماعي</span>
//                                     </motion.div>
                                    
//                                     <motion.div 
//                                         className="flex flex-col items-center gap-2"
//                                         whileHover={{ scale: 1.05 }}
//                                     >
//                                         <div className="w-14 h-14 rounded-full border-2 border-orange-500 bg-orange-500/10 flex items-center justify-center text-orange-500 font-semibold">
//                                             <span className="text-2xl font-bold">
//                                                 {allNews.length}
//                                             </span>
//                                         </div>
//                                         <span className="text-sm text-gray-300">الأخبار</span>
//                                     </motion.div>
//                                 </div>
//                             </div>

//                             {/* Section 2.2 SubAnalysis Data & Platforms */}
//                             <div className="flex items-center gap-1 bg-gray-900/50 backdrop-blur-sm flex-1">
//                                 {/* Section 2.2.1 Platforms Section */}
//                                 <div className="w-1/2 h-full p-1 overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 hover:shadow-xl transition-all duration-300">
//                                     <div className="flex items-center justify-between mb-2">
//                                         <div className="flex gap-1 items-center">
//                                             <button 
//                                                 onClick={togglePlatformsAnimation}
//                                                 className="p-1 rounded-full hover:bg-gray-700 transition-colors"
//                                             >
//                                                 {isPlatformsAnimating ? (
//                                                     <Pause className="h-4 w-4 text-gray-300" />
//                                                 ) : (
//                                                     <Play className="h-4 w-4 text-gray-300" />
//                                                 )}
//                                             </button>
//                                             <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1">
//                                                 <Globe className="w-5 h-5" />
//                                                 المنصات
//                                             </h3>
//                                         </div>
//                                         <div className="p-1 flex items-center justify-center">
//                                             <span className="text-lg font-semibold text-gray-300">{allPlatforms.length}</span>
//                                         </div>
//                                     </div>
//                                     <div className="relative h-[calc(100%-2rem)] overflow-hidden">
//                                         <AnimatePresence mode="popLayout">
//                                             <motion.div
//                                                 className="absolute inset-0 flex flex-col"
//                                                 initial="initial"
//                                                 animate={isPlatformsAnimating ? "continuous" : "animate"}
//                                                 exit="exit"
//                                                 variants={subAnalysisVariants}
//                                             >
//                                                 {allPlatforms.map((platform, index) => (
//                                                     <motion.div
//                                                         key={index}
//                                                         className="flex items-center gap-2 p-2 rounded-lg bg-gray-700/50"
//                                                         variants={subAnalysisVariants}
//                                                     >
//                                                         {getPlatformIcon(platform.platform)}
//                                                         <span className="text-sm font-medium text-gray-300">{getPlatformName(platform.platform)}</span>
//                                                         <span className="text-xs text-gray-400 ml-auto">{platform.total}</span>
//                                                     </motion.div>
//                                                 ))}
//                                             </motion.div>
//                                         </AnimatePresence>
//                                     </div>
//                                 </div>

//                                 {/* Section 2.2.2 SubAnalysis Section */}
//                                 <div className="w-1/2 h-full p-1 overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 hover:shadow-xl transition-all duration-300">
//                                 <div className="flex items-center justify-between mb-2">
//                                         <h3 className="text-sm font-semibold text-blue-400 flex items-center gap-1">
//                                             <BarChart className="w-5 h-5" />
//                                             التحليلات الفرعية
//                                         </h3>
//                                         <div className="p-1 flex items-center justify-center">
//                                             <span className="text-lg font-semibold text-blue-400">{allSubAnalysis.length}</span>
//                                         </div>
//                                     </div>
//                                     <div className="relative h-[calc(100%-2rem)] overflow-hidden">
//                                         <AnimatePresence mode="popLayout">
//                                             <motion.div
//                                                 className="absolute inset-0 flex flex-col gap-2"
//                                                 initial="initial"
//                                                 animate={isSubAnalysisAnimating ? "continuous" : "animate"}
//                                                 exit="exit"
//                                                 variants={subAnalysisVariants}
//                                             >
//                                                 {allSubAnalysis.map((subAnalysis, index) => (
//                                                     <motion.div 
//                                                         key={index} 
//                                                         className="bg-gray-700/50 p-1 rounded-lg"
//                                                         initial={{ x: -20, opacity: 0 }}
//                                                         animate={{ x: 0, opacity: 1 }}
//                                                         transition={{ delay: index * 0.1 }}
//                                                         whileHover={{ scale: 1.02 }}
//                                                     >
//                                                         <div className="flex justify-between items-center">
//                                                             <div className="flex items-center gap-2">
//                                                                 <div className="w-8 h-8 rounded-full bg-gray-600/50 flex items-center justify-center">
//                                                                     <BarChart className="w-5 h-5 text-blue-400" />
//                                                                 </div>
//                                                                 <span className="text-xs font-medium text-gray-300">
//                                                                     {subAnalysis.name}
//                                                                 </span>
//                                                             </div>
//                                                             <span className="text-xs font-semibold text-blue-400">
//                                                                 {subAnalysis.count}
//                                                             </span>
//                                                         </div>
//                                                     </motion.div>
//                                                 ))}
//                                             </motion.div>
//                                         </AnimatePresence>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Section 2.3 New Statistics and Charts Section */}
//                             <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-2 over:shadow-xl transition-all duration-300">
//                                 {/* Statistics Row */}
//                                 <div className="flex justify-between items-center mb-2">
//                                     <motion.div 
//                                         className="flex items-center gap-2 bg-gray-700/30 backdrop-blur-sm p-1 rounded-lg"
//                                         whileHover={{ scale: 1.02 }}
//                                         transition={{ duration: 0.2 }}
//                                     >
//                                         <BarChart className="w-4 h-4 text-blue-400" />
//                                         <span className="text-sm text-gray-300">إجمالي رصد المنشورات</span>
//                                         <span className="text-sm font-semibold text-blue-400">{allAnalysis.length}</span>
//                                     </motion.div>
//                                     <motion.div 
//                                         className="flex items-center gap-2 bg-gray-700/30 backdrop-blur-sm p-2 rounded-lg"
//                                         whileHover={{ scale: 1.02 }}
//                                         transition={{ duration: 0.2 }}
//                                     >
//                                         <TrendingUp className="w-4 h-4 text-green-400" />
//                                         <span className="text-sm text-gray-300">إجمالي تفاعلات المنشورات</span>
//                                         <span className="text-sm font-semibold text-green-400">
//                                             {allAnalysis.reduce((acc, curr) => 
//                                                 acc + (curr.statistics?.views || 0) + 
//                                                 (curr.statistics?.shares || 0) + 
//                                                 (curr.statistics?.reactions || 0) + 
//                                                 (curr.statistics?.comments || 0) + 
//                                                 (curr.statistics?.appearance || 0), 0
//                                             )}
//                                         </span>
//                                     </motion.div>
//                                 </div>

//                                 {/* Charts Row */}
//                                 <div className="grid grid-cols-2 gap-4">
//                                     {/* Classification Distribution Chart */}
//                                     <div className="bg-gray-700/30 backdrop-blur-sm p-2 rounded-lg">
//                                         <div className="flex items-center justify-between mb-2">
//                                             <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
//                                                 <PieChart className="w-4 h-4 text-blue-400" />
//                                                 توزيع التحليلات
//                                             </h4>
//                                             <div className="flex gap-2">
//                                                 {allCalssifications.map((cls, index) => (
//                                                     <div key={index} className="flex items-center gap-1">
//                                                         <div className={`w-2 h-2 rounded-full ${
//                                                             cls.type === AnalysisClassifyEnum.POSITIVE ? 'bg-green-500' :
//                                                             cls.type === AnalysisClassifyEnum.NEUTRAL ? 'bg-blue-500' :
//                                                             'bg-red-500'
//                                                         }`} />
//                                                         <span className="text-xs text-gray-400">{cls.count}</span>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                         <div className="h-40">
//                                             <Doughnut
//                                                 data={{
//                                                     labels: ['إيجابي', 'محايد', 'سلبي'],
//                                                     datasets: [{
//                                                         data: allCalssifications.map(c => c.count),
//                                                         backgroundColor: [
//                                                             'rgba(34, 197, 94, 0.8)',  // green
//                                                             'rgba(59, 130, 246, 0.8)',  // blue
//                                                             'rgba(239, 68, 68, 0.8)',   // red
//                                                         ],
//                                                         borderColor: [
//                                                             'rgba(34, 197, 94, 1)',
//                                                             'rgba(59, 130, 246, 1)',
//                                                             'rgba(239, 68, 68, 1)',
//                                                         ],
//                                                         borderWidth: 2,
//                                                         hoverOffset: 4,
//                                                         hoverBorderWidth: 3,
//                                                     }]
//                                                 }}
//                                                 options={{
//                                                     responsive: true,
//                                                     maintainAspectRatio: false,
//                                                     cutout: '70%',
//                                                     plugins: {
//                                                         legend: {
//                                                             position: 'bottom',
//                                                             labels: {
//                                                                 color: '#9CA3AF',
//                                                                 font: {
//                                                                     size: 12,
//                                                                     family: "'Cairo', sans-serif"
//                                                                 },
//                                                                 padding: 20,
//                                                                 usePointStyle: true,
//                                                                 pointStyle: 'circle'
//                                                             }
//                                                         },
//                                                         tooltip: {
//                                                             backgroundColor: 'rgba(17, 24, 39, 0.9)',
//                                                             titleColor: '#fff',
//                                                             bodyColor: '#fff',
//                                                             borderColor: 'rgba(255, 255, 255, 0.1)',
//                                                             borderWidth: 1,
//                                                             padding: 12,
//                                                             displayColors: true,
//                                                             usePointStyle: true,
//                                                             callbacks: {
//                                                                 label: function(context) {
//                                                                     const label = context.label || '';
//                                                                     const value = context.raw;
//                                                                     const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
//                                                                     const percentage = Math.round((value as number / total) * 100);
//                                                                     return `${label}: ${value} (${percentage}%)`;
//                                                                 }
//                                                             }
//                                                         }
//                                                     },
//                                                     animation: {
//                                                         animateScale: true,
//                                                         animateRotate: true,
//                                                         duration: 2000,
//                                                         easing: 'easeInOutQuart'
//                                                     }
//                                                 }}
//                                             />
//                                         </div>
//                                     </div>

//                                     {/* Classification Trend Chart */}
//                                     <div className="bg-gray-700/30 backdrop-blur-sm p-2 rounded-lg">
//                                         <div className="flex items-center justify-between mb-2">
//                                             <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
//                                                 <LineChart className="w-4 h-4 text-blue-400" />
//                                                 اتجاه التحليلات
//                                             </h4>
//                                             <div className="flex gap-2">
//                                                 <div className="flex items-center gap-1">
//                                                     <div className="w-2 h-2 rounded-full bg-green-500" />
//                                                     <span className="text-xs text-gray-400">إيجابي</span>
//                                                 </div>
//                                                 <div className="flex items-center gap-1">
//                                                     <div className="w-2 h-2 rounded-full bg-blue-500" />
//                                                     <span className="text-xs text-gray-400">محايد</span>
//                                                 </div>
//                                                 <div className="flex items-center gap-1">
//                                                     <div className="w-2 h-2 rounded-full bg-red-500" />
//                                                     <span className="text-xs text-gray-400">سلبي</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="h-[200px]">
//                                             <Bar
//                                                 data={prepareSubAnalysisChartData(deriveSubAnalysis(allAnalysis))}
//                                                 options={{
//                                                     responsive: true,
//                                                     maintainAspectRatio: false,
//                                                     plugins: {
//                                                         legend: {
//                                                             display: false
//                                                         },
//                                                         tooltip: {
//                                                             callbacks: {
//                                                                 label: function(context) {
//                                                                     const label = context.dataset.label || '';
//                                                                     const value = context.raw;
//                                                                     return `${label}: ${value}`;
//                                                                 }
//                                                             }
//                                                         }
//                                                     },
//                                                     scales: {
//                                                         x: {
//                                                             stacked: false,
//                                                             grid: {
//                                                                 display: false
//                                                             },
//                                                             ticks: {
//                                                                 color: '#9CA3AF',
//                                                                 maxRotation: 45,
//                                                                 minRotation: 45,
//                                                                 font: {
//                                                                     size: 10
//                                                                 }
//                                                             }
//                                                         },
//                                                         y: {
//                                                             stacked: false,
//                                                             beginAtZero: true,
//                                                             grid: {
//                                                                 color: 'rgba(156, 163, 175, 0.1)'
//                                                             },
//                                                             ticks: {
//                                                                 color: '#9CA3AF',
//                                                                 font: {
//                                                                     size: 10
//                                                                 },
//                                                                 stepSize: 1
//                                                             }
//                                                         }
//                                                     },
//                                                     animation: {
//                                                         duration: 2000,
//                                                         easing: 'easeInOutQuart'
//                                                     }
//                                                 }}
//                                             />
//                                         </div>
//                                     </div>

//                                     {/* Sub Analysis Chart
//                                     <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-2 hover:shadow-xl transition-all duration-300 flex-1 flex flex-col">
//                                         <div className="relative flex-1 overflow-hidden">
//                                             <motion.div
//                                                 className="absolute inset-0"
//                                                 variants={createTickerVariants(0)}
//                                                 animate={!isSubAnalysisAnimating ? "pause" : "animate"}
//                                             >
//                                                 <div className="flex gap-2 overflow-x-auto pb-2">
//                                                     <div className="w-[400px] h-[200px] bg-gray-700/50 rounded-md p-2">
//                                                         <Bar
//                                                             data={prepareSubAnalysisChartData(allSubAnalysis)}
//                                                             options={{
//                                                                 responsive: true,
//                                                                 maintainAspectRatio: false,
//                                                                 plugins: {
//                                                                     legend: {
//                                                                         display: true,
//                                                                         position: 'top',
//                                                                         labels: {
//                                                                             color: 'rgba(255, 255, 255, 0.7)',
//                                                                             font: {
//                                                                                 size: 10
//                                                                             }
//                                                                         }
//                                                                     },
//                                                                     tooltip: {
//                                                                         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                                                                         titleColor: 'rgba(255, 255, 255, 0.9)',
//                                                                         bodyColor: 'rgba(255, 255, 255, 0.7)',
//                                                                         borderColor: 'rgba(255, 255, 255, 0.1)',
//                                                                         borderWidth: 1,
//                                                                         padding: 8,
//                                                                         displayColors: true,
//                                                                         callbacks: {
//                                                                             label: function(context) {
//                                                                                 const label = context.dataset.label || '';
//                                                                                 const value = context.parsed.y;
//                                                                                 return `${label}: ${value.toLocaleString()}`;
//                                                                             }
//                                                                         }
//                                                                     }
//                                                                 },
//                                                                 scales: {
//                                                                     x: {
//                                                                         stacked: true,
//                                                                         grid: {
//                                                                             display: true,
//                                                                             color: 'rgba(255, 255, 255, 0.05)'
//                                                                         },
//                                                                         ticks: {
//                                                                             display: true,
//                                                                             color: 'rgba(255, 255, 255, 0.7)',
//                                                                             font: {
//                                                                                 size: 10
//                                                                             },
//                                                                             maxRotation: 45,
//                                                                             minRotation: 45
//                                                                         }
//                                                                     },
//                                                                     y: {
//                                                                         stacked: true,
//                                                                         grid: {
//                                                                             display: true,
//                                                                             color: 'rgba(255, 255, 255, 0.05)'
//                                                                         },
//                                                                         ticks: {
//                                                                             display: true,
//                                                                             color: 'rgba(255, 255, 255, 0.7)',
//                                                                             font: {
//                                                                                 size: 10
//                                                                             },
//                                                                             callback: function(value) {
//                                                                                 return value.toLocaleString();
//                                                                             }
//                                                                         }
//                                                                     }
//                                                                 }
//                                                             }}
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </motion.div>
//                                         </div>
//                                     </div> */}
//                                 </div>
//                             </div>
//                         </motion.div>

//                         {/* Side #3 */}
//                         <motion.div
//                             variants={itemVariants}
//                             className="flex flex-col gap-2 h-full"
//                         >
//                             {/* Section 3.1 Sectors Data */}
//                             <div className="flex flex-col gap-2 flex-1">
//                                 <div className="relative h-full overflow-hidden">
//                                     <AnimatePresence mode="popLayout">
//                                         <motion.div
//                                             className="absolute inset-0 flex flex-col"
//                                             initial="hidden"
//                                             animate="visible"
//                                             exit="exit"
//                                             variants={scrollVariants}
//                                         >
//                                             {/* Top 4 Sectors */}
//                                             {allSectors
//                                                 .sort((a, b) => b.total - a.total)
//                                                 .slice(0, 4)
//                                                 .map((sector, index) => (
//                                                     <motion.div 
//                                                         key={index} 
//                                                         className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-2 transition-all duration-300 mb-2 relative overflow-hidden hover:shadow-xl"
//                                                         initial={{ x: 20, opacity: 0 }}
//                                                         animate={{ x: 0, opacity: 1 }}
//                                                         transition={{ delay: index * 0.05 }}
//                                                         whileHover={{ scale: 1.02 }}
//                                                     >
//                                                         <div className="flex justify-between items-center gap-2 ">
                                                           
//                                                              {/* Name and Classifications */}
//                                                              <div className="flex flex-col items-center ml-2">
//                                                                 <span className="text-xs font-semibold text-gray-100 mb-1">{sector.name}</span>
//                                                                 <div className="flex gap-1.5 text-xs text-gray-300">
//                                                                     {sector.classifications.map((cls, clsIndex) => (
//                                                                         <div key={clsIndex} className="flex items-center gap-0.5">
//                                                                             <div className={`w-1 h-1 rounded-full ${
//                                                                                 cls.type === AnalysisClassifyEnum.POSITIVE ? 'bg-green-500' :
//                                                                                 cls.type === AnalysisClassifyEnum.NEUTRAL ? 'bg-blue-500' :
//                                                                                 'bg-red-500'
//                                                                             }`} />
//                                                                             <span className={`${
//                                                                                 cls.type === AnalysisClassifyEnum.POSITIVE ? 'text-green-500' : 
//                                                                                 cls.type === AnalysisClassifyEnum.NEUTRAL ? 'text-blue-500' : 
//                                                                                 'text-red-500'
//                                                                             }`}>
//                                                                                 {cls.count}
//                                                                             </span>
//                                                                         </div>
//                                                                     ))}
//                                                                 </div>
//                                                             </div>

//                                                             {/* Chart */}
//                                                             <div className="flex-grow h-14 w-20">
//                                                                 {isMounted && (
//                                                                     <Line 
//                                                                         data={{
//                                                                             labels: ['إيجابي', 'محايد', 'سلبي'],
//                                                                             datasets: [{
//                                                                                 data: sector.classifications.map(c => c.count),
//                                                                                 borderColor: handleClassificationsBigColor(sector) === 'green-500' ? 'rgba(34, 197, 94, 1)' :
//                                                                                            handleClassificationsBigColor(sector) === 'blue-500' ? 'rgba(59, 130, 246, 1)' :
//                                                                                            'rgba(239, 68, 68, 1)',
//                                                                                 backgroundColor: handleClassificationsBigColor(sector) === 'green-500' ? 'rgba(34, 197, 94, 0.1)' :
//                                                                                                handleClassificationsBigColor(sector) === 'blue-500' ? 'rgba(59, 130, 246, 0.1)' :
//                                                                                                'rgba(239, 68, 68, 0.1)',
//                                                                                 borderWidth: 2,
//                                                                                 tension: 0.4,
//                                                                                 fill: true,
//                                                                                 pointBackgroundColor: handleClassificationsBigColor(sector) === 'green-500' ? 'rgba(34, 197, 94, 1)' :
//                                                                                                      handleClassificationsBigColor(sector) === 'blue-500' ? 'rgba(59, 130, 246, 1)' :
//                                                                                                      'rgba(239, 68, 68, 1)',
//                                                                                 pointBorderColor: '#fff',
//                                                                                 pointBorderWidth: 1,
//                                                                                 pointRadius: 2,
//                                                                                 pointHoverRadius: 4
//                                                                             }]
//                                                                         }}
//                                                                         options={{
//                                                                             responsive: true,
//                                                                             maintainAspectRatio: false,
//                                                                             plugins: {
//                                                                                 legend: { display: false },
//                                                                                 tooltip: {
//                                                                                     backgroundColor: 'rgba(17, 24, 39, 0.9)',
//                                                                                     titleColor: '#fff',
//                                                                                     bodyColor: '#fff',
//                                                                                     borderColor: 'rgba(255, 255, 255, 0.1)',
//                                                                                     borderWidth: 1,
//                                                                                     padding: 8,
//                                                                                     displayColors: true,
//                                                                                     usePointStyle: true,
//                                                                                     callbacks: {
//                                                                                         label: function(context) {
//                                                                                             const label = context.label || '';
//                                                                                             const value = context.raw;
//                                                                                             return `${label}: ${value}`;
//                                                                                         }
//                                                                                     }
//                                                                                 }
//                                                                             },
//                                                                             scales: {
//                                                                                 x: { 
//                                                                                     display: true,
//                                                                                     grid: {
//                                                                                         display: true,
//                                                                                         color: 'rgba(255, 255, 255, 0.05)',
//                                                                                         drawBorder: false
//                                                                                     },
//                                                                                     ticks: {
//                                                                                         display: true,
//                                                                                         color: 'rgba(156, 163, 175, 0.8)',
//                                                                                         font: {
//                                                                                             size: 8,
//                                                                                             family: "'Cairo', sans-serif"
//                                                                                         },
//                                                                                         maxRotation: 0,
//                                                                                         padding: 2
//                                                                                     },
//                                                                                     border: {
//                                                                                         display: false
//                                                                                     }
//                                                                                 },
//                                                                                 y: { 
//                                                                                     display: true,
//                                                                                     grid: {
//                                                                                         display: true,
//                                                                                         color: 'rgba(255, 255, 255, 0.05)',
//                                                                                         drawBorder: false
//                                                                                     },
//                                                                                     ticks: {
//                                                                                         display: true,
//                                                                                         color: 'rgba(156, 163, 175, 0.8)',
//                                                                                         font: {
//                                                                                             size: 8,
//                                                                                             family: "'Cairo', sans-serif"
//                                                                                         },
//                                                                                         padding: 2,
//                                                                                         callback: function(value) {
//                                                                                             return value === 0 ? '' : value;
//                                                                                         }
//                                                                                     },
//                                                                                     border: {
//                                                                                         display: false
//                                                                                     },
//                                                                                     beginAtZero: true
//                                                                                 }
//                                                                             },
//                                                                             elements: {
//                                                                                 line: {
//                                                                                     tension: 0.4
//                                                                                 },
//                                                                                 point: {
//                                                                                     radius: 2,
//                                                                                     hoverRadius: 4
//                                                                                 }
//                                                                             },
//                                                                             animation: {
//                                                                                 duration: 1000,
//                                                                                 easing: 'easeInOutQuart'
//                                                                             }
//                                                                         }}
//                                                                     />
//                                                                 )}
//                                                             </div>

//                                                             {/* Total Count */}
//                                                             {/* <div className={`h-10 w-10 flex flex-col justify-center items-center rounded-full border-2 border-${handleClassificationsBigColor(sector)} bg-${handleClassificationsBigColor(sector)}/10 ml-2`}>
//                                                                 <p className={`text-base font-semibold text-${handleClassificationsBigColor(sector)}`}>
//                                                                     {sector.total}
//                                                                 </p>
//                                                             </div> */}

                                                           
//                                                         </div>
//                                                     </motion.div>
//                                                 ))}

//                                             {/* Other Sectors Card */}
//                                             {allSectors.length > 4 && (
//                                                 <motion.div 
//                                                     className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-2 transition-all duration-300"
//                                                     initial={{ x: 20, opacity: 0 }}
//                                                     animate={{ x: 0, opacity: 1 }}
//                                                     transition={{ delay: 0.2 }}
//                                                     whileHover={{ scale: 1.02 }}
//                                                 >
//                                                     <div className="flex justify-between items-center mb-1.5">
//                                                         <h3 className="text-xs font-semibold text-gray-300 flex items-center gap-1">
//                                                             <BarChart className="w-3 h-3 text-blue-400" />
//                                                             القطاعات الأخرى
//                                                         </h3>
//                                                         <span className="text-xs text-gray-400 bg-gray-700/50 px-1.5 py-0.5 rounded-full">
//                                                             {allSectors.length - 4} قطاعات
//                                                         </span>
//                                                     </div>
//                                                     <div className="grid grid-cols-2 gap-1.5">
//                                                         {allSectors
//                                                             .sort((a, b) => b.total - a.total)
//                                                             .slice(4)
//                                                             .map((sector, index) => (
//                                                                 <motion.div
//                                                                     key={index}
//                                                                     className="bg-gray-700/30 backdrop-blur-sm p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
//                                                                     initial={{ opacity: 0 }}
//                                                                     animate={{ opacity: 1 }}
//                                                                     transition={{ delay: index * 0.1 }}
//                                                                     whileHover={{ scale: 1.02 }}
//                                                                 >
//                                                                     <div className="flex justify-between items-center">
//                                                                         <span className="text-xs font-medium text-gray-300">{sector.name}</span>
//                                                                         <div className="flex gap-1">
//                                                                             {sector.classifications.map((cls, clsIndex) => (
//                                                                                 <div key={clsIndex} className="flex items-center gap-0.5">
//                                                                                     <div className={`w-1 h-1 rounded-full ${
//                                                                                         cls.type === AnalysisClassifyEnum.POSITIVE ? 'bg-green-500' :
//                                                                                         cls.type === AnalysisClassifyEnum.NEUTRAL ? 'bg-blue-500' :
//                                                                                         'bg-red-500'
//                                                                                     }`} />
//                                                                                     <span className="text-xs text-gray-400">{cls.count}</span>
//                                                                                 </div>
//                                                                             ))}
//                                                                         </div>
//                                                                     </div>
//                                                                 </motion.div>
//                                                             ))}
//                                                     </div>
//                                                 </motion.div>
//                                             )}
//                                         </motion.div>
//                                     </AnimatePresence>
//                                 </div>
//                             </div>

//                             {/* Section 3.2 Publishers Data */}
//                             <div className="bg-gray-900  transition-all duration-300 flex-1">
//                                 <div className="flex flex-col gap-1 h-full">
//                                     {/* Section 3.2.1 Top Accounts by Engagement Section */}
//                                     <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-2 hover:shadow-xl transition-all duration-300 flex-1 flex flex-col overflow-hidden">
//                                         <div className="flex items-center justify-between mb-2">
//                                             <div className="flex gap-1 items-center">
//                                                 <button 
//                                                     onClick={togglePublishersAnimation}
//                                                     className="p-1 rounded-full hover:bg-gray-700 transition-colors"
//                                                 >
//                                                     {isPublishersAnimating ? (
//                                                         <Pause className="h-4 w-4 text-gray-300" />
//                                                     ) : (
//                                                         <Play className="h-4 w-4 text-gray-300" />
//                                                     )}
//                                                 </button>
//                                                 <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1">
//                                                     <TrendingUp className="w-5 h-5" />
//                                                     أعلى التفاعلات
//                                                 </h3>
//                                             </div>
//                                         </div>
//                                         <div className="relative flex-1 overflow-hidden">
//                                             <motion.div
//                                                 className="absolute inset-0 flex"
//                                                 variants={createPublisherTickerVariants()}
//                                                 animate={!isPublishersAnimating ? "pause" : "animate"}
//                                             >
//                                                 <div className="flex gap-2">
//                                                     {/* Top Reactions */}
//                                                     {allPublishers
//                                                         .sort((a, b) => (b.reactions || 0) - (a.reactions || 0))
//                                                         .slice(0, 1)
//                                                         .map((publisher, index) => (
//                                                             <motion.div 
//                                                                 key={`reactions-${index}`} 
//                                                                 className="bg-gray-700/50 p-2 rounded-md w-fit min-w-[200px]"
//                                                                 initial={{ x: 20, opacity: 0 }}
//                                                                 animate={{ x: 0, opacity: 1 }}
//                                                                 transition={{ delay: index * 0.1 }}
//                                                                 whileHover={{ scale: 1.02 }}
//                                                             >
//                                                                 <div className="flex items-center gap-2">
//                                                                     {publisher.avatar ? 
//                                                                         <Image 
//                                                                             src={publisher.avatar}
//                                                                             alt={publisher.name?.charAt(0)}
//                                                                             width={40}
//                                                                             height={40}
//                                                                             className="rounded-full w-8 h-8 bg-gray-600"
//                                                                         /> :
//                                                                         <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
//                                                                             {publisher.name?.charAt(0) || '?'}
//                                                                         </div>
//                                                                     }
//                                                                     <div className="flex flex-col">
//                                                                         <span className="text-xs font-medium text-gray-300">
//                                                                             {publisher.name}
//                                                                         </span>
//                                                                         <div className="flex items-center gap-1 text-xs text-gray-400">
//                                                                             <Heart className="w-3 h-3" />
//                                                                             {publisher.reactions?.toLocaleString() || 0}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </motion.div>
//                                                         ))}

//                                                     {/* Top Comments */}
//                                                     {allPublishers
//                                                         .sort((a, b) => (b.comments || 0) - (a.comments || 0))
//                                                         .slice(0, 1)
//                                                         .map((publisher, index) => (
//                                                             <motion.div 
//                                                                 key={`comments-${index}`} 
//                                                                 className="bg-gray-700/50 p-2 rounded-md w-fit min-w-[200px]"
//                                                                 initial={{ x: 20, opacity: 0 }}
//                                                                 animate={{ x: 0, opacity: 1 }}
//                                                                 transition={{ delay: index * 0.1 }}
//                                                                 whileHover={{ scale: 1.02 }}
//                                                             >
//                                                                 <div className="flex items-center gap-2">
//                                                                     {publisher.avatar ? 
//                                                                         <Image 
//                                                                             src={publisher.avatar}
//                                                                             alt={publisher.name?.charAt(0)}
//                                                                             width={40}
//                                                                             height={40}
//                                                                             className="rounded-full w-8 h-8 bg-gray-600"
//                                                                         /> :
//                                                                         <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
//                                                                             {publisher.name?.charAt(0) || '?'}
//                                                                         </div>
//                                                                     }
//                                                                     <div className="flex flex-col">
//                                                                         <span className="text-xs font-medium text-gray-300">
//                                                                             {publisher.name}
//                                                                         </span>
//                                                                         <div className="flex items-center gap-1 text-xs text-gray-400">
//                                                                             <MessageCircle className="w-3 h-3" />
//                                                                             {publisher.comments?.toLocaleString() || 0}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </motion.div>
//                                                         ))}

//                                                     {/* Top Shares */}
//                                                     {allPublishers
//                                                         .sort((a, b) => (b.shares || 0) - (a.shares || 0))
//                                                         .slice(0, 1)
//                                                         .map((publisher, index) => (
//                                                             <motion.div 
//                                                                 key={`shares-${index}`} 
//                                                                 className="bg-gray-700/50 p-2 rounded-md w-fit min-w-[200px]"
//                                                                 initial={{ x: 20, opacity: 0 }}
//                                                                 animate={{ x: 0, opacity: 1 }}
//                                                                 transition={{ delay: index * 0.1 }}
//                                                                 whileHover={{ scale: 1.02 }}
//                                                             >
//                                                                 <div className="flex items-center gap-2">
//                                                                     {publisher.avatar ? 
//                                                                         <Image 
//                                                                             src={publisher.avatar}
//                                                                             alt={publisher.name?.charAt(0)}
//                                                                             width={40}
//                                                                             height={40}
//                                                                             className="rounded-full w-8 h-8 bg-gray-600"
//                                                                         /> :
//                                                                         <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
//                                                                             {publisher.name?.charAt(0) || '?'}
//                                                                         </div>
//                                                                     }
//                                                                     <div className="flex flex-col">
//                                                                         <span className="text-xs font-medium text-gray-300">
//                                                                             {publisher.name}
//                                                                         </span>
//                                                                         <div className="flex items-center gap-1 text-xs text-gray-400">
//                                                                             <Share2 className="w-3 h-3" />
//                                                                             {publisher.shares?.toLocaleString() || 0}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </motion.div>
//                                                         ))}

//                                                     {/* Top Appearance */}
//                                                     {allPublishers
//                                                         .sort((a, b) => (b.appearance || 0) - (a.appearance || 0))
//                                                         .slice(0, 1)
//                                                         .map((publisher, index) => (
//                                                             <motion.div 
//                                                                 key={`appearance-${index}`} 
//                                                                 className="bg-gray-700/50 p-2 rounded-md w-fit min-w-[200px]"
//                                                                 initial={{ x: 20, opacity: 0 }}
//                                                                 animate={{ x: 0, opacity: 1 }}
//                                                                 transition={{ delay: index * 0.1 }}
//                                                                 whileHover={{ scale: 1.02 }}
//                                                             >
//                                                                 <div className="flex items-center gap-2">
//                                                                     {publisher.avatar ? 
//                                                                         <Image 
//                                                                             src={publisher.avatar}
//                                                                             alt={publisher.name?.charAt(0)}
//                                                                             width={40}
//                                                                             height={40}
//                                                                             className="rounded-full w-8 h-8 bg-gray-600"
//                                                                         /> :
//                                                                         <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
//                                                                             {publisher.name?.charAt(0) || '?'}
//                                                                         </div>
//                                                                     }
//                                                                     <div className="flex flex-col">
//                                                                         <span className="text-xs font-medium text-gray-300">
//                                                                             {publisher.name}
//                                                                         </span>
//                                                                         <div className="flex items-center gap-1 text-xs text-gray-400">
//                                                                             <BarChart className="w-3 h-3" />
//                                                                             {publisher.appearance?.toLocaleString() || 0}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </motion.div>
//                                                         ))}

//                                                     {/* Top Views */}
//                                                     {allPublishers
//                                                         .sort((a, b) => (b.views || 0) - (a.views || 0))
//                                                         .slice(0, 1)
//                                                         .map((publisher, index) => (
//                                                             <motion.div 
//                                                                 key={`views-${index}`} 
//                                                                 className="bg-gray-700/50 p-2 rounded-md w-fit min-w-[200px]"
//                                                                 initial={{ x: 20, opacity: 0 }}
//                                                                 animate={{ x: 0, opacity: 1 }}
//                                                                 transition={{ delay: index * 0.1 }}
//                                                                 whileHover={{ scale: 1.02 }}
//                                                             >
//                                                                 <div className="flex items-center gap-2">
//                                                                     {publisher.avatar ? 
//                                                                         <Image 
//                                                                             src={publisher.avatar}
//                                                                             alt={publisher.name?.charAt(0)}
//                                                                             width={40}
//                                                                             height={40}
//                                                                             className="rounded-full w-8 h-8 bg-gray-600"
//                                                                         /> :
//                                                                         <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
//                                                                             {publisher.name?.charAt(0) || '?'}
//                                                                         </div>
//                                                                     }
//                                                                     <div className="flex flex-col">
//                                                                         <span className="text-xs font-medium text-gray-300">
//                                                                             {publisher.name}
//                                                                         </span>
//                                                                         <div className="flex items-center gap-1 text-xs text-gray-400">
//                                                                             <EyeIcon className="w-3 h-3" />
//                                                                             {publisher.views?.toLocaleString() || 0}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </motion.div>
//                                                         ))}
//                                                 </div>
//                                             </motion.div>
//                                         </div>
//                                     </div>

//                                     {/* Section 3.2.2 Top Accounts by Followers Section */}
//                                     <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-2 hover:shadow-xl transition-all duration-300 flex-1 flex flex-col overflow-hidden">
//                                         <div className="flex items-center justify-between mb-2">
//                                             <div className="flex gap-1 items-center">
//                                                 <button 
//                                                     onClick={togglePublishersAnimation}
//                                                     className="p-1 rounded-full hover:bg-gray-700 transition-colors"
//                                                 >
//                                                     {isPublishersAnimating ? (
//                                                         <Pause className="h-4 w-4 text-gray-300" />
//                                                     ) : (
//                                                         <Play className="h-4 w-4 text-gray-300" />
//                                                     )}
//                                                 </button>
//                                                 <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1">
//                                                     <Users className="w-5 h-5" />
//                                                     أعلى المتابعين
//                                                 </h3>
//                                             </div>
//                                         </div>
//                                         <div className="relative flex-1 overflow-hidden">
//                                             <motion.div
//                                                 className="absolute inset-0 flex"
//                                                 variants={createPublisherTickerVariants()}
//                                                 animate={!isPublishersAnimating ? "pause" : "animate"}
//                                             >
//                                                 <div className="flex gap-2">
//                                                     {allPublishers
//                                                         .sort((a, b) => (b.total || 0) - (a.total || 0))
//                                                         .slice(0, 5)
//                                                         .map((publisher, index) => (
//                                                             <motion.div 
//                                                                 key={index} 
//                                                                 className="bg-gray-700/50 p-2 rounded-md w-fit min-w-[200px]"
//                                                                 initial={{ x: 20, opacity: 0 }}
//                                                                 animate={{ x: 0, opacity: 1 }}
//                                                                 transition={{ delay: index * 0.1 }}
//                                                                 whileHover={{ scale: 1.02 }}
//                                                             >
//                                                                 <div className="flex items-center gap-2">
//                                                                     {publisher.avatar ? 
//                                                                         <Image 
//                                                                             src={publisher.avatar}
//                                                                             alt={publisher.name?.charAt(0)}
//                                                                             width={40}
//                                                                             height={40}
//                                                                             className="rounded-full w-8 h-8 bg-gray-600"
//                                                                         /> :
//                                                                         <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
//                                                                             {publisher.name?.charAt(0) || '?'}
//                                                                         </div>
//                                                                     }
//                                                                     <div className="flex flex-col">
//                                                                         <span className="text-xs font-medium text-gray-300">
//                                                                             {publisher.name}
//                                                                         </span>
//                                                                         <div className="flex items-center gap-1 text-xs text-gray-400">
//                                                                             <Users className="w-3 h-3" />
//                                                                             {publisher.total?.toLocaleString() || 0}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </motion.div>
//                                                         ))}
//                                                 </div>
//                                             </motion.div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </motion.div>
//                     </div>
//                 </motion.div>
//             )}
//         </div>
//     );
// };

// export default DashboardLayout;