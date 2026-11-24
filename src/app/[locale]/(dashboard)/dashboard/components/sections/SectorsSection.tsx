'use client'

import { useMemo } from "react";
import type { ComponentType, ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Eye, Heart, MessageCircle, NewspaperIcon, Share2, Share2Icon, Zap } from "lucide-react";
import { IAnalysis } from "@/interfaces/analysis.types";
import { INews } from "@/interfaces/news.types";
import XIcon from "@/components/icons/SocialMedia/X";
import TikTokIcon from "@/components/icons/SocialMedia/TikTok";
import InstagramIcon from "@/components/icons/SocialMedia/Instagram";
import LinkedInIcon from "@/components/icons/SocialMedia/LinkedIn";
import FacebookIcon from "@/components/icons/SocialMedia/Facebook";
import YoutubeIcon from "@/components/icons/SocialMedia/Youtube";
import { IDashboardClassify } from "./types";
import {
    PLATFORM_COLOR,
    SENTIMENT_COLOR,
    Sentiment,
    analysisSentiment,
    newsSentiment,
    useLabels,
} from "./insights";

interface ISectorsSectionProps {
    allAnalysis: IAnalysis[]
    allNews: INews[]
}

type PlatformKey = "x" | "tiktok" | "instagram" | "youtube" | "linkedin" | "facebook";

/** Kept because SubAnalysisAndSectorsSection imports this type from here. */
export interface ISectorEngagement {
    name: string;
    total: number;
    reactions: number;
    comments: number;
    shares: number;
    views: number;
    appearances: number;
    totalMonitoringFromAnalysis: number;
    totalMonitoringFromNews: number;
    platforms: Record<PlatformKey, number>;
    classifications: IDashboardClassify[];
    newsClassifications: IDashboardClassify[];
    analysisClassifications: IDashboardClassify[];
}

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const BLUE = "#60a5fa";
const VIOLET = "#a78bfa";

const SENTIMENTS: Sentiment[] = ["positive", "neutral", "negative"];

const PLATFORMS: { key: PlatformKey; Icon: ComponentType<{ className?: string }> }[] = [
    { key: "x", Icon: XIcon },
    { key: "tiktok", Icon: TikTokIcon },
    { key: "instagram", Icon: InstagramIcon },
    { key: "youtube", Icon: YoutubeIcon },
    { key: "linkedin", Icon: LinkedInIcon },
    { key: "facebook", Icon: FacebookIcon },
];

const emptyCounts = (): Record<Sentiment, number> => ({ positive: 0, neutral: 0, negative: 0 });

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

