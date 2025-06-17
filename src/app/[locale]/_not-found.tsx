import { useLocale, useTranslations } from "next-intl"
import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
    const t = useTranslations("ErrorsPages.404");
    const locale = useLocale();
    
    return (
        <div className="flex flex-col lg:flex-row justify-center items-center my-auto gap-6 place-content-center lg:mx-56">
            <div className="relative lg:h-80 lg:w-52 h-40 w-24">
                <Image
                    src={'/not-found.png'}
                    alt="error_image"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="text-center">
                <h1 className="text-9xl font-black text-gray-400">4O4</h1>

                    <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">{ t('title') }</p>

                    <p className="mt-4 text-gray-500">{ t('message') }</p>

                    <Link
                        href={`/${ locale }`}
                        className="mt-6 inline-block rounded bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-secondary focus:outline-none focus:ring"
                    >
                        { t('homeBtn') }
                    </Link>
            </div>
        </div>

    )
}

export default NotFound;