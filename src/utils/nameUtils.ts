import { ItemName } from "@/interfaces";

export const getName = ({ locale, name }: { locale: string; name: ItemName }) => {
    return name ? name[locale === 'en' ? 'en' : 'ar'] : "";
}