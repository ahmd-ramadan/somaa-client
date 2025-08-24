'use client'

import React, { useState } from 'react';
import { useLocale, useTranslations } from "next-intl";
import { 
    MapPin,  
    ExternalLink,
    MessageCircle,
    Share2,
    Heart,
    Eye,
    CircleUserRound,
    Podcast,
    TrendingUp,
    Calculator,
    Bookmark,
    Download,
    Save,
    Share,
    Quote
} from 'lucide-react';
import { formatDate } from '@/utils/formatDateAndTime';
import Link from 'next/link';
import { IMonitorResult } from './types';
import { getPlatformIcon } from './utils';

interface ViewResultProps {
    result: IMonitorResult;
}

const ViewResult = ({ result }: ViewResultProps) => {
    const t = useTranslations("Monitor.keywords.results");
    const locale = useLocale();

    const [imageError, setImageError] = useState(false);

    return (
        <div className='grid grid-cols-1 gap-2'>
            <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <h3 className="font-semibold text-primary flex items-center gap-1">
                            {/* <Globe className="w-5 h-5 text-primary" /> */}
                            {t("platform")}
                        </h3>
                        <p className="text-primary px-3 py-1 bg-primary/10 rounded-lg">{t(result.platform)}</p>
                    </div>

                    <div className="space-y-1">
                        <h4 className="font-semibold text-primary flex items-center gap-1">
                            {/* <Calendar className="w-4 h-4" /> */}
                            {t("createdAt")}
                        </h4>
                        <p className="text-primary px-3 py-1 bg-primary/10 rounded-lg">{formatDate({ locale, date: result.publishAt, withTime: true })}</p>
                    </div>

                    <div className="space-y-1">
                        <h3 className="font-semibold text-primary flex items-center gap-1">
                            {/* <Tag className="w-5 h-5 text-primary" /> */}
                            {t("sentiment")}
                        </h3>
                        <p className="text-primary px-3 py-1 bg-primary/10 rounded-lg">{t(result.sentiment)}</p>
                    </div>
                </div>

                {result.location && (
                    <div className="space-y-1">
                        <h4 className="font-medium text-primary flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            {t("location")}
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                            {result.location.address && (
                                <div className="bg-primary/10 px-3 py-1 rounded-lg flex justify-between items-center gap-1">
                                    {/* <p className="text-sm text-gray-600">{t("region")}</p> */}
                                    <p className="text-primary">{result.location.address}</p>
                                </div>
                            )}
                            {/* {result.location.city && (
                                <div className="bg-primary/10 px-3 py-1 rounded-lg flex justify-between items-center gap-1">
                                    <p className="text-sm text-gray-600">{t("city")}</p>
                                    <p className="text-primary">{result.location.city}</p>
                                </div>
                            )}
                            {result.location.district && (
                                <div className="bg-primary/10 px-3 py-1 rounded-lg flex justify-between items-center gap-1">
                                    <p className="text-sm text-gray-600">{t("district")}</p>
                                    <p className="text-primary">{result.location.district}</p>
                                </div>
                            )} */}
                        </div>
                    </div>
                )}

                <div className="border-t py-2 flex flex-col gap-3">
                    {/* <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary" />
                        {t("additionalInformation")}
                    </h3> */}

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                            {/* <h3 className="font-semibold text-primary flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                {t("publisher")}
                            </h3> */}
                            <div className="flex items-center gap-2">
                                {result?.author?.avatar && !imageError ? (
                                    <img
                                        src={result.author.avatar}
                                        onError={() => setImageError(true)}
                                        alt="Publisher avatar"
                                        className="h-10 w-10 rounded-md cursor-pointer transition-transform duration-200 group-hover:scale-105 text-xs"
                                    />
                                ) : (
                                    <div className='bg-gray-100 w-10 h-10 flex items-center justify-center rounded-md'>
                                        {getPlatformIcon({ platform: result.platform, className: '' })}
                                    </div>
                                )}
                                <p className="text-primary">{result.author?.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        {/* <h3 className="font-semibold text-primary mb-3 flex items-center gap-1">
                            <BarChart2 className="w-4 h-4 text-primary" />
                            {t("interactions?")}
                        </h3> */}
                        <div className="grid grid-cols-6 gap-1">
                            <div className="bg-red-100 px-3 py-1 rounded-lg flex items-center justify-between gap-1">
                                <Heart className="w-4 h-4 text-red-500" />
                                <span className="font-medium text-primary">{(result.interactions?.reactions || 0).toLocaleString()}</span>
                            </div>
                            <div className="bg-green-100 px-3 py-1 rounded-lg flex items-center justify-between gap-1">
                                <MessageCircle className="w-4 h-4 text-green-500" />
                                <span className="font-medium text-primary">{(result.interactions?.comments || 0).toLocaleString()}</span>
                            </div>
                            <div className="bg-blue-100 px-3 py-1 rounded-lg flex items-center justify-between gap-1">
                                <Share2 className="w-4 h-4 text-blue-500" />
                                <span className="font-medium text-primary">{(result.interactions?.shares || 0).toLocaleString()}</span>
                            </div>
                            <div className="bg-purple-100 px-3 py-1 rounded-lg flex items-center justify-between gap-1">
                                <Eye className="w-4 h-4 text-purple-500" />
                                <span className="font-medium text-primary">{(result.interactions?.views || 0).toLocaleString()}</span>
                            </div>
                            <div className="bg-orange-100 px-3 py-1 rounded-lg flex items-center justify-between gap-1">
                                <Bookmark className="w-4 h-4 text-purple-500" />
                                <span className="font-medium text-primary">{(result.interactions?.bookmarks || 0).toLocaleString()}</span>
                            </div>
                            <div className="bg-orange-100 px-3 py-1 rounded-lg flex items-center justify-between gap-1">
                                <Download className="w-4 h-4 text-purple-500" />
                                <span className="font-medium text-primary">{(result.interactions?.downloads || 0).toLocaleString()}</span>
                            </div>
                            <div className="bg-orange-100 px-3 py-1 rounded-lg flex items-center justify-between gap-1">
                                <Save className="w-4 h-4 text-purple-500" />
                                <span className="font-medium text-primary">{(result.interactions?.saves || 0).toLocaleString()}</span>
                            </div>
                            <div className="bg-orange-100 px-3 py-1 rounded-lg flex items-center justify-between gap-1">
                                <Share className="w-4 h-4 text-purple-500" />
                                <span className="font-medium text-primary">{(result.interactions?.retweets || 0).toLocaleString()}</span>
                            </div>
                            <div className="bg-orange-100 px-3 py-1 rounded-lg flex items-center justify-between gap-1">
                                <Quote className="w-4 h-4 text-purple-500" />
                                <span className="font-medium text-primary">{(result.interactions?.quotes || 0).toLocaleString()}</span>
                            </div>
                            <div className="bg-indigo-100 px-3 py-1 rounded-lg flex items-center justify-between gap-1">
                                <Calculator className="w-4 h-4 text-purple-500" />
                                <span className="font-medium text-primary">{((result.interactions?.reactions || 0) + (result.interactions?.comments || 0) + (result.interactions?.shares || 0)).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <Link 
                        href={result.url}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        {t("viewOriginalPost")}
                    </Link>
                </div>
            </div>
            {/* <div>
                <PublisherEmbed result={result}/>
            </div> */}
        </div>
    );
};

export default ViewResult; 