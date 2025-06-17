export function getLocaleFromPath(pathname: string): string {
    return pathname.startsWith('/en') ? 'en' : 'ar';
}
