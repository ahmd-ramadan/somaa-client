import { ILocaleParams } from "@/interfaces";
import { TranslationsAr, TranslationsEn } from "@/utils/metaData";
import { Metadata } from "next";
import { ReactNode } from "react";

export const generateMetadata = async( { params: { locale } } : ILocaleParams): Promise<Metadata> => {
    return {
        title: locale === 'en' ? TranslationsEn.addMonitor : TranslationsAr.addMonitor
    } 
}

const AddMonitorLayout = ( { children }: { children: ReactNode }) => {
    return (
        <main className="w-full">
            { children }
        </main>
    );
}

export default AddMonitorLayout;