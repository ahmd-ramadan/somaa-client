'use client'

import NotAuthIcon from "@/components/icons/NotAuth";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

const NotAuthorizedPage = () => {
    const locale = useLocale();
    const t = useTranslations("NotAuthorizedPage");

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center px-4">
            <NotAuthIcon width="300px" height="300px" />

            <div className="flex flex-col items-center justify-center gap-6">
                <p className="text-2xl font-bold tracking-tight text-red-600 sm:text-4xl text-center">{t('headMsg')}</p>
                <p className="font-bold tracking-tight text-gray-800 text-lg sm:text-4xl text-center">{t('msg')}</p>

                <div className="mt-6 w-full sm:w-1/2 lg:w-1/3 grid grid-cols-2 gap-4">
                    <Link
                        href={`/${locale}`}
                        className="rounded text-center bg-primary px-8 py-3 text-sm font-medium text-white opacity-80 hover:opacity-100 focus:outline-none focus:ring"
                    >
                        {t('homePageBtn')}
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="rounded text-center bg-gray-300 px-8 py-3 text-sm font-medium text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring"
                    >
                        {t('prevPageBtn')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotAuthorizedPage;
