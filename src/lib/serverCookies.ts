import { cookies } from "next/headers"


export const getLocale = () => {   
    const cookieStore = cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || "ar";
    return locale;
}

export const getLastVisitedPage = () => {   
    const cookieStore = cookies();
    const lastVisitedPage = cookieStore.get('lastVisitedPage')?.value || null;
    return lastVisitedPage;
}