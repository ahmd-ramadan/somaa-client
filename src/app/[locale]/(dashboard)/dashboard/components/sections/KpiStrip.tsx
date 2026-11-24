'use client'

import { useMemo } from "react";
import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Gauge, Globe, Radio, Zap } from "lucide-react";
import { getPlatformName } from "../utils";
import { IDashboardInsights, PLATFORM_COLOR, SENTIMENT_COLOR, useLabels } from "./insights";

const BLUE = "#60a5fa";
const VIOLET = "#a78bfa";
const AMBER = "#fbbf24";

/* ------------------------------------------------------------------ */
/* Tile: accent edge + soft glow + icon badge + text stack (+ aside)   */
/* ------------------------------------------------------------------ */

interface ITileProps {
    accent: string; // 6-digit hex
    icon: ReactNode;
    label: string;
    children: ReactNode; // the big value
    foot?: ReactNode; // one 12px row
    aside?: ReactNode;
    className?: string;
}

const Tile = ({ accent, icon, label, children, foot, aside, className = "" }: ITileProps) => (
    <div
        className={`relative flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/70 to-gray-900/50 px-3 py-2 backdrop-blur-sm ${className}`}
    >
        {/* accent edge + glow */}
        {/* <span className="absolute inset-y-2 start-0 w-[3px] rounded-full" style={{ background: accent }} /> */}
        <span
            className="pointer-events-none absolute -end-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl"
            style={{ background: accent }}
        />

        <span
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ background: `${accent}22`, color: accent, boxShadow: `inset 0 0 0 1px ${accent}40` }}
        >
            {icon}
        </span>

        <div className="relative flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[11px] leading-4 text-gray-400">{label}</span>
            <div className="flex items-baseline gap-1.5 truncate text-xl font-semibold leading-6 tabular-nums text-white">
                {children}
            </div>
            {foot && <div className="mt-1 flex h-3 items-center gap-2 text-[10px] leading-none text-gray-400">{foot}</div>}
        </div>

        {aside && <div className="relative hidden shrink-0 xl:block">{aside}</div>}
    </div>
);

/** Thin horizontal bar that fills the free space of the foot row. */
const Bar = ({ children }: { children: ReactNode }) => (
    <div className="flex h-1 flex-1 overflow-hidden rounded-full bg-gray-700/50">{children}</div>
);

/* ------------------------------------------------------------------ */
/* Sparkline (no chart lib needed)                                     */
/* ------------------------------------------------------------------ */

const downsample = (vals: number[], max = 48) => {
    if (vals.length <= max) return vals;
    const size = Math.ceil(vals.length / max);
    const out: number[] = [];
    for (let i = 0; i < vals.length; i += size) out.push(Math.max(...vals.slice(i, i + size)));
    return out;
};

const Sparkline = ({ values, color }: { values: number[]; color: string }) => {
    const v = downsample(values);
    if (v.length < 2) return null;

    const W = 72;
    const H = 30;
    const max = Math.max(...v, 1);
    const step = W / (v.length - 1);
    const pts = v.map((n, i) => [i * step, H - 3 - (n / max) * (H - 8)] as const);
    const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
    const area = `${line} L${W} ${H} L0 ${H} Z`;
    const [px, py] = pts[v.indexOf(Math.max(...v))];

    return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible" aria-hidden>
            <defs>
                <linearGradient id="kpi-spark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={color} stopOpacity="0.45" />
                    <stop offset="1" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill="url(#kpi-spark)" />
            <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={px} cy={py} r="2.5" fill="#fff" stroke={color} strokeWidth="1.5" />
        </svg>
    );
};

/* ------------------------------------------------------------------ */
/* Strip                                                               */
/* ------------------------------------------------------------------ */

const Dot = ({ color }: { color: string }) => (
    <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
);

