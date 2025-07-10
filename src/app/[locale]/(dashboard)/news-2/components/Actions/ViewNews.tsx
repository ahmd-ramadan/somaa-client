import React from 'react';
import { useLocale, useTranslations } from "next-intl";
import { 
    Globe, 
    User, 
    Building2, 
    Tag, 
    Calendar,  
    ExternalLink, 
    Info,
    CircleUserRound,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/utils/formatDateAndTime';
import { INews } from '@/interfaces/news.types';

interface ViewNewsProps {
    news: INews;
}

const ViewNews = ({ news }: ViewNewsProps) => {
    const t = useTranslations("NewsPage.AllNewsTable");
    const locale = useLocale();

    return (
        <div className="p-2 space-y-3">
            <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 space-y-1">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        {/* <Globe className="w-5 h-5 text-primary" /> */}
                        {t("title")}
                    </h3>
                    <p className="text-primary bg-primary/10 px-2 py-1 rounded-lg">{news.title}</p>
                </div>

                <div className="space-y-1">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        {/* <Building2 className="w-5 h-5 text-primary" /> */}
                        {t("sector")}
                    </h3>
                    <p className="text-primary bg-primary/10 px-2 py-1 rounded-lg">{news.sectorData.name}</p>
                </div>


                <div className="space-y-1">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        {/* <Tag className="w-5 h-5 text-primary" /> */}
                        {t("geoClassify")}
                    </h3>
                    <p className="text-primary bg-primary/10 px-2 py-1 rounded-lg">{t(news.geoClassify)}</p>
                </div>

                <div className="space-y-1">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        {/* <Tag className="w-5 h-5 text-primary" /> */}
                        {t("adType")}
                    </h3>
                    <p className="text-primary bg-primary/10 px-2 py-1 rounded-lg">{t(news.adType)}</p>
                </div>

                <div className="space-y-1">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        {/* <Tag className="w-5 h-5 text-primary" /> */}
                        {t("pressType")}
                    </h3>
                    <p className="text-primary bg-primary/10 px-2 py-1 rounded-lg">{t(news.pressType)}</p>
                </div>

                <div className="space-y-1">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        {/* <Tag className="w-5 h-5 text-primary" /> */}
                        {t("classify")}
                    </h3>
                    <p className="text-primary bg-primary/10 px-2 py-1 rounded-lg">{t(news.classify)}</p>
                </div>
            </div>

            <div className="border-t pt-4">
                {/* <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    {t("additionalInformation")}
                </h3> */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <h4 className="font-medium text-primary flex items-center gap-2">
                            {/* <Calendar className="w-4 h-4" /> */}
                            {t("createdAt")}
                        </h4>
                        <p className="text-primary bg-primary/10 px-2 py-1 rounded-lg">{formatDate({ locale, date: news.createdAt, withTime: true })}</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-medium text-primary flex items-center gap-2">
                            {/* <User className="w-4 h-4" /> */}
                            {t("addedBy")}
                        </h4>
                        <div className="flex items-center gap-2 bg-primary/10 px-2 py-1 rounded-lg">
                            {/* <img
                                src={news.addedByData?.avatar?.secure_url || '/logo.png'}
                                alt="Added By"
                                // width={30}
                                // height={30}
                                className="w-10 h-10 rounded-full"
                            /> */}
                            <CircleUserRound className='w-4 h-4 text-primary'/>
                            <p className="text-primary">{news.addedByData?.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t pt-4">
                <Link 
                    href={news.url}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    {/* <ExternalLink className="w-4 h-4" /> */}
                    {t("viewOriginalPost")}
                </Link>
            </div>
        </div>
    );
};

export default ViewNews; 