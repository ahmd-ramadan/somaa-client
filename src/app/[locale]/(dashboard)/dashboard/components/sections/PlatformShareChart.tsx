'use client'

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Globe } from "lucide-react";
import { getPlatformName } from "../utils";
import DashboardCard from "./DashboardCard";
import { IDashboardInsights, PLATFORM_COLOR, useLabels } from "./insights";

const PlatformShareChart = ({ insights }: { insights: IDashboardInsights }) => {
    const L = useLabels();
    const { platforms, analysisCount } = insights;
    const colorOf = (p: string) => PLATFORM_COLOR[p] ?? "#64748b";

    return (
        <DashboardCard title={L.platformShare} icon={<Globe className="h-4 w-4" />} className="h-full">
            {platforms.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-gray-400">—</div>
            ) : (
                <div className="flex h-full max-h-full flex-col items-center gap-3">
                    <div className="relative h-[130px] w-[130px] shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={platforms}
                                    dataKey="count"
                                    nameKey="platform"
                                    innerRadius={36}
                                    outerRadius={56}
                                    paddingAngle={2}
                                    stroke="none"
                                    isAnimationActive={false}
                                >
                                    {platforms.map((p) => (
                                        <Cell key={p.platform} fill={colorOf(p.platform as string)} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xl font-semibold tabular-nums text-white">
                            {analysisCount.toLocaleString()}
                        </div>
                    </div>

                    <ul className="custom-scrollbar grid min-w-0 w-full flex-1 auto-rows-fr gap-1.5 overflow-y-auto">
                        {platforms.map((p) => {
                            const pct = analysisCount ? Math.round((p.count / analysisCount) * 100) : 0;
                            return (
                                <li key={p.platform} className="flex min-h-[16px] flex-col justify-center gap-0.5 text-xs">
                                    <div className="flex items-center justify-between gap-2 text-[11px]">
                                        <span className="flex min-w-0 items-center gap-1.5 text-gray-200">
                                            <span className="h-1 w-1 shrink-0 rounded-full" style={{ background: colorOf(p.platform as string) }} />
                                            <span className="truncate">{getPlatformName(p.platform)}</span>
                                        </span>
                                        <span className="tabular-nums text-gray-400">
                                            {p.count.toLocaleString()} · {pct}%
                                        </span>
                                    </div>
                                    <div className="h-1 overflow-hidden rounded-full bg-gray-700/40">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${pct}%`, background: colorOf(p.platform as string) }}
                                        />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </DashboardCard>
    );
};

export default PlatformShareChart;