const KpiStrip = ({ insights }: { insights: IDashboardInsights }) => {
    const t = useTranslations("DashboardPage");
    const L = useLabels();
    const locale = useLocale();

    const compact = useMemo(
        () => new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }),
        [locale]
    );

    const { newsCount, analysisCount, totalMonitoring, totalEngagement, sentimentScore: score, topPlatform: top, peak } = insights;

    /* sentiment */
    const tone = score > 10 ? "positive" : score < -10 ? "negative" : "neutral";
    const toneColor = SENTIMENT_COLOR[tone];

    /* monitoring split */
    const split = totalMonitoring || 1;

    /* top platform share */
    const topColor = top ? PLATFORM_COLOR[top.platform as string] ?? "#64748b" : BLUE;
    const topPct = top && analysisCount ? Math.round((top.count / analysisCount) * 100) : 0;

    /* peak sparkline */
    const spark = useMemo(() => insights.timeline.map((b) => b.total), [insights.timeline]);

    return (
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
            {/* 1 · total monitoring + news / social split */}
            <Tile
                accent={BLUE}
                icon={<Radio className="h-4 w-4" />}
                label={t("totalMonitoring")}
                foot={
                    <>
                        <Bar>
                            <div className="h-full" style={{ width: `${(newsCount / split) * 100}%`, background: BLUE }} />
                            <div className="h-full" style={{ width: `${(analysisCount / split) * 100}%`, background: VIOLET }} />
                        </Bar>
                        <span className="flex shrink-0 items-center gap-1 tabular-nums" title={`${t("news")} · ${t("socialMedia")}`}>
                            <Dot color={BLUE} />
                            {newsCount.toLocaleString()}
                            <Dot color={VIOLET} />
                            {analysisCount.toLocaleString()}
                        </span>
                    </>
                }
            >
                {totalMonitoring.toLocaleString()}
            </Tile>

            {/* 2 · total engagement + average per item */}
            <Tile
                accent={VIOLET}
                icon={<Zap className="h-4 w-4" />}
                label={t("totalStatistics")}
                foot={
                    analysisCount ? (
                        <span className="tabular-nums">
                            ≈ {compact.format(totalEngagement / analysisCount)} / {L.items}
                        </span>
                    ) : undefined
                }
            >
                {compact.format(totalEngagement)}
            </Tile>

            {/* 3 · net sentiment gauge */}
            <Tile
                accent={toneColor}
                icon={<Gauge className="h-4 w-4" />}
                label={L.netSentiment}
                foot={
                    <div
                        className="relative h-1.5 w-full rounded-full"
                        
                        style={{ background: "linear-gradient(to right, #ef444499, #6b728099 50%, #22c55e99)" }}
                    >
                        <span className="absolute left-1/2 top-0 h-full w-px bg-white/30" />
                        <span
                            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-gray-900 shadow transition-all duration-700"
                            style={{ left: `${(score + 100) / 2}%`, borderColor: toneColor }}
                        />
                    </div>
                }
            >
                <span  style={{ color: toneColor }}>
                    {score > 0 ? "+" : ""}
                    {score}
                </span>
                <span
                    className="rounded px-1.5 py-0.5 text-[10px] font-medium leading-none"
                    style={{ background: `${toneColor}26`, color: toneColor }}
                >
                    {t(tone)}
                </span>
            </Tile>

            {/* 4 · top platform + its share */}
            <Tile
                accent={topColor}
                icon={<Globe className="h-4 w-4" />}
                label={L.topPlatform}
                foot={
                    top ? (
                        <>
                            <Bar>
                                <div className="h-full" style={{ width: `${topPct}%`, background: topColor }} />
                            </Bar>
                            <span className="shrink-0 tabular-nums">
                                {top.count.toLocaleString()} · {topPct}%
                            </span>
                        </>
                    ) : undefined
                }
            >
                {top ? getPlatformName(top.platform) : "—"}
            </Tile>

            {/* 5 · peak activity + sparkline */}
            <Tile
                accent={AMBER}
                icon={<Clock className="h-4 w-4" />}
                label={L.peakTime}
                foot={peak ? <span className="tabular-nums">{peak.total.toLocaleString()} {L.items}</span> : undefined}
                aside={<Sparkline values={spark} color={AMBER} />}
                className="col-span-2 lg:col-span-1"
            >
                {peak?.label ?? "—"}
            </Tile>
        </div>
    );
};

export default KpiStrip;
