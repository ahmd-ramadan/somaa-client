import { ILocale } from "@/interfaces";
import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string;
    locale: string;
}

const ArrowIcon = ({ className, width, height, color = "var(--color-admin-primary)", locale, ...rest }: IProps) => {
    return (
        <svg fill={color} width={height} height={width} transform={`${locale === 'en' ? `rotate(180)` : ''}`} viewBox="0 0 24 24" id="cursor-left-2" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="primary" d="M20,9H13.5l.41-1.37A2,2,0,0,0,13.2,5.4,1.93,1.93,0,0,0,11,5.29l-8,5a2.06,2.06,0,0,0,0,3.48l8.05,5A2,2,0,0,0,12,19a2,2,0,0,0,1.17-.4,2,2,0,0,0,.71-2.23L13.5,15H20a2,2,0,0,0,2-2V11A2,2,0,0,0,20,9Z" style={{ fill: color }}></path></g></svg>);
}

export default ArrowIcon;
