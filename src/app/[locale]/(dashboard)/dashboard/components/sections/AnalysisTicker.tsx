'use client'

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BarChart, Eye, Heart, MessageCircle, Pause, Play, Share2, Users } from "lucide-react";
import { IAnalysis } from "@/interfaces/analysis.types";
import { formatDistanceToNow } from "./utils";
import { getPlatformIcon } from "../utils";
import DashboardCard from "./DashboardCard";
import { SENTIMENT_COLOR, analysisSentiment } from "./insights";

/**
 * Seamless loop: the list is rendered twice and the track moves exactly -50%.
 * (The old ticker moved `items × 120px` while rendering only 40 cards, so it scrolled
 * past the end of the list after ~1 minute and the card went blank.)
 */
const TICKER_CSS = `
@keyframes ticker-up { from { transform: translateY(0) } to { transform: translateY(-50%) } }
.ticker:hover .ticker-track { animation-play-state: paused !important }
@media (prefers-reduced-motion: reduce) {
  .ticker-track { animation: none !important }
  .ticker-dup { display: none }
}`;

const safeAgo = (date: string, locale: string) => {
    try {
        return formatDistanceToNow({ date, locale });
    } catch {
        return "";
    }
};

const AnalysisCard = ({ analysis: a }: { analysis: IAnalysis }) => {
    const t = useTranslations("DashboardPage");
    const locale = useLocale();
    const [avatarFailed, setAvatarFailed] = useState(false);
    const compact = useMemo(
        () => new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }),
        [locale]
    );

    const sentiment = analysisSentiment(a.classify);
    const color = SENTIMENT_COLOR[sentiment];
    const s = a.statistics;
    const body = a.content?.body || a.subAnalysisData?.body;

    const stats = [
        { Icon: Eye, value: s?.views },
        { Icon: Share2, value: s?.shares },
        { Icon: Heart, value: s?.reactions },
        { Icon: MessageCircle, value: s?.comments },
        { Icon: BarChart, value: s?.appearance },
    ];

    return (
        <article
            className="flex flex-col gap-1 rounded-md border border-gray-700/40 bg-gray-800/50 px-2 py-1.5"
            style={{ borderInlineStartColor: color, borderInlineStartWidth: 3 }}
        >
            <div className="flex items-center gap-2">
                {a.publisher?.avatar && !avatarFailed ? (
                    <img
                        src={a.publisher.avatar}
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarFailed(true)}
                        className="h-7 w-7 shrink-0 rounded-md object-cover"
                    />
                ) : (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100">
                        {getPlatformIcon(a.platform)}
                    </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="truncate text-[11px] font-medium text-gray-100">
                        {a.publisher?.name || "—"}
                    </span>
                    <span className="flex items-center gap-2 text-[10px] text-gray-400">
                        <span className="flex items-center gap-0.5">
                            <Users className="h-2.5 w-2.5 text-blue-300" />
                            {compact.format(a.publisher?.followers ?? 0)}
                        </span>
                        <span className="truncate">{safeAgo((a.publishDate as string) || a.createdAt, locale)}</span>
                    </span>
                </div>

                <span
                    className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium leading-none"
                    style={{ background: `${color}26`, color }}
                >
                    {t(sentiment)}
                </span>
            </div>

            {body && <p className="line-clamp-2 text-[11px] leading-snug text-gray-300">{body}</p>}

            <div className="flex items-center justify-between text-[10px] tabular-nums text-gray-400">
                {stats.map(({ Icon, value }, i) => (
                    <span key={i} className="flex items-center gap-1">
                        <Icon className="h-3 w-3 text-blue-300" />
                        {compact.format(value ?? 0)}
                    </span>
                ))}
            </div>
        </article>
    );
};

interface IAnalysisTickerProps {
    title: string;
    icon: ReactNode;
    items: IAnalysis[];
    limit?: number;
    className?: string;
}

const AnalysisTicker = ({ title, icon, items, limit = 30, className = "" }: IAnalysisTickerProps) => {
    const t = useTranslations("DashboardPage");
    const [paused, setPaused] = useState(false);

    const shown = useMemo(() => items.slice(0, limit), [items, limit]);
    const animated = shown.length > 3;
    const duration = Math.max(24, shown.length * 4);

    return (
        <DashboardCard
            title={title}
            icon={icon}
            className={className}
            meta={
                <span className="flex items-center gap-2">
                    <span className="tabular-nums text-gray-300">{items.length.toLocaleString()}</span>
                    {animated && (
                        <button
                            onClick={() => setPaused((p) => !p)}
                            aria-label={paused ? "Play" : "Pause"}
                            className="rounded p-0.5 text-blue-300 transition-colors hover:bg-gray-700"
                        >
                            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                        </button>
                    )}
                </span>
            }
        >
            <style>{TICKER_CSS}</style>

            {shown.length === 0 ? (
                <div className="flex h-full min-h-[80px] items-center justify-center text-xs text-gray-400">
                    {t("noDataToShow")}
                </div>
            ) : (
                <div
                    className="ticker relative h-full overflow-hidden"
                    style={{
                        maskImage: "linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)",
                        WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)",
                    }}
                >
                    <div
                        className="ticker-track"
                        style={
                            animated
                                ? {
                                    animation: `ticker-up ${duration}s linear infinite`,
                                    animationPlayState: paused ? "paused" : "running",
                                }
                                : undefined
                        }
                    >
                        {/* padding (not gap) keeps the -50% loop point pixel-exact */}
                        {shown.map((a, i) => (
                            <div key={`${a._id ?? i}-a`} className="pb-1.5">
                                <AnalysisCard analysis={a} />
                            </div>
                        ))}
                        {animated &&
                            shown.map((a, i) => (
                                <div key={`${a._id ?? i}-b`} className="ticker-dup pb-1.5" aria-hidden>
                                    <AnalysisCard analysis={a} />
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </DashboardCard>
    );
};

export default AnalysisTicker;
