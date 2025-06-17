import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string;
}

const MenueOn = ({ className, width, height, color = "#808080", ...rest }: IProps) => {
    return (
        <button 
            className={`${className}`}
            { ...rest }
        >
            <svg width={width} height={height} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 14.5L12.5 10L17 14.5" stroke="#121923" strokeWidth="1.2"></path> </g></svg>
        </button>
    );
}

export default MenueOn;
