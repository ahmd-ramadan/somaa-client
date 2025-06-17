import { ILocaleParams } from "@/interfaces";
import { translate } from "@/utils/metaData";
import { Metadata } from "next";
import { ReactNode } from "react";

export const generateMetadata = async( { params: { locale } } : ILocaleParams): Promise<Metadata> => {
    return {
        title: translate({ locale, key: 'admins'})
    } 
}

const AdminsLayout = ( { children }: { children: ReactNode }) => {
    return (
        <main>
            { children }
        </main>
    );
}

export default AdminsLayout;