import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string;
}

const DeleteIcon = ({ className, width, height, color = "#ef4444", ...rest }: IProps) => {
    return (
        <button
            className={className}
            {...rest}
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width={width} 
                height={height} 
                viewBox="0 0 24 24"
            >
                <path 
                    fill="none" 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeWidth="1.5" 
                    d="M20.5 6h-17m5.67-2a3.001 3.001 0 0 1 5.66 0m3.544 11.4c-.177 2.654-.266 3.981-1.131 4.79s-2.195.81-4.856.81h-.774c-2.66 0-3.99 0-4.856-.81c-.865-.809-.953-2.136-1.13-4.79l-.46-6.9m13.666 0l-.2 3"
                />
            </svg>
        </button>
    );
}

export default DeleteIcon;
