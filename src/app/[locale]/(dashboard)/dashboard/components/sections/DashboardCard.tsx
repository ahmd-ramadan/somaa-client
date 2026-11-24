import type { ReactNode } from "react";

interface IDashboardCardProps {
    title: string;
    icon?: ReactNode;
    meta?: ReactNode;
    className?: string;
    children: ReactNode;
}

/** One card shell for every dashboard section: same border, radius, header rhythm. */
const DashboardCard = ({ title, icon, meta, className = "", children }: IDashboardCardProps) => (
    // border-gray-700/50 bg-gray-900/40
    <section
        className={`flex min-h-0 flex-col gap-2 rounded-lg bg-transparent/20 p-2 shadow-secondary backdrop-blur-sm ${className}`}
    >
        <header className="flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-100">
                {icon && <span className="text-secondary">{icon}</span>}
                {title}
            </h3>
            {meta && <div className="text-[11px] text-gray-400">{meta}</div>}
        </header>
        <div className="min-h-0 flex-1">{children}</div>
    </section>
);

export default DashboardCard;
