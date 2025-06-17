import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string;
}

const ForgetPassIcon = ({ className, width, height, color="var(--color-primary)", ...rest }: IProps) => {
    return (
        <button 
            className={className}
            {...rest}
            aria-label="Forget Password"
        >
            <svg fill="#000000" width={width} height={height} viewBox="0 0 24 24" id="lock-cross" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg" className="icon flat-color"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="primary" d="M18,8H17V7A5,5,0,0,0,7,7V8H6a2,2,0,0,0-2,2V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V10A2,2,0,0,0,18,8ZM9,7a3,3,0,0,1,6,0V8H9Z" style={{fill: color}}></path><path id="secondary" d="M13.41,15l1.3-1.29a1,1,0,0,0-1.42-1.42L12,13.59l-1.29-1.3a1,1,0,0,0-1.42,1.42L10.59,15l-1.3,1.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,16.41l1.29,1.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z" style={{fill: "var(--color-secondary)"}}></path></g></svg>
        </button>
    );
}

export default ForgetPassIcon;
