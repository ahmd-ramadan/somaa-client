import { useLocale } from "next-intl";

const HrOr = () => {
    const locale = useLocale();
    return (
        <div className="w-full flex items-center justify-center">
            <hr className="w-full h-px my-4 bg-gray-300 border-0" />
            <span className="absolute px-3 font-medium text-primary -translate-x-1/2 bg-white left-1/2">{locale === 'en' ? 'or' : 'أو'}</span>
        </div>
    );
}

export default HrOr;