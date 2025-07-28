import { ILocaleParams } from "@/interfaces";
import { translate } from "@/utils/metaData";
import { Metadata } from "next";
import { ReactNode } from "react";

export const generateMetadata = async( { params: { locale } } : ILocaleParams ): Promise<Metadata> => {
    
    return {
        title: translate({ locale, key: 'signup' })
    } 
}

const SignupLayout = ( { children }: { children: ReactNode }) => {
    return (
        <main>
            { children }
        </main>
    );
}

export default SignupLayout;