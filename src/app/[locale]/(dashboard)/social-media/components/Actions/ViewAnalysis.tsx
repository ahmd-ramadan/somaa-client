'use client'

import React, { useState } from 'react';
import { useLocale, useTranslations } from "next-intl";
import { IAnalysis } from "@/interfaces/analysis.types";
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
    Star,
    Users
} from 'lucide-react';
import { formatDate } from '@/utils/formatDateAndTime';
import Link from 'next/link';
import { getPlatformIcon } from '../AllAnalysisTable/components/TableRow';
import UpdateHistory from '@/components/ui/UpdateHistory';

interface ViewAnalysisProps {
    analysis: IAnalysis;
}

const ViewAnalysis = ({ analysis }: ViewAnalysisProps) => {
    const t = useTranslations("SocialMediaPage.AllAnalysisTable");
    const locale = useLocale();

    const [imageError, setImageError] = useState(false);

    return (
        <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4 items-start'>
            <div className="space-y-3 min-w-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="space-y-.5">
                        <h3 className="font-semibold text-primary flex items-center gap-1">
                            {/* <Globe className="w-5 h-5 text-primary" /> */}
                            {t("platform")}
                        </h3>
                        <p className="bg-gray-100 text-primary px-3 py-1 bg-primary/10 rounded-lg">{t(analysis.platform)}</p>
                    </div>

                    <div className="space-y-.5">
                        <h3 className="font-semibold text-primary flex items-center gap-1">
                            {/* <Building2 className="w-5 h-5 text-primary" /> */}
                            {t("sector")}
                        </h3>
                        <p className="bg-gray-100 text-primary px-3 py-1 bg-primary/10 rounded-lg">{analysis.sectorData.name}</p>
                    </div>

                    <div className="space-y-.5">
                        <h3 className="font-semibold text-primary flex items-center gap-1">
                            {/* <Tag className="w-5 h-5 text-primary" /> */}
                            {t("classify")}
                        </h3>
                        <p className="bg-gray-100 text-primary px-3 py-1 bg-primary/10 rounded-lg">{t(analysis.classify)}</p>
                    </div>

                    <div className="space-y-.5">
                        <h3 className="font-semibold text-primary flex items-center gap-1">
                            {/* <Type className="w-5 h-5 text-primary" /> */}
                            {t("contentType")}
                        </h3>
                        <p className="bg-gray-100 text-primary px-3 py-1 bg-primary/10 rounded-lg">{t(analysis.content?.type)}</p>
                    </div>

                    <div className="space-y-.5">
                        <h4 className="font-semibold text-primary flex items-center gap-1">
                            {/* <Calendar className="w-4 h-4" /> */}
                            {t("publishDate")}
                        </h4>
                        <p className="bg-gray-100 text-primary px-3 py-1 bg-primary/10 rounded-lg">{analysis.publishDate ? formatDate({ locale, date: analysis.publishDate as string, withTime: true }) : '—'}</p>
                    </div>

                    <div className="space-y-.5">
                        <h4 className="font-semibold text-primary flex items-center gap-1">
                            {/* <Calendar className="w-4 h-4" /> */}
                            {t("createdAt")}
                        </h4>
                        <p className="bg-gray-100 text-primary px-3 py-1 bg-primary/10 rounded-lg">{formatDate({ locale, date: analysis.createdAt, withTime: true })}</p>
                    </div>

                    <div className="col-span-2 space-y-.5">
                        <h3 className="font-semibold text-primary flex items-center gap-1">
                            {/* <FileText className="w-5 h-5 text-primary" /> */}
                            {t("subAnalysis")}
                        </h3>
                        <p className="bg-gray-100 text-primary px-3 py-1 bg-primary/10 rounded-lg">{analysis.subAnalysisData.body}</p>
                    </div>

                    <div className="col-span-2 space-y-.5">
                        <h3 className="font-semibold text-primary flex items-center gap-1">
                            {t("contentBody")}
                        </h3>
                        <p className="bg-gray-100 text-primary px-3 py-1 bg-primary/10 rounded-lg whitespace-pre-wrap text[8px] h-24 overflow-auto">{analysis.content?.body || '—'}</p>
                    </div>
                </div>

                {
                    analysis.location && (
                        <div className="space-y-1">
                            <h4 className="font-medium text-primary flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-primary" />
                                {t("location")}
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                                {analysis.location.region && (
                                    <div className="bg-gray-100 px-3 py-1 rounded-lg flex justify-between items-center gap-1">
                                        <p className="text-sm text-gray-600">{t("region")}</p>
                                        <p className="text-primary">{analysis.location.region}</p>
                                    </div>
                                )}
                                {analysis.location.city && (
                                    <div className="bg-gray-100 px-3 py-1 rounded-lg flex justify-between items-center gap-1">
                                        <p className="text-sm text-gray-600">{t("city")}</p>
                                        <p className="text-primary">{analysis.location.city}</p>
                                    </div>
                                )}
                                {analysis.location.district && (
                                    <div className="bg-gray-100 px-3 py-1 rounded-lg flex justify-between items-center gap-1">
                                        <p className="text-sm text-gray-600">{t("district")}</p>
                                        <p className="text-primary">{analysis.location.district}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }

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
                                {analysis?.publisher?.avatar && !imageError ? (
                                    <img
                                        src={analysis.publisher.avatar}
                                        onError={() => setImageError(true)}
                                        referrer-policy="no-referrer"
                                        alt="Publisher avatar"
                                        className="h-10 w-10 rounded-md cursor-pointer transition-transform duration-200 group-hover:scale-105 text-xs"
                                    />
                                ) : (
                                    <div className='bg-gray-100 w-10 h-10 flex items-center justify-center rounded-md'>
                                        {getPlatformIcon(analysis.platform)}
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <p className="text-primary">{analysis.publisher?.name}</p>
                                    {analysis.publisher?.handle && (
                                        <p className="text-[10px] text-gray-600">{analysis.publisher.handle}</p>
                                    )}
                                    {typeof analysis.publisher?.followers === 'number' && (
                                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {analysis.publisher.followers.toLocaleString()} {t("followers")}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            {/* <h4 className="font-medium text-primary flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {t("addedBy")}
                            </h4> */}
                            <div className="flex items-center gap-2">
                                {/* <img
                                    src={analysis.addedByData?.avatar?.secure_url || '/logo.png'}
                                    alt="Added By"
                                    // width={30}
                                    // height={30}
                                    referrerpolicy="no-referrer"
                                    className="w-10 h-10 rounded-full"
                                /> */}
                                <CircleUserRound className='w-4 h-4 text-primary' />
                                <p className="text-primary px-3 py-1">{analysis.addedByData?.name}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            {/* <h4 className="font-medium text-primary flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {t("tweetType")}
                            </h4> */}
                            <div className="flex items-center gap-2">
                                {/* <img
                                    src={analysis.addedByData?.avatar?.secure_url || '/logo.png'}
                                    alt="Added By"
                                    // width={30}
                                    // height={30}
                                    referrerpolicy="no-referrer"
                                    className="w-10 h-10 rounded-full"
                                /> */}
                                <Podcast className='w-4 h-4 text-primary' />
                                <p className="text-primary px-3 py-1">{t(analysis.tweetType)}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${analysis.isHighlighted ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Star className={`w-3 h-3 ${analysis.isHighlighted ? 'fill-yellow-500' : ''}`} />
                        {analysis.isHighlighted ? t("highlighted") : t("notHighlighted")}
                    </div>

                    <div className="flex flex-col gap-1">
                        {/* <h3 className="font-semibold text-primary mb-3 flex items-center gap-1">
                            <BarChart2 className="w-4 h-4 text-primary" />
                            {t("statistics")}
                        </h3> */}
                        <div className="grid grid-cols-6 gap-1">
                            <div className="bg-red-100 px-3 py-1 rounded-lg flex items-center justify-between gap-1">
                                <Heart className="w-4 h-4 text-red-500" />
                                <span className="font-medium text-primary">{analysis.statistics.reactions.toLocaleString()}</span>
                            </div>
                            <div className="bg-green-100 px-3 py-1 rounded-lg flex items-center justify-between gap-1">
                                <MessageCircle className="w-4 h-4 text-green-500" />
                                <span className="font-medium text-primary">{analysis.statistics.comments.toLocaleString()}</span>
                            </div>
                            <div className="bg-blue-100 px-3 py-1 rounded-lg flex items-center justify-between gap-1">
                                <Share2 className="w-4 h-4 text-blue-500" />
                                <span className="font-medium text-primary">{analysis.statistics.shares.toLocaleString()}</span>
                            </div>
                            <div className="bg-purple-100 px-3 py-1 rounded-lg flex items-center justify-between gap-1">
                                <Eye className="w-4 h-4 text-purple-500" />
                                <span className="font-medium text-primary">{analysis.statistics.views.toLocaleString()}</span>
                            </div>
                            <div className="bg-orange-100 px-3 py-1 rounded-lg flex items-center justify-between gap-1">
                                <TrendingUp className="w-4 h-4 text-purple-500" />
                                <span className="font-medium text-primary">{analysis.statistics.appearance.toLocaleString()}</span>
                            </div>
                            <div className="bg-indigo-100 px-3 py-1 rounded-lg flex items-center justify-between gap-1">
                                <Calculator className="w-4 h-4 text-purple-500" />
                                <span className="font-medium text-primary">{(analysis.statistics.reactions + analysis.statistics.comments + analysis.statistics.shares + analysis.statistics.views + analysis.statistics.appearance).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <Link
                        href={analysis.url}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        {t("viewOriginalPost")}
                    </Link>
                </div>
            </div >

            <UpdateHistory entityType="analysis" entityId={String(analysis._id)} />
        </div >
    );
};

export default ViewAnalysis; 