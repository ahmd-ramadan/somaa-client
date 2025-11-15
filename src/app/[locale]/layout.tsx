import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from 'react-hot-toast';
import { Noto_Kufi_Arabic } from 'next/font/google';
const kufi = Noto_Kufi_Arabic({ 
    subsets: ['arabic'], 
    weight: ["300", "500", "700", "800", "900"],
    display: 'swap',
    preload: true,
    fallback: ['system-ui', 'arial']
});
import "./globals.css";
import { ReactNode } from 'react';
import Layout from '@/components/MainLayout';
import { ICookiesData, IDecodedToken, ILocaleParams } from '@/interfaces';
import { Metadata } from 'next';
import { metaDataKeywords, metaDataTitle, TranslationsAr, TranslationsEn } from '@/utils/metaData';
import { cookies } from 'next/headers';
import { verifyRefreshToken } from '@/utils/auth';
import StoreProvider from './providers/StoreProvider';


interface IProps {
    children: ReactNode;
    params: { 
        locale: string 
    };
}       

export const generateMetadata = async({ params: { locale } }: ILocaleParams): Promise<Metadata> => {
    // const title = `${translate({ locale, key: 'default' })} ${translate({ locale, key: 'description'})}`;
    const title = metaDataTitle;
    const description = locale === 'en' ? TranslationsEn.description : TranslationsAr.description;
    return {
        title,
        description,
        keywords: metaDataKeywords,
        icons: {
            icon: ['/favicon.ico?v=4'],
            apple: ['/apple-touch-icon.png?v=4'],
            shortcut: ['/apple-touch-icon.png']
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: process.env.NEXT_PUBLIC_DOMAIN,
            images: [{ url: process.env.NEXT_PUBLIC_LOGO || "/logo.png", width: 800, height: 600, alt: 'Image description' }]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [process.env.NEXT_PUBLIC_LOGO || "/logo.png"]
        }
    };
};

const LocaleLayout = async ({ children, params: { locale } }: IProps) => {
    const messages = await getMessages();
    const dir = locale === "en" ? "ltr" : "rtl";

    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('auth-token')?.value;
    const cookiesData: ICookiesData = {
        accessToken,
        refreshToken,
    };
    if (refreshToken) {
        try {
            const decoded: IDecodedToken | null  = await verifyRefreshToken(refreshToken);
            cookiesData.role = decoded?.role || "";
            cookiesData.userId = decoded?.userId || "";
            cookiesData.permissions = decoded?.permissions || [];
            cookiesData.name = decoded?.name || "";
        } catch (error) {
            // Handle error if needed
        }
    }

    // const structuredData = JSON.stringify({
    //     "@context": "https://schema.org",
    //     "@type": "Organization",
    //     "url": process.env.NEXT_PUBLIC_DOMAIN,
    //     "logo": process.env.NEXT_PUBLIC_LOGO || "/logo.png",
    //     "name": process.env.NEXT_PUBLIC_NAME,
    // });

    return (
        <html lang={locale} dir={dir}>
            <body className={kufi.className}>
                <NextIntlClientProvider messages={messages}>
                    <StoreProvider>
                        {/* <NextAuthProvider> */}
                            <Layout cookiesData={cookiesData}>
                                { children }
                            </Layout>
                            <Toaster />
                        {/* </NextAuthProvider> */}
                    </StoreProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

export default LocaleLayout;
