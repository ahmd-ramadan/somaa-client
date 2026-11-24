'use client'

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import DashboardCard from "./DashboardCard";
import { IBreakdownRow, SENTIMENT_COLOR, Sentiment } from "./insights";

const SERIES: Sentiment[] = ["positive", "neutral", "negative"];

interface ISentimentBreakdownChartProps {
    title: string;
    icon?: ReactNode;
    rows: IBreakdownRow[];
    className?: string;
}

/**
 * Plain HTML rows instead of a Recharts axis: long Arabic names can no longer collide
 * with the bars, and RTL just works because the browser lays the row out.
 * Bar length = volume (relative to the biggest row); colour split = sentiment.
 */
const SentimentBreakdownChart = ({ title, icon, rows, className = "" }: ISentimentBreakdownChartProps) => {
    const t = useTranslations("DashboardPage");
    const max = rows.reduce((m, r) => Math.max(m, r.total), 0) || 1;

    return (
        <DashboardCard
            title={title}
            icon={icon}
            className={className}
            meta={
                <span className="flex items-center gap-2">
                    {SERIES.map((s) => (
                        <span key={s} className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: SENTIMENT_COLOR[s] }} />
                            {t(s)}
                        </span>
                    ))}
                </span>
            }
        >
            {rows.length === 0 ? (
                <div className="flex h-[200px] items-center justify-center text-xs text-gray-400">{t("noDataToShow")}</div>
            ) : (
                <ul className="custom-scrollbar grid h-full auto-rows-fr gap-2">
                    {rows.map((r) => (
                        <li
                            key={r.name}
                            className="flex items-center gap-2"
                            title={`${r.name} — ${t("positive")}: ${r.positive} · ${t("neutral")}: ${r.neutral} · ${t("negative")}: ${r.negative}`}
                        >
                            <span className="w-[36%] shrink-0 truncate text-[10px] font-thin text-gray-200">{r.name}</span>

                            <div className="h-2 flex-1 rounded-full bg-gray-700/30">
                                <div
                                    className="flex h-full overflow-hidden rounded-full transition-all duration-500"
                                    style={{ width: `${Math.max(4, (r.total / max) * 100)}%` }}
                                >
                                    {SERIES.map((s) =>
                                        r[s] > 0 ? (
                                            <div
                                                key={s}
                                                className="h-full"
                                                style={{ width: `${(r[s] / r.total) * 100}%`, background: SENTIMENT_COLOR[s] }}
                                            />
                                        ) : null
                                    )}
                                </div>
                            </div>

                            <span className="w-8 shrink-0 text-end text-xs tabular-nums text-gray-300">{r.total}</span>
                        </li>
                    ))}
                </ul>
            )}
        </DashboardCard>
    );
};

export default SentimentBreakdownChart;
