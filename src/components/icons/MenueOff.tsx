import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string;
}

const MenueOff = ({ className, width, height, color = "#808080", ...rest }: IProps) => {
    return (
        <button 
            className={`${className}`}
            { ...rest }
        >
            <svg width={width} height={height} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 10.5L12.5 15L8 10.5" stroke={color} strokeWidth="1.2"></path> </g></svg>
        </button>
    );
}

export default MenueOff;
