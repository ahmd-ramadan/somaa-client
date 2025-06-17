import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string;
}

const MinusIcon = ({ className, width, height, color = "ver(--color-primary)", ...rest }: IProps) => {
    return (
        <button 
            className={className}
            color="currentColor"
            {...rest}
        >
            <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12L18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
        </button>
    );
}

export default MinusIcon;
