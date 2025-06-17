import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string;
}

const BurgerIcon = ({ className, width, height, color = "#fff", ...rest }: IProps) => {
    return (
        <button 
            className={className}
            {...rest}
        >
            <svg 
                fill={color} 
                width={width} 
                height={height} 
                viewBox="0 0 16 16" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <title>Menu Icon</title>
                    <path d="M2 3h12a1 1 0 0 1 0 2H2a1 1 0 1 1 0-2zm0 4h12a1 1 0 0 1 0 2H2a1 1 0 1 1 0-2zm0 4h12a1 1 0 0 1 0 2H2a1 1 0 0 1 0-2z"></path>
                </g>
            </svg>
        </button>
    );
}

export default BurgerIcon;
