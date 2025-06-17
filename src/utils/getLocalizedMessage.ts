export const getLocalizedMessage = ({
    locale,
    msgAr,
    msgEn,
    msg
}: {
    locale: string;
    msgEn: string;
    msgAr: string;
    msg: string;
}): string => {
    return locale === 'ar' ? msgAr : msgEn || msg || '';  
}