import { ButtonHTMLAttributes } from 'react';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement>  {
    className?: string;
    width: string;
    height: string;
    color?: string;
}

const RemoveItemIcon = ({ className = '', width, height, color = 'gray-400', ...rest }: IProps) => {
    return (
        <button 
            className={`${className} flex items-center justify-center`} 
            aria-label="Remove item"
            {... rest}
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width={width} 
                height={height} 
                viewBox="0 0 24 24" 
                className={`fill-current text-${color} hover:text-red-600`}
                aria-hidden="true"
            >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path>
            </svg>
        </button>
    );
};

export default RemoveItemIcon;
