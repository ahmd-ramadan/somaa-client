import { IAnalysis } from "@/interfaces/analysis.types"
import { useEffect, } from "react"
import { IDashboardPublisher } from "./types"
import { ArrowLeft, ArrowRight, BarChart, EyeIcon, Heart, MessageCircle, Pause, Play, Share2, TrendingUp, Users } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"
import * as React from "react"




import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useLocale } from 'next-intl';

import { useRouter } from 'next/navigation';

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.old"
import { CarouselApi } from "@/components/ui/carousel.old"
import PrevIcon from "@/components/icons/Prev"
import NextIcon from "@/components/icons/Next"


interface IPublishersSectionProps {
    allAnalysis: IAnalysis[]
}

type ITopFivePublishersTypes = 'reactions' | 'comments' | 'appearance' | 'views' | 'shares' | 'followers';

interface ITopFivePublishers {
    type: ITopFivePublishersTypes,
    message: string,
    handle: string,
    count: number,
    avatar: string,
    name: string
}

const PublishersSection = ({ allAnalysis }: IPublishersSectionProps) => {

    const [allPublishers, setAllPublishers] = useState<IDashboardPublisher[]>([])
    const [topFivePublishers, setTopFivePublishers] = useState<ITopFivePublishers[]>([])
    const [topFivePublishersFollowers, setTopFivePublishersFollowers] = useState<ITopFivePublishers[]>([])
    const [isPublishersAnimating, setIsPublishersAnimating] = useState(true);
    const [emblaRef, setEmblaRef] = useState<CarouselApi>();
    const [isMounted, setIsMounted] = useState(false);

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
            setTopFivePublishersFollowers(derivePublishersFollowers(allAnalysis))
            const publishers = derivePublishers(allAnalysis);
            setAllPublishers(publishers);
            deriveTopFivePublishers(publishers);
        }
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
                    handle: handle || "",
                    comments: publisherObject?.comments + comments,
                    appearance: publisherObject?.appearance + appearance,
                    reactions: publisherObject?.reactions + reactions,
                    shares: publisherObject?.shares + shares,
                    views: publisherObject?.views + views
                })
            } else {
                analysisMap.set(name, { total: totalStatistics, avatar, handle: handle || "", shares, views, appearance, reactions, comments })
            }
        } 
        
        return Array.from(analysisMap.entries()).map(([name, { total, avatar, shares, views, appearance, reactions, comments }]) => ({ name, avatar, total, shares, views, appearance, reactions, comments }));
    }

    const derivePublishersFollowers = (analysisData: IAnalysis[]): ITopFivePublishers[] => {
        const topFive = analysisData.sort((a, b)  => b.publisher.followers - a.publisher.followers).slice(0, 5);
        return topFive.map(a => {
            return {

                name: a.publisher.name || "",
                type: 'followers',
                message: 'الأعلي متابعين',
                avatar: a.publisher.avatar || "",
                handle: a.publisher.handle || "",
                count: a.publisher.followers || 0

            }
        })
    }

    const deriveTopFivePublishers = (allPublishers: IDashboardPublisher[]) => {
        console.log('Deriving top publishers from:', allPublishers);
        
        // Create a single array of top publishers
        const topPublishers = [
            {
                type: 'reactions' as const,
                getValue: (p: IDashboardPublisher) => p.reactions || 0,
                message: 'الأعلي إعجاب'
            },
            {
                type: 'comments' as const,
                getValue: (p: IDashboardPublisher) => p.comments || 0,
                message: 'الأعلي تعليق'
            },
            {
                type: 'shares' as const,
                getValue: (p: IDashboardPublisher) => p.shares || 0,
                message: 'الأعلي مشاركة'
            },
            {
                type: 'views' as const,
                getValue: (p: IDashboardPublisher) => p.views || 0,
                message: 'الأعلي مشاهدة'
            },
            {
                type: 'appearance' as const,
                getValue: (p: IDashboardPublisher) => p.appearance || 0,
                message: 'الأعلي ظهور'
            },
            {
                type: 'followers' as const,
                getValue: (p: IDashboardPublisher) => p.total || 0,
                message: 'الأعلي متابعة'
            }
        ].map(({ type, getValue, message }) => {
            const topPublisher = allPublishers
                .sort((a, b) => getValue(b) - getValue(a))[0];

            if (!topPublisher) return null;

            return {
                count: getValue(topPublisher),
                message,
                type,
                name: topPublisher.name,
                avatar: topPublisher.avatar || "",
                handle: topPublisher.handle || ""
            };
        }).filter((publisher): publisher is ITopFivePublishers => publisher !== null);

        console.log('Setting top publishers:', topPublishers);
        setTopFivePublishers(topPublishers);
    }

    const locale= useLocale();
    const carouselRef = useRef<AliceCarousel | null>(null);
    const carouselRef2 = useRef<AliceCarousel | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeIndex2, setActiveIndex2] = useState(0);


    const TopFivePublishers = topFivePublishers.map(({ avatar, name, type, handle, message, count }, index) => (
        <div className="p-1 w-full" dir={locale === 'ar' ? 'rtl' : 'ltr'} key={index}>
            <Card className="bg-gray-800/50 border-gray-700/50 w-full">
                <CardContent className="flex items-center p-4 justify-between gap-3 w-full">
                    <div className="flex items-center gap-2">
                        <div className="relative w-12 h-12">
                            <Image
                                src={avatar || "/logo.png"}
                                alt={name}
                                fill
                                className="object-cover rounded-full"
                            />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-100">{name}</h4>
                            <p className="text-xs text-gray-400">@{handle}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                        <div className="flex items-center gap-1">
                            {type === 'reactions' && <Heart className="w-4 h-4 text-green-600" />}
                            {type === 'comments' && <MessageCircle className="w-4 h-4 text-green-600" />}
                            {type === 'shares' && <Share2 className="w-4 h-4 text-green-500" />}
                            {type === 'views' && <EyeIcon className="w-4 h-4 text-green-600" />}
                            {type === 'appearance' && <BarChart className="w-4 h-4 text-green-600" />}
                            <span className="text-sm font-medium text-gray-300">{count}</span>
                        </div>
                        <span className="text-xs px-2 rounded-md bg-green-200 text-green-600">
                            {message}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    ));

    const TopFivePublishersFollowers = topFivePublishersFollowers.map(({ avatar, name, type, handle, message, count }, index) => (
        <div className="p-1 w-full" dir={locale === 'ar' ? 'rtl' : 'ltr'} key={index}>
            <Card className="bg-gray-800/50 border-gray-700/50 w-full">
                <CardContent className="flex items-center p-4 justify-between gap-3 w-full">
                    <div className="flex items-center gap-2">
                        <div className="relative w-12 h-12">
                            <Image
                                src={avatar || "/logo.png"}
                                alt={name}
                                fill
                                className="object-cover rounded-full"
                            />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-100">{name}</h4>
                            <p className="text-xs text-gray-400">@{handle}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                        <div className="flex items-center gap-1">
                            {type === 'followers' && <Users className="w-4 h-4 text-green-600" />}    
                            <span className="text-sm font-medium text-gray-300">{count}</span>
                        </div>
                        <span className="text-xs px-2 rounded-md bg-green-200 text-green-600">
                            {message}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    ));

    const handleSlideChange = (e: any) => {
        setActiveIndex(e.slide);
    };

    const handleSlide2Change = (e: any) => {
        setActiveIndex2(e.slide);
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div className="bg-gray-900  transition-all duration-300 flex-1">
            <div className="flex flex-col gap-1 h-full">
                {/* Section 3.2.1 Top Accounts by Engagement Section */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-2 hover:shadow-xl transition-all duration-300 flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1 items-center">
                            {/* <button 
                                onClick={togglePublishersAnimation}
                                className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                            >
                                {isPublishersAnimating ? (
                                    <Pause className="h-4 w-4 text-gray-300" />
                                ) : (
                                    <Play className="h-4 w-4 text-gray-300" />
                                )}
                            </button> */}
                            <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                                <TrendingUp className="w-5 h-5" />
                                أعلى التفاعلات
                            </h3>
                        </div>
                    </div>
                   
                    <div className="relative mx-auto w-full">
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

                        {/* Custom navigation buttons */}
                        { locale === 'ar' ?
                            <>
                                <ArrowRight 
                                    width="20px" 
                                    height="20px" 
                                    onClick={() => carouselRef.current?.slidePrev()}
                                    className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-100 -left-8 transition hidden lg:block absolute top-1/2 transform -translate-y-1/2"
                                />
                                <ArrowLeft
                                    width="20px"
                                    height="20px"
                                    onClick={() => carouselRef.current?.slideNext()}
                                    className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-100 -right-8 transition hidden md:block absolute top-1/2 transform -translate-y-1/2"
                                />
                            </>
                            : 
                            <>
                                <ArrowLeft 
                                    width="20px" 
                                    height="20px" 
                                    onClick={() => carouselRef.current?.slidePrev()}
                                    className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-100 -right-8 transition hidden lg:block absolute top-1/2 transform -translate-y-1/2"
                                    />
                                <ArrowRight
                                    width="20px"
                                    height="20px"
                                    onClick={() => carouselRef.current?.slideNext()}
                                    className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-100 -left-8 transition hidden md:block absolute top-1/2 transform -translate-y-1/2"
                                />
                            </>
                        }

                        {/* Custom dots overlayed on images */}
                        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {topFivePublishers.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-3 h-3 rounded-full ${activeIndex === index ? 'bg-green-600' : 'bg-white opacity-50'} hover:opacity-100 transition`}
                                    onClick={() => carouselRef.current?.slideTo(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 3.2.2 Top Accounts by Followers Section */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-2 hover:shadow-xl transition-all duration-300 flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1 items-center">
                            {/* <button 
                                onClick={togglePublishersAnimation}
                                className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                            >
                                {isPublishersAnimating ? (
                                    <Pause className="h-4 w-4 text-gray-300" />
                                ) : (
                                    <Play className="h-4 w-4 text-gray-300" />
                                )}
                            </button> */}
                            <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                                <Users className="w-5 h-5" />
                                أعلى المتابعين
                            </h3>
                        </div>
                    </div>
                    <div className="relative mx-auto w-full">
                        <AliceCarousel
                            ref={carouselRef2}
                            mouseTracking
                            items={TopFivePublishersFollowers}
                            autoPlay
                            autoPlayInterval={3000}
                            infinite
                            controlsStrategy="alternate"
                            disableButtonsControls={true}
                            onSlideChanged={handleSlide2Change}
                        />

                        {/* Custom navigation buttons */}
                        { locale === 'ar' ?
                            <>
                                <ArrowRight 
                                    width="20px" 
                                    height="20px" 
                                    onClick={() => carouselRef2.current?.slidePrev()}
                                    className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-100 -left-8 transition hidden lg:block absolute top-1/2 transform -translate-y-1/2"
                                />
                                <ArrowLeft
                                    width="20px"
                                    height="20px"
                                    onClick={() => carouselRef2.current?.slideNext()}
                                    className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-100 -right-8 transition hidden md:block absolute top-1/2 transform -translate-y-1/2"
                                />
                            </>
                            : 
                            <>
                                <ArrowLeft 
                                    width="20px" 
                                    height="20px" 
                                    onClick={() => carouselRef2.current?.slidePrev()}
                                    className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-100 -right-8 transition hidden lg:block absolute top-1/2 transform -translate-y-1/2"
                                    />
                                <ArrowRight
                                    width="20px"
                                    height="20px"
                                    onClick={() => carouselRef2.current?.slideNext()}
                                    className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-100 -left-8 transition hidden md:block absolute top-1/2 transform -translate-y-1/2"
                                />
                            </>
                        }

                        {/* Custom dots overlayed on images */}
                        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {TopFivePublishersFollowers.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-3 h-3 rounded-full ${activeIndex2 === index ? 'bg-green-600' : 'bg-white opacity-50'} hover:opacity-100 transition`}
                                    onClick={() => carouselRef2.current?.slideTo(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublishersSection