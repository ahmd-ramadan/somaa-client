import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string;
}

const FactoryIcon = ({ className, width, height, color = "var(--color-primary)", ...rest }: IProps) => {
    return (
        <button 
            className={className}
            {...rest}
            aria-label="Factory"
        >
            <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M15 2V15H13V10H11V15H1V5L7 2H8V5L14 2H15ZM9 8H7V12H9V8ZM5 8H3V12H5V8Z" fill={color}></path> </g></svg>
        </button>
    );
}

export default FactoryIcon;
