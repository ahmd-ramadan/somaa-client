import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string;
}

const StopIcon = ({
    className,
    width,
    height,
    color = "var(--color-admin-primary)",
    ...rest
}: IProps) => {
    return (
        <button className={className} {...rest}>
            <svg width={width} height={height} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="currentColor" fillRule="evenodd" d="M5.781 4.414a7 7 0 019.62 10.039l-9.62-10.04zm-1.408 1.42a7 7 0 009.549 9.964L4.373 5.836zM10 1a9 9 0 100 18 9 9 0 000-18z"></path> </g></svg>
        </button>
    );
}

export default StopIcon;
