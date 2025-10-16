import { ILocaleParams } from "@/interfaces";
import { translate } from "@/utils/metaData";
import { Metadata } from "next";
import { ReactNode } from "react";

export const generateMetadata = async( { params: { locale } } : ILocaleParams): Promise<Metadata> => {
    return {
        title: translate({ locale, key: 'socialMedia' })
    } 
}

const SocilMediaLayout = ( { children }: { children: ReactNode }) => {
    return (
        <main className="w-full">
            { children }
        </main>
    );
}

export default SocilMediaLayout;