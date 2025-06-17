import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string;
}

const CalenderIcon = ({ className, width, height, color = "var(--color-primary)", ...rest }: IProps) => {
    return (
        <button 
            className={className}
            {...rest}
            aria-label="Calender"
        >
            <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="3" y="6" width="18" height="15" rx="2" stroke={color} strokeWidth="2"></rect> <path d="M3 10C3 8.11438 3 7.17157 3.58579 6.58579C4.17157 6 5.11438 6 7 6H17C18.8856 6 19.8284 6 20.4142 6.58579C21 7.17157 21 8.11438 21 10H3Z" fill={color}></path> <path d="M7 3L7 6" stroke={color} strokeWidth="2" strokeLinecap="round"></path> <path d="M17 3L17 6" stroke={color} strokeWidth="2" strokeLinecap="round"></path> <rect x="7" y="12" width="4" height="2" rx="0.5" fill={color}></rect> <rect x="7" y="16" width="4" height="2" rx="0.5" fill={color}></rect> <rect x="13" y="12" width="4" height="2" rx="0.5" fill={color}></rect> <rect x="13" y="16" width="4" height="2" rx="0.5" fill={color}></rect> </g></svg>
        </button>
    );
}

export default CalenderIcon;
