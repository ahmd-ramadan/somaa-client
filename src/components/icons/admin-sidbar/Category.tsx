import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string;
}

const CategoryIcon = ({ className, width, height, color = "#fff", ...rest }: IProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="0" fill="none" width="20" height="20"></rect> <g> <path d="M5 7h13v10H2V4h7l2 2H4v9h1V7z"></path> </g> </g></svg>
    );
}

export default CategoryIcon;
