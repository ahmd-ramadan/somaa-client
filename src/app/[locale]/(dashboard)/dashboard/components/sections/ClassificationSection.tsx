'use client'

import { useMemo } from "react";
import { Frown, Meh, Smile } from "lucide-react";
import { useTranslations } from "next-intl";
import { IAnalysis } from "@/interfaces/analysis.types";
import { INews } from "@/interfaces/news.types";
import { SENTIMENT_COLOR, Sentiment, analysisSentiment, newsSentiment } from "./insights";

interface ClassificationSectionProps {
    allAnalysis: IAnalysis[];
    allNews: INews[];
}

const ORDER: { key: Sentiment; Icon: typeof Smile }[] = [
    { key: "positive", Icon: Smile },
    { key: "neutral", Icon: Meh },
    { key: "negative", Icon: Frown },
];

const ClassificationSection = ({ allAnalysis, allNews }: ClassificationSectionProps) => {
    const t = useTranslations("DashboardPage");

    const { counts, total } = useMemo(() => {
        const counts: Record<Sentiment, number> = { positive: 0, neutral: 0, negative: 0 };
        (allAnalysis || []).forEach((a) => counts[analysisSentiment(a.classify)]++);
        (allNews || []).forEach((n) => counts[newsSentiment(n.classify)]++);
        return { counts, total: counts.positive + counts.neutral + counts.negative };
    }, [allAnalysis, allNews]);

    return (
        <div className="flex flex-col gap-1.5 rounded-lg border border-gray-700/50 bg-gray-900/40 p-2 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-1.5">
                {ORDER.map(({ key, Icon }) => {
                    const color = SENTIMENT_COLOR[key];
                    const pct = total ? Math.round((counts[key] / total) * 100) : 0;
                    return (
                        <div
                            key={key}
                            className="flex flex-col items-center gap-1 rounded-md px-2 py-1"
                            style={{ background: `${color}14`, borderColor: `${color}40` }}
                        >
                            <div 
                                className="flex w-full justify-between gap-.5"
                            >
                                <Icon className="h-6 w-6 shrink-0" style={{ color }} />
                                <span className="text-sm font-semibold tabular-nums text-white">
                                    {counts[key].toLocaleString()}
                                </span>
                            </div>
                            <div className="flex w-full justify-between leading-tight">     
                                <span className="truncate text-[8px]" style={{ color }}>
                                    {t(key)}
                                </span>
                                <span className="truncate text-[8px]" style={{ color }}>
                                    {pct}%   
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex h-1 overflow-hidden rounded-full bg-gray-700/40">
                {ORDER.map(({ key }) => (
                    <div
                        key={key}
                        className="h-full transition-all duration-500"
                        style={{ width: total ? `${(counts[key] / total) * 100}%` : "0%", background: SENTIMENT_COLOR[key] }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ClassificationSection;
