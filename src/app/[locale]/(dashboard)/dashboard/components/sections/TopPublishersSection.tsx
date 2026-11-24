'use client'

import { useState, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { Trophy, Users } from "lucide-react";
import { getPlatformIcon } from "../utils";
import DashboardCard from "./DashboardCard";
import { IDashboardInsights, SENTIMENT_COLOR, useLabels } from "./insights";

const Avatar = ({ src, fallback }: { src?: string; fallback: ReactNode }) => {
    const [failed, setFailed] = useState(false);
    return src && !failed ? (
        <img
            src={src}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="h-8 w-8 shrink-0 rounded-md object-cover"
        />
    ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100">{fallback}</div>
    );
};

const TopPublishersSection = ({ insights }: { insights: IDashboardInsights }) => {
    const L = useLabels();
    const locale = useLocale();
    const compact = (n: number) =>
        new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(n);

    const { publishers } = insights;
    const max = publishers[0]?.engagement || 1;

    return (
        <DashboardCard title={L.topPublishers} icon={<Trophy className="h-4 w-4" />} className="h-full lg:w-1/3 text-[8px]">
            {publishers.length === 0 ? (
                <div className="flex h-full items-center justify-center text-gray-400">—</div>
            ) : (
                <ol className="flex flex-col gap-2">
                    {publishers.map((p, i) => {
                        const tone = p.net > 0 ? SENTIMENT_COLOR.positive : p.net < 0 ? SENTIMENT_COLOR.negative : SENTIMENT_COLOR.neutral;
                        return (
                            <li key={p.name} className="flex items-center gap-2">
                                <span className="w-fit text-center tabular-nums text-secondary">{i + 1}</span>
                                <Avatar src={p.avatar} fallback={getPlatformIcon(p.platform)} />
                                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="flex min-w-0 items-center gap-1.5 text-gray-100">
                                            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: tone }} />
                                            <span className="truncate">{p.name}</span>
                                        </span>
                                        <span className="shrink-0 font-semibold tabular-nums text-blue-300">
                                            {compact(p.engagement)}
                                        </span>
                                    </div>
                                    <div className="h-1 overflow-hidden rounded-full bg-gray-700/40">
                                        <div
                                            className="h-full rounded-full bg-blue-400/80 transition-all duration-500"
                                            style={{ width: `${(p.engagement / max) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <span className="flex items-center gap-0.5">
                                            <Users className="h-2.5 w-2.5" />
                                            {compact(p.followers)}
                                        </span>
                                        <span>
                                            {p.posts.toLocaleString()} {L.posts}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            )}
        </DashboardCard>
    );
};

export default TopPublishersSection;
