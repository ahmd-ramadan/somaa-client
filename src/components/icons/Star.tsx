import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    width: string;
    height: string;
    color?: string;
}

const StarIcon = ({
    className,
    width,
    height,
    color = "var(--color-admin-primary)",
    ...rest
}: IProps) => {
    return (
        <button className={className} {...rest}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={color}
                viewBox="0 0 24 24"
                width={width}
                height={height}
            >
                <path d="M12 .587l3.668 7.568 8.332 1.21-6.004 5.857 1.417 8.283L12 18.897l-7.413 3.895 1.417-8.283-6.004-5.857 8.332-1.21z" />
            </svg>
        </button>
    );
}

export default StarIcon;
