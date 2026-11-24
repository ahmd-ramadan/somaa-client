'use client'

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { IDashboardInsights, SENTIMENT_COLOR, Sentiment, useLabels } from "./insights";

const SERIES: Sentiment[] = ["positive", "neutral", "negative"];

const ActivityTimelineChart = ({ insights }: { insights: IDashboardInsights }) => {
    const t = useTranslations("DashboardPage");
    const L = useLabels();
    const rtl = useLocale() === "ar";
    const { timeline, peak } = insights;
    /** buckets cover the whole applied range, so "has points" is not the same as "has buckets" */
    const hasData = timeline.some((b) => b.total > 0);

    const labelByTs = useMemo(() => new Map(timeline.map((b) => [b.ts, b.label])), [timeline]);

    return (
        <DashboardCard
            title={L.activityOverTime}
            icon={<Activity className="h-4 w-4" />}
            meta={peak ? `${L.peakTime}: ${peak.full} · ${peak.total.toLocaleString()}` : undefined}
            className="h-full"
        >
            {!hasData ? (
                <div className="flex h-full items-center justify-center text-xs text-gray-400">{t("noDataToShow")}</div>
            ) : (
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={timeline} margin={{ top: 8, right: rtl ? 4 : 12, left: -16, bottom: 0 }}>
                            <defs>
                                {SERIES.map((s) => (
                                    <linearGradient key={s} id={`tl-${s}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={SENTIMENT_COLOR[s]} stopOpacity={0.55} />
                                        <stop offset="95%" stopColor={SENTIMENT_COLOR[s]} stopOpacity={0.05} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid stroke="#374151" strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="ts"
                                tickFormatter={(ts) => labelByTs.get(ts) ?? ""}
                                tick={{ fill: "#9ca3af", fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                                interval="preserveStartEnd"
                                minTickGap={44}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fill: "#9ca3af", fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ stroke: "#6b7280", strokeDasharray: "3 3" }}
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null;
                                    const b = payload[0].payload as (typeof timeline)[number];
                                    return (
                                        <div className="min-w-[130px] rounded-lg border border-gray-700/60 bg-gray-900/95 p-2 text-xs shadow-lg" dir={rtl ? "rtl" : "ltr"}>
                                            <div className="mb-1 font-semibold text-blue-300">{b.full}</div>
                                            {SERIES.map((s) => (
                                                <div key={s} className="flex items-center justify-between gap-3">
                                                    <span className="flex items-center gap-1.5 text-gray-200">
                                                        <span className="h-2 w-2 rounded-full" style={{ background: SENTIMENT_COLOR[s] }} />
                                                        {t(s)}
                                                    </span>
                                                    <span className="font-semibold tabular-nums text-white">{b[s]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }}
                            />
                            {SERIES.map((s) => (
                                <Area
                                    key={s}
                                    type="monotone"
                                    dataKey={s}
                                    stackId="1"
                                    stroke={SENTIMENT_COLOR[s]}
                                    strokeWidth={1.5}
                                    fill={`url(#tl-${s})`}
                                    // sockets push updates often — don't replay the intro animation each time
                                    isAnimationActive={false}
                                />
                            ))}
                            {peak && peak.total > 0 && (
                                <ReferenceDot x={peak.ts} y={peak.total} r={4} fill="#fff" stroke="var(--color-secondary)" strokeWidth={2} />
                            )}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </DashboardCard>
    );
};

export default ActivityTimelineChart;
