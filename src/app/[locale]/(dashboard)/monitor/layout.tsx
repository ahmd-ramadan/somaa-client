import { ILocaleParams } from "@/interfaces";
import { TranslationsAr, TranslationsEn } from "@/utils/metaData";
import { Metadata } from "next";
import { ReactNode } from "react";

export const generateMetadata = async( { params: { locale } } : ILocaleParams): Promise<Metadata> => {
    return {
        title: locale === 'en' ? TranslationsEn.liveMonitoring : TranslationsAr.liveMonitoring
    } 
}

const MonitorLayout = ( { children }: { children: ReactNode }) => {
    return (
        <main>
            { children }
        </main>
    );
}

export default MonitorLayout;