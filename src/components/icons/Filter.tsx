import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string;
    locale?: string;
}

const FilterIcon = ({ className, width, height, locale="ar", color="var(--color-secondary)", ...rest }: IProps) => {
    return (
        <button 
            className={className}
            {...rest}
            aria-label="Filter"
        >
            <svg fill="#000000" width={width} height={height} viewBox="0 0 24 24" id="filter-alt" xmlns="http://www.w3.org/2000/svg" className="icon multi-color"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="primary-stroke" d="M5,3V17M12,7V21m7-7v7m0-11V3" style={{fill: "none", stroke: "#000000", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2}}></path><path id="secondary-stroke" d="M7,19a2,2,0,1,1-2-2A2,2,0,0,1,7,19ZM12,3a2,2,0,1,0,2,2A2,2,0,0,0,12,3Zm7,7a2,2,0,1,0,2,2A2,2,0,0,0,19,10Z" style={{fill: "none", stroke: color, strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2}}></path></g></svg>
        </button>
    );
}

export default FilterIcon;
