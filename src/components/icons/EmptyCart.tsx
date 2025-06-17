import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width?: string;
    height?: string;
    color?: string;
}

const EmptyCartIcon = ({
    className = '',
    width = "24",
    height = "24",
    color = "var(--color-primary)",
    ...rest
}: IProps) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            // {...rest}
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z" stroke={color} strokeWidth="1.5"></path>
                <path d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z" stroke={color} strokeWidth="1.5"></path>
                <path d="M11.5 12.5L14.5 9.5M14.5 12.5L11.5 9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"></path>
            </g>
        </svg>
    );
}

export default EmptyCartIcon;
