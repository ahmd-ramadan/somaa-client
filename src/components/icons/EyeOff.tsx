import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string;
}

const EyeOffIcon = ({ className, width, height, color="var(--color-primary)", ...rest }: IProps) => {
    return (
        <svg 
            width={width} 
            height={height} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path 
                d="M14.83 9.18c-.56-.56-1.27-.94-2.05-1.1-.78-.16-1.58-.08-2.31.23-.73.31-1.36.85-1.78 1.5-.42.66-.66 1.39-.66 2.14 0 1.06.42 2.05 1.17 2.8" 
                stroke={color} 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            <path 
                d="M12 16.01c1.06 0 2.08-.42 2.83-1.17.75-.75 1.17-1.74 1.17-2.8" 
                stroke={color} 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            <path 
                d="M17.61 6.39L6.38 17.62C4.62 15.99 3.14 14.09 2 11.99 6.71 3.76 12.44 1.89 17.61 6.39z" 
                stroke={color}
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            <path 
                d="M21 3l-3.39 3.39" 
                stroke={color}
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            <path 
                d="M6.38 17.62L3 21" 
                stroke={color}
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            <path 
                d="M19.57 8.43c.91 1.12 1.72 2.31 2.43 3.57-4.8 7.01-9.53 9.39-14.03 7.22" 
                stroke={color} 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default EyeOffIcon;