/** Segmented sentiment bar + legend with count and percentage. */
const SentimentSplit = ({ counts }: { counts: Record<Sentiment, number> }) => {
    const t = useTranslations("DashboardPage");
    const total = counts.positive + counts.neutral + counts.negative;

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full bg-gray-700/40">
                {SENTIMENTS.map((s) =>
                    counts[s] > 0 ? (
                        <div
                            key={s}
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${(counts[s] / total) * 100}%`, background: SENTIMENT_COLOR[s] }}
                        />
                    ) : null
                )}
            </div>

            <div className="flex items-center justify-between">
                {SENTIMENTS.map((s) => {
                    const color = SENTIMENT_COLOR[s];
                    const pct = total ? Math.round((counts[s] / total) * 100) : 0;
                    return (
                        <span key={s} className="flex items-center gap-1 text-[10px] leading-none">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                            <b className="text-[11px] font-semibold tabular-nums" style={{ color }}>
                                {counts[s].toLocaleString()}
                            </b>
                            <span className="text-gray-400">{t(s)}</span>
                            <span className="tabular-nums text-gray-500">{pct}%</span>
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

interface IBlockProps {
    accent: string;
    icon: ReactNode;
    title: string;
    sub?: ReactNode;
    count: number;
    children: ReactNode;
}

/** One data block (News / Social media): accent edge, glow, icon badge, big count. */
const Block = ({ accent, icon, title, sub, count, children }: IBlockProps) => {
    const L = useLabels();

    return (
        <section className="relative overflow-hidden rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/70 to-gray-900/50 p-2.5 backdrop-blur-sm">
            {/* <span className="absolute inset-y-2 start-0 w-[3px] rounded-full" style={{ background: accent }} /> */}
            <span
                className="pointer-events-none absolute -end-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl"
                style={{ background: accent }}
            />

            <div className="relative flex flex-col gap-2.5">
                <header className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                        {/* <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                            style={{ background: `${accent}22`, color: accent, boxShadow: `inset 0 0 0 1px ${accent}40` }}
                        >
                            {icon}
                        </span> */}
                        <div className="flex min-w-0 flex-col gap-0.5 leading-tight">
                            <span className="truncate text-[13px] font-semibold text-white">{title}</span>
                            {sub}
                        </div>
                    </div>

                    <div className="flex shrink-0 items-baseline gap-1">
                        <span className="text-xl font-semibold leading-none tabular-nums text-white">
                            {count.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-400">{L.items}</span>
                    </div>
                </header>

                {children}
            </div>
        </section>
    );
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

const SectorsSection = ({ allAnalysis, allNews }: ISectorsSectionProps) => {
    const t = useTranslations("DashboardPage");
    const locale = useLocale();

    const compact = useMemo(
        () => new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }),
        [locale]
    );
    const fmt = (n: number) => (n >= 1_000_000 ? compact.format(n) : n.toLocaleString());

    const news = useMemo(() => {
        const c = emptyCounts();
        (allNews || []).forEach((n) => c[newsSentiment(n.classify)]++);
        return c;
    }, [allNews]);

    const social = useMemo(() => {
        const sentiment = emptyCounts();
        const platforms: Record<PlatformKey, number> = { x: 0, tiktok: 0, instagram: 0, youtube: 0, linkedin: 0, facebook: 0 };
        let reactions = 0;
        let comments = 0;
        let shares = 0;
        let views = 0; // views + appearances

        for (const a of allAnalysis || []) {
            sentiment[analysisSentiment(a.classify)]++;

            const key = (a.platform as string).toLowerCase() as PlatformKey;
            if (key in platforms) platforms[key]++;

            const s = a.statistics;
            reactions += s?.reactions || 0;
            comments += s?.comments || 0;
            shares += s?.shares || 0;
            views += (s?.views || 0) + (s?.appearance || 0);
        }

        return { sentiment, platforms, reactions, comments, shares, views, total: reactions + comments + shares + views };
    }, [allAnalysis]);

    const engagement = [
        { Icon: Heart, value: social.reactions, color: "#f472b6" },
        { Icon: MessageCircle, value: social.comments, color: "#38bdf8" },
        { Icon: Share2, value: social.shares, color: "#34d399" },
        { Icon: Eye, value: social.views, color: "#fbbf24" },
    ];

    return (
        <div className="flex flex-col gap-2">
            {/* ───── News ───── */}
            <Block
                accent={BLUE}
                icon={<NewspaperIcon className="h-4 w-4" />}
                title={t("news")}
                count={allNews?.length ?? 0}
            >
                <SentimentSplit counts={news} />
            </Block>

            {/* ───── Social media ───── */}
            <Block
                accent={VIOLET}
                icon={<Share2Icon className="h-4 w-4" />}
                title={t("socialMedia")}
                count={allAnalysis?.length ?? 0}
                sub={
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Zap className="h-3 w-3" style={{ color: VIOLET }} />
                        <span className="tabular-nums text-gray-200">{fmt(social.total)}</span>
                        {t("totalStatistics")}
                    </span>
                }
            >
                <SentimentSplit counts={social.sentiment} />

                {/* platforms */}
                <div className="grid grid-cols-6 gap-1 border-t border-gray-700/40 pt-2">
                    {PLATFORMS.map(({ key, Icon }) => {
                        const color = PLATFORM_COLOR[key] ?? "#64748b";
                        return (
                            <div
                                key={key}
                                className="flex items-center justify-center gap-1 rounded-md py-1"
                                style={{ background: `${color}14`, boxShadow: `inset 0 0 0 1px ${color}30` }}
                            >
                                <span style={{ color }}>
                                    <Icon className="h-3.5 w-3.5" />
                                </span>
                                <span className="truncate text-[10px] font-medium tabular-nums text-white">
                                    {social.platforms[key].toLocaleString()}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* engagement */}
                <div className="grid grid-cols-4 gap-1">
                    {engagement.map(({ Icon, value, color }, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-1.5 rounded-md border border-gray-700/50 bg-gray-800/40 px-1.5 py-1"
                        >
                            <Icon className="h-3.5 w-3.5 shrink-0" style={{ color }} />
                            <span className="truncate text-[11px] font-medium tabular-nums text-white">{fmt(value)}</span>
                        </div>
                    ))}
                </div>
            </Block>
        </div>
    );
};

export default SectorsSection;
