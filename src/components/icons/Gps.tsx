import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string
}

const GpsIcon = ({ className, width, height, color = "var(--color-primary)", ...rest }: IProps) => {
    return (
        <button 
            className={className}
            {...rest}
            aria-label="Gps"
        >
            <svg fill={color} width={width} height={height} viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><title></title><path d="M12,2a8,8,0,0,0-8,8c0,5.4,7,11.5,7.35,11.76l.65.56.65-.56C13,21.5,20,15.4,20,10A8,8,0,0,0,12,2Zm0,12a4,4,0,1,1,4-4A4,4,0,0,1,12,14Z"></path><circle cx="12" cy="10" r="2"></circle></g></svg>
        </button>
    );
}

export default GpsIcon;
