import { AnalysisClassifyEnum, IAnalysis } from "@/interfaces/analysis.types"
import { useEffect, } from "react"
import {  ChevronDown, TrendingUp } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"
import * as React from "react"
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { useRef, useState } from 'react';
import { CarouselApi } from "@/components/ui/carousel.old"
import PublisherEmbed from "./PublisherEmbed"
import { useTranslations } from "next-intl"

declare global {
  interface Window {
    twttr: any;
  }
}

interface IPublishersSectionProps {
    allAnalysis: IAnalysis[]
}

type ITopFivePublishersTypes = 'reactions' | 'comments' | 'appearance' | 'views' | 'shares' | 'followers';

const TOP_FIVE_PUBLISHERS_TYPES: ITopFivePublishersTypes[] = ['reactions', 'comments', 'appearance', 'views', 'shares', 'followers'];

interface ITopFivePublishers extends IAnalysis {
    type: ITopFivePublishersTypes
}

function getPlatform(url: string) {
  if (!url) return null;
  if (url.includes('twitter.com') || url.includes('x.com')) return 'x';
  if (url.includes('facebook.com')) return 'facebook';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('linkedin.com')) return 'linkedin';
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  return 'other';
}

const PublishersSection = ({ allAnalysis }: IPublishersSectionProps) => {
    const t = useTranslations("DashboardPage")

    const [topFivePublishers, setTopFivePublishers] = useState<ITopFivePublishers[]>([])
    const [isPublishersAnimating, setIsPublishersAnimating] = useState(true);
    const [emblaRef, setEmblaRef] = useState<CarouselApi>();
    const [isMounted, setIsMounted] = useState(false);
    const carouselRef = useRef<AliceCarousel | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);      
    const [showPublishersMenu, setShowPublishersrMenu] = useState(false);
    const [twitterReady, setTwitterReady] = useState(false);

    const plugin = useRef(
        Autoplay({
            delay: 4000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
            stopOnFocusIn: true,
            rootNode: (emblaRoot) => emblaRoot.parentElement,
        })
    );

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        if (emblaRef && plugin.current) {
            if (!isPublishersAnimating) {
                plugin.current.stop();
            } else {
                try {
                    plugin.current.play();
                } catch (error) {
                    console.error('Error playing carousel:', error);
                }
            }
        }
    }, [isPublishersAnimating, emblaRef, isMounted]);
    
    useEffect(() => {
        if(allAnalysis) {
            setTopFivePublishers(deriveTopFivePublishers(allAnalysis));
        }
    }, [allAnalysis])

    useEffect(() => {
        if (!document.getElementById("twitter-wjs")) {
            const script = document.createElement("script");
            script.id = "twitter-wjs";
            script.src = "https://platform.twitter.com/widgets.js";
            script.async = true;
            script.setAttribute("charset", "utf-8");
            script.onload = () => setTwitterReady(true);
            document.body.appendChild(script);
        } else {
            setTwitterReady(true);
        }
    }, []);

    useEffect(() => {
        if (twitterReady && window.twttr && window.twttr.widgets) {
            window.twttr.widgets.load();
        }
    }, [twitterReady, topFivePublishers, activeIndex]);

    const deriveTopFivePublishers = (analysisData: IAnalysis[]): ITopFivePublishers[] => {
        let topRecation = null, topComments = null, topShares = null, topViews = null, topAppearence = null, topFollowers = null;

        for (const item of analysisData) {
            if (!topRecation || item.statistics.reactions > topRecation.statistics.reactions) topRecation = item;
            if (!topComments || item.statistics.comments > topComments.statistics.comments) topComments = item;
            if (!topShares || item.statistics.shares > topShares.statistics.shares) topShares = item;
            if (!topViews || item.statistics.views > topViews.statistics.views) topViews = item;
            if (!topAppearence || item.statistics.appearance > topAppearence.statistics.appearance) topAppearence = item;
            if (!topFollowers || item.publisher.followers > topFollowers.publisher.followers) topFollowers = item;
        }

        if (analysisData.length == 0) return [];
    
        return [
            { ...topRecation as IAnalysis, type: 'reactions' },
            { ...topComments as IAnalysis, type: 'comments' },
            { ...topShares as IAnalysis, type: 'shares' },
            { ...topViews as IAnalysis, type: 'views' },
            { ...topAppearence as IAnalysis, type: 'appearance' },
            { ...topFollowers as IAnalysis, type: 'followers' },
        ];
    };

    const getTypeMessage = (type: ITopFivePublishersTypes): string => {
        return TOP_FIVE_PUBLISHERS_TYPES.includes(type) ? t(`${type}Top`) : t("topReactions");
    }

    const TopFivePublishers = topFivePublishers.map((analysis, index) => {
        return (
            <div key={index} className="w-[98%] px-2 flex justify-end flex-col mx-auto gap-1 max-h-[350px] overflow-auto custom-scrollbar">
                <div className="flex items-center gap-1 justify-end">
                    <span className="px-1 rounded-md text-xs bg-blue-500/20 text-blue-300 border border-blue-500/20">{getTypeMessage(analysis.type)}</span>
                    <span className="px-1 rounded-md text-xs bg-blue-500/20 text-blue-300 border border-blue-500/20">{analysis.sectorData.name}</span>
                    <span className={`px-1 rounded-md text-xs ${analysis.classify === AnalysisClassifyEnum.POSITIVE 
                                                    ? 'bg-green-500/20 text-green-400' 
                                                    : analysis.classify === AnalysisClassifyEnum.NEUTRAL 
                                                    ? 'bg-gray-500/20 text-gray-400'
                                                    : 'bg-red-500/20 text-red-400'}`}>{analysis.classify === AnalysisClassifyEnum.POSITIVE 
                                                        ? 'إيجابي' 
                                                        : analysis.classify === AnalysisClassifyEnum.NEUTRAL 
                                                        ? 'محايد'
                                                        : 'سلبي'}</span>
                </div>
                <PublisherEmbed analysis={analysis} />
            </div>
        )
    });

    const handleSlideChange = (e: any) => {
        setActiveIndex(e.slide);
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div className="bg-gray-900 transition-all duration-300 w-3/6">
            <div className="flex flex-col gap-1 h-full">
                {/* Section 3.2.1 Top Accounts by Engagement Section */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-1 hover:shadow-xl transition-all duration-300 flex-1 flex flex-col overflow-hidden">
                    <div className="w-full flex justify-between gap-1 items-center">
                        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                            <TrendingUp className="w-5 h-5 text-blue-300" />
                            {t("topReactions")}
                        </h3>
                        <div className="relative text-white">
                            <button
                                onClick={() => setShowPublishersrMenu(!showPublishersMenu)}
                                className="flex items-center gap-1 bg-gray-700/50 px-2 py-1 rounded text-xs hover:bg-gray-700/70 transition-colors border border-gray-600/50"
                            >
                                <span className="text-xs">{getTypeMessage(topFivePublishers[activeIndex]?.type) || 'الأعلي تفاعل'}</span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${showPublishersMenu ? 'rotate-180' : ''}`} />
                            </button>
                            {showPublishersMenu && (
                                <div className="custom-scrollbar absolute top-full end-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 min-w-[150px] max-h-32 overflow-y-auto">
                                    {topFivePublishers.map((publisher, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setActiveIndex(index);
                                                carouselRef.current?.slideTo(index)
                                                setShowPublishersrMenu(false);
                                            }}
                                            className="w-full text-center px-2 py-1 hover:bg-gray-700/50 transition-colors text-xs border-b border-gray-700/50 last:border-b-0"
                                        >
                                            {getTypeMessage(publisher.type)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative mx-auto w-full h-full mt-1">
                        <AliceCarousel
                            ref={carouselRef}
                            mouseTracking
                            items={TopFivePublishers}
                            autoPlay
                            autoPlayInterval={3000}
                            infinite
                            controlsStrategy="alternate"
                            disableButtonsControls={true}
                            onSlideChanged={handleSlideChange}
                        />
                    </div>
                </div>   
            </div>
        </div>
    )
}

export default PublishersSection
