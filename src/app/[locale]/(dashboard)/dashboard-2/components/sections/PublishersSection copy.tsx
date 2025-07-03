import { IAnalysis } from "@/interfaces/analysis.types"
import { useEffect, useState } from "react"
import { IDashboardPublisher } from "./types"
import { BarChart, EyeIcon, Heart, MessageCircle, Pause, Play, Share2, TrendingUp, Users } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface IPublishersSectionProps {
    allAnalysis: IAnalysis[]
}
const PublishersSection = ({ allAnalysis }: IPublishersSectionProps) => {

    const [allPublishers, setAllPublishers] = useState<IDashboardPublisher[]>([])
    const [isPublishersAnimating, setIsPublishersAnimating] = useState(true);
    
    useEffect(() => {
        if(allAnalysis) setAllPublishers(derivePublishers(allAnalysis))
    }, [allAnalysis])

    const derivePublishers = (analysisData: IAnalysis[]): IDashboardPublisher[] => {
        const analysisMap = new Map<string, { total: number, avatar: string, handle: string, shares: number, views: number, appearance: number, reactions: number, comments: number  }>();
        for(const { publisher: { name, avatar, handle }, statistics: { shares, views, appearance, reactions, comments }} of analysisData) {
            const totalStatistics = shares + reactions + appearance + views + comments;
            
            if(analysisMap.has(name)) {
                const publisherObject = analysisMap.get(name)!;
                analysisMap.set(name, { 
                    total: publisherObject?.total + totalStatistics, 
                    avatar, 
                    handle: handle as string,
                    comments: publisherObject?.comments + comments,
                    appearance: publisherObject?.appearance + appearance,
                    reactions: publisherObject?.reactions + reactions,
                    shares: publisherObject?.shares + shares,
                    views: publisherObject?.views + views
                })
            } else {
                analysisMap.set(name, { total: totalStatistics, avatar, shares, views, appearance, reactions, comments, handle: handle as  string })
            }
        } 
        
        return Array.from(analysisMap.entries()).map(([name, { total, avatar, shares, views, appearance, reactions, comments }]) => ({ name, avatar, total, shares, views, appearance, reactions, comments }));
    }

    const togglePublishersAnimation = () => {
        setIsPublishersAnimating(!isPublishersAnimating);
    };

    const createPublisherTickerVariants = () => ({
        animate: {
            x: [0, -2000],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                    repeatDelay: 0,
                },
            },
        },
        pause: {
            x: 0,
            transition: {
                duration: 0.5,
            },
        },
    });
    
    return (
        <div className="bg-gray-900  transition-all duration-300 flex-1">
            <div className="flex flex-col gap-1 h-full">
                {/* Section 3.2.1 Top Accounts by Engagement Section */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-2 hover:shadow-xl transition-all duration-300 flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1 items-center">
                            <button 
                                onClick={togglePublishersAnimation}
                                className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                            >
                                {isPublishersAnimating ? (
                                    <Pause className="h-4 w-4 text-gray-300" />
                                ) : (
                                    <Play className="h-4 w-4 text-gray-300" />
                                )}
                            </button>
                            <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                                <TrendingUp className="w-5 h-5" />
                                أعلى التفاعلات
                            </h3>
                        </div>
                    </div>
                    <div className="relative flex-1 overflow-hidden">
                        <motion.div
                            className="absolute inset-0 flex"
                            variants={createPublisherTickerVariants()}
                            animate={!isPublishersAnimating ? "pause" : "animate"}
                        >
                            <div className="flex gap-2">
                                {/* Top Reactions */}
                                {allPublishers
                                    .sort((a, b) => (b.reactions || 0) - (a.reactions || 0))
                                    .slice(0, 1)
                                    .map((publisher, index) => (
                                        <motion.div 
                                            key={`reactions-${index}`} 
                                            className="bg-gray-700/50 p-2 rounded-md w-fit min-w-[200px]"
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className="flex items-center gap-2">
                                                {publisher.avatar ? 
                                                    <img 
                                                        src={publisher.avatar}
                                                        alt={publisher.name?.charAt(0)}
                                                        // width={40}
                                                        // height={40}
                                                        className="rounded-full w-8 h-8 bg-gray-600"
                                                    /> :
                                                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
                                                        {publisher.name?.charAt(0) || '?'}
                                                    </div>
                                                }
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-gray-300">
                                                        {publisher.name}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                                        <Heart className="w-3 h-3" />
                                                        {publisher.reactions?.toLocaleString() || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                {/* Top Comments */}
                                {allPublishers
                                    .sort((a, b) => (b.comments || 0) - (a.comments || 0))
                                    .slice(0, 1)
                                    .map((publisher, index) => (
                                        <motion.div 
                                            key={`comments-${index}`} 
                                            className="bg-gray-700/50 p-2 rounded-md w-fit min-w-[200px]"
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className="flex items-center gap-2">
                                                {publisher.avatar ? 
                                                    <img 
                                                        src={publisher.avatar}
                                                        alt={publisher.name?.charAt(0)}
                                                        // width={40}
                                                        // height={40}
                                                        className="rounded-full w-10 h-10 bg-gray-600"
                                                    /> :
                                                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
                                                        {publisher.name?.charAt(0) || '?'}
                                                    </div>
                                                }
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-gray-300">
                                                        {publisher.name}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                                        <MessageCircle className="w-3 h-3" />
                                                        {publisher.comments?.toLocaleString() || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                {/* Top Shares */}
                                {allPublishers
                                    .sort((a, b) => (b.shares || 0) - (a.shares || 0))
                                    .slice(0, 1)
                                    .map((publisher, index) => (
                                        <motion.div 
                                            key={`shares-${index}`} 
                                            className="bg-gray-700/50 p-2 rounded-md w-fit min-w-[200px]"
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className="flex items-center gap-2">
                                                {publisher.avatar ? 
                                                    <img 
                                                        src={publisher.avatar}
                                                        alt={publisher.name?.charAt(0)}
                                                        // width={40}
                                                        // height={40}
                                                        className="rounded-full w-10 h-10 bg-gray-600"
                                                    /> :
                                                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
                                                        {publisher.name?.charAt(0) || '?'}
                                                    </div>
                                                }
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-gray-300">
                                                        {publisher.name}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                                        <Share2 className="w-3 h-3" />
                                                        {publisher.shares?.toLocaleString() || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                {/* Top Appearance */}
                                {allPublishers
                                    .sort((a, b) => (b.appearance || 0) - (a.appearance || 0))
                                    .slice(0, 1)
                                    .map((publisher, index) => (
                                        <motion.div 
                                            key={`appearance-${index}`} 
                                            className="bg-gray-700/50 p-2 rounded-md w-fit min-w-[200px]"
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className="flex items-center gap-2">
                                                {publisher.avatar ? 
                                                    <img 
                                                        src={publisher.avatar}
                                                        alt={publisher.name?.charAt(0)}
                                                        // width={40}
                                                        // height={40}
                                                        className="rounded-full w-10 h-10 bg-gray-600"
                                                    /> :
                                                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
                                                        {publisher.name?.charAt(0) || '?'}
                                                    </div>
                                                }
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-gray-300">
                                                        {publisher.name}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                                        <BarChart className="w-3 h-3" />
                                                        {publisher.appearance?.toLocaleString() || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                {/* Top Views */}
                                {allPublishers
                                    .sort((a, b) => (b.views || 0) - (a.views || 0))
                                    .slice(0, 1)
                                    .map((publisher, index) => (
                                        <motion.div 
                                            key={`views-${index}`} 
                                            className="bg-gray-700/50 p-2 rounded-md w-fit min-w-[200px]"
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className="flex items-center gap-2">
                                                {publisher.avatar ? 
                                                    <img 
                                                        src={publisher.avatar}
                                                        alt={publisher.name?.charAt(0)}
                                                        // width={40}
                                                        // height={40}
                                                        className="rounded-full h-10 w-10 bg-gray-600"
                                                    /> :
                                                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
                                                        {publisher.name?.charAt(0) || '?'}
                                                    </div>
                                                }
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-gray-300">
                                                        {publisher.name}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                                        <EyeIcon className="w-3 h-3" />
                                                        {publisher.views?.toLocaleString() || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Section 3.2.2 Top Accounts by Followers Section */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-2 hover:shadow-xl transition-all duration-300 flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1 items-center">
                            <button 
                                onClick={togglePublishersAnimation}
                                className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                            >
                                {isPublishersAnimating ? (
                                    <Pause className="h-4 w-4 text-gray-300" />
                                ) : (
                                    <Play className="h-4 w-4 text-gray-300" />
                                )}
                            </button>
                            <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                                <Users className="w-5 h-5" />
                                أعلى المتابعين
                            </h3>
                        </div>
                    </div>
                    <div className="relative flex-1 overflow-hidden">
                        <motion.div
                            className="absolute inset-0 flex"
                            variants={createPublisherTickerVariants()}
                            animate={!isPublishersAnimating ? "pause" : "animate"}
                        >
                            <div className="flex gap-2">
                                {allPublishers
                                    .sort((a, b) => (b.total || 0) - (a.total || 0))
                                    .slice(0, 5)
                                    .map((publisher, index) => (
                                        <motion.div 
                                            key={index} 
                                            className="bg-gray-700/50 p-2 rounded-md w-fit min-w-[200px]"
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className="flex items-center gap-2">
                                                {publisher.avatar ? 
                                                    <img 
                                                        src={publisher.avatar}
                                                        alt={publisher.name?.charAt(0)}
                                                        // width={40}
                                                        // height={40}
                                                        className="rounded-full w-10 h-10 bg-gray-600"
                                                    /> :
                                                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
                                                        {publisher.name?.charAt(0) || '?'}
                                                    </div>
                                                }
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-gray-300">
                                                        {publisher.name}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                                        <Users className="w-3 h-3" />
                                                        {publisher.total?.toLocaleString() || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublishersSection

