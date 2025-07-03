import React from 'react';
import { useLocale, useTranslations } from "next-intl";
import { IAnalysis } from "@/interfaces/analysis.types";
import { 
    Globe, 
    User, 
    Building2, 
    Tag, 
    FileText, 
    Type, 
    Calendar, 
    MapPin,  
    ExternalLink, 
    BarChart2, 
    Info,
    MessageCircle,
    Share2,
    Heart,
    Eye,
    CircleUserRound
} from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { formatDate } from '@/utils/formatDateAndTime';

interface ViewAnalysisProps {
    analysis: IAnalysis;
}

const ViewAnalysis = ({ analysis }: ViewAnalysisProps) => {
    const t = useTranslations("SocialMediaPage.AllAnalysisTable");
    const locale = useLocale();

    return (
        <div className="p-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        {t("platform")}
                    </h3>
                    <p className="text-primary">{t(analysis.platform)}</p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        {t("publisher")}
                    </h3>
                    <div className="flex items-center gap-2">
                        <img
                            src={analysis.publisher?.avatar || '/logo.png'}
                            alt="Publisher"
                            // width={40}
                            // height={40}
                            className="w-10 h-10 rounded-full"
                        />
                        <p className="text-primary">{analysis.publisher?.name}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        {t("sector")}
                    </h3>
                    <p className="text-primary">{analysis.sectorData.name}</p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <Tag className="w-5 h-5 text-primary" />
                        {t("classify")}
                    </h3>
                    <p className="text-primary">{t(analysis.classify)}</p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        {t("subAnalysis")}
                    </h3>
                    <p className="text-primary">{analysis.subAnalysisData.body}</p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <Type className="w-5 h-5 text-primary" />
                        {t("contentType")}
                    </h3>
                    <p className="text-primary">{t(analysis.content?.type)}</p>
                </div>
            </div>

            {analysis.location && (
                <div className="space-y-2">
                    <h4 className="font-medium text-primary flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {t("location")}
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                        {analysis.location.region && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-500">{t("region")}</p>
                                <p className="text-primary">{analysis.location.region}</p>
                            </div>
                        )}
                        {analysis.location.city && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-500">{t("city")}</p>
                                <p className="text-primary">{analysis.location.city}</p>
                            </div>
                        )}
                        {analysis.location.district && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-500">{t("district")}</p>
                                <p className="text-primary">{analysis.location.district}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="border-t pt-4">
                <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-primary" />
                    {t("statistics")}
                </h3>
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-red-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500" />
                            <span className="font-medium text-primary">{analysis.statistics.reactions.toLocaleString()}</span>
                        </div>
                        {/* <p className="text-sm text-primary">Reactions</p> */}
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-green-500" />
                            <span className="font-medium text-primary">{analysis.statistics.comments.toLocaleString()}</span>
                        </div>
                        {/* <p className="text-sm text-primary">Comments</p> */}
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-blue-500" />
                            <span className="font-medium text-primary">{analysis.statistics.shares.toLocaleString()}</span>
                        </div>
                        {/* <p className="text-sm text-primary">Shares</p> */}
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-purple-500" />
                            <span className="font-medium text-primary">{analysis.statistics.views.toLocaleString()}</span>
                        </div>
                        {/* <p className="text-sm text-primary">Views</p> */}
                    </div>
                </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    {t("additionalInformation")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium text-primary flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {t("createdAt")}
                        </h4>
                        <p className="text-primary">{formatDate({ locale, date: analysis.createdAt, withTime: true })}</p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium text-primary flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {t("addedBy")}
                        </h4>
                        <div className="flex items-center gap-2">
                            {/* <img
                                src={analysis.addedByData?.avatar?.secure_url || '/logo.png'}
                                alt="Added By"
                                // width={30}
                                // height={30}
                                className="w-10 h-10 rounded-full"
                            /> */}
                            <CircleUserRound className='w-4 h-4 text-primary'/>
                            <p className="text-primary">{analysis.addedByData?.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t pt-4">
                <Link 
                    href={analysis.url}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    <ExternalLink className="w-4 h-4" />
                    {t("viewOriginalPost")}
                </Link>
            </div>
        </div>
    );
};

export default ViewAnalysis; 