import { ILocaleParams } from "@/interfaces";
import { getData } from "@/utils/apiService";
import { translate } from "@/utils/metaData";
import { getName } from "@/utils/nameUtils";
import { Metadata } from "next";
import { ReactNode } from "react";

export const generateMetadata = async( { params: { locale } } : ILocaleParams ): Promise<Metadata> => {
    
    return {
        title: translate({ locale, key: 'forgetPassword' })
    } 
}

const ForgetPasswordLayout = ( { children }: { children: ReactNode }) => {
    return (
        <main>
            { children }
        </main>
    );
}

export default ForgetPasswordLayout;