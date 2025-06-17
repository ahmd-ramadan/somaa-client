import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string; // Add color prop
}

const SearchIcon = ({ className = '', width, height, color = '#ffffff', ...rest }: IProps) => {
    return (
        <button 
            className={`flex items-center justify-center ${className}`} 
            aria-label="Search" 
            {...rest}
        >
            <svg 
                width={width} 
                height={height} 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                aria-hidden="true"
            >
                <path 
                    d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                    stroke={color} // Apply color prop
                    strokeWidth="2" 
                    strokeLinecap="round" 
                />
            </svg>
        </button>
    );
};

export default SearchIcon;
