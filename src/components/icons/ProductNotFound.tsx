import { ButtonHTMLAttributes } from 'react';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement>  {
    className?: string;
    width: string;
    height: string;
    color?: string;
}

const ProductNotFound = ({ className = '', width, height, color = "var(--color-primary)", ...rest }: IProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 18.5L20 13.5M20 18.5L15 13.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.5" d="M21 6L3 6" stroke={color} strokeWidth="1.5" strokeLinecap="round"></path> <path opacity="0.5" d="M21 10L3 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"></path> <path opacity="0.5" d="M11 14L3 14" stroke={color} strokeWidth="1.5" strokeLinecap="round"></path> <path opacity="0.5" d="M11 18H3" stroke={color} strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
    );
};

export default ProductNotFound;
