import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string;
}

const ResetPasswordIcon = ({ className, width, height, color="#808000", ...rest }: IProps) => {
    return (
        <button 
            className={className}
            {...rest}
            aria-label="Reset Password"
        >
            <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z" stroke="#808000" strokeWidth="1.5"></path> <path d="M12 10V14M10.2676 11L13.7317 13M13.7314 11L10.2673 13" stroke="#808000" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M6.73241 10V14M4.99999 11L8.46409 13M8.46386 11L4.99976 13" stroke="#808000" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M17.2681 10V14M15.5356 11L18.9997 13M18.9995 11L15.5354 13" stroke="#808000" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
        </button>
    );
}

export default ResetPasswordIcon;
