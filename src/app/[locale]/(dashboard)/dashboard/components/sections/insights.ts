import { useMemo } from "react";
import { useLocale } from "next-intl";
import { AnalysisClassifyEnum, IAnalysis, PlatformsEnum } from "@/interfaces/analysis.types";
import { INews, NewsClassifyEnum } from "@/interfaces/news.types";

/* ------------------------------------------------------------------ */
/* Shared tokens                                                       */
/* ------------------------------------------------------------------ */

export type Sentiment = "positive" | "neutral" | "negative";

export const SENTIMENT_COLOR: Record<Sentiment, string> = {
    positive: "#22c55e",
    neutral: "#9ca3af",
    negative: "#ef4444",
};

export const PLATFORM_COLOR: Record<string, string> = {
    x: "#92d240",
    facebook: "#3b82f6",
    instagram: "#ec4899",
    tiktok: "#e5e7eb",
    youtube: "#dc2626",
    linkedin: "#8b5cf6",
};

const LABELS = {
    ar: {
        netSentiment: "صافي المشاعر",
        topPlatform: "أعلى منصة",
        peakTime: "ذروة النشاط",
        activityOverTime: "النشاط عبر الوقت",
        platformShare: "توزيع المنصات",
        topPublishers: "أكثر الناشرين تأثيراً",
        sectorsSentiment: "مشاعر القطاعات",
        subAnalysisSentiment: "مشاعر التحليلات الفرعية",
        posts: "رصد",
        followers: "متابع",
        items: "رصد",
        loaded: "تم تحميل",
        applying: "جارٍ التحديث…",
    },
    en: {
        netSentiment: "Net sentiment",
        topPlatform: "Top platform",
        peakTime: "Peak activity",
        activityOverTime: "Activity over time",
        platformShare: "Platform share",
        topPublishers: "Most influential publishers",
        sectorsSentiment: "Sectors sentiment",
        subAnalysisSentiment: "Sub-analysis sentiment",
        posts: "posts",
        followers: "followers",
        items: "items",
        loaded: "Loaded",
        applying: "Updating…",
    },
} as const;

/** Labels for the new sections. Move them into your next-intl messages whenever you like. */
export const useLabels = () => LABELS[useLocale() === "ar" ? "ar" : "en"];

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface ITimelineBucket {
    ts: number;
    label: string; // axis label (always includes the date)
    full: string; // tooltip label
    positive: number;
    neutral: number;
    negative: number;
    total: number;
}

export interface IPlatformShare {
    platform: PlatformsEnum;
    count: number;
    engagement: number;
}

export interface IPublisherRank {
    name: string;
    avatar?: string;
    platform: PlatformsEnum;
    followers: number;
    posts: number;
    engagement: number;
    net: number; // positive posts - negative posts
}

export interface IBreakdownRow {
    name: string;
    positive: number;
    neutral: number;
    negative: number;
    total: number;
}

export interface IDashboardInsights {
    totalMonitoring: number;
    analysisCount: number;
    newsCount: number;
    totalEngagement: number;
    sentimentScore: number; // -100 … +100
    timeline: ITimelineBucket[];
    peak: ITimelineBucket | null;
    platforms: IPlatformShare[];
    topPlatform: IPlatformShare | null;
    publishers: IPublisherRank[];
    sectorRows: IBreakdownRow[];
    subAnalysisRows: IBreakdownRow[];
}

/* ------------------------------------------------------------------ */
/* Pure helpers                                                        */
/* ------------------------------------------------------------------ */

export const analysisSentiment = (c: AnalysisClassifyEnum): Sentiment =>
    c === AnalysisClassifyEnum.POSITIVE ? "positive" : c === AnalysisClassifyEnum.NEGATIVE ? "negative" : "neutral";

export const newsSentiment = (c: NewsClassifyEnum): Sentiment =>
    c === NewsClassifyEnum.POSITIVE ? "positive" : c === NewsClassifyEnum.NEGATIVE ? "negative" : "neutral";

export const engagementOf = (a: IAnalysis): number => {
    const s = a.statistics;
    if (!s) return 0;
    return (s.reactions || 0) + (s.comments || 0) + (s.shares || 0) + (s.views || 0) + (s.appearance || 0);
};

const TZ = "Asia/Riyadh";
const HOUR = 36e5;
const DAY = 24 * HOUR;
const KSA_OFFSET = 3 * HOUR; // Riyadh is UTC+3 all year (no DST)
const floorTo = (t: number, step: number) => Math.floor((t + KSA_OFFSET) / step) * step - KSA_OFFSET;

/** Allowed bucket sizes, smallest first; the last one keeps even a multi-year range readable. */
const STEPS = [HOUR, 6 * HOUR, 12 * HOUR, DAY, 7 * DAY, 30 * DAY];
const MAX_BUCKETS = 120;

/** Smallest step that keeps the number of buckets bounded (instead of truncating the axis). */
const pickStep = (span: number) => STEPS.find((s) => span / s <= MAX_BUCKETS) ?? STEPS[STEPS.length - 1];

const timeOf = (a: IAnalysis): number => {
    const raw = a.publishDate || a.createdAt;
    const t = raw ? new Date(raw as string).getTime() : NaN;
    return Number.isFinite(t) ? t : NaN;
};

/**
 * Buckets for the "activity over time" chart.
 *
 * The window is the range that was actually applied, NOT the span of the loaded
 * rows: the API matches posts published OR added inside the range, so one old
 * article added today used to stretch the axis back to its publish year. Anchoring
 * to the range also keeps the axis steady while a refresh is in flight and after
 * "show more" appends another page.
 */
const buildTimeline = (
    list: IAnalysis[],
    locale: string,
    range?: { from: number; to: number } | null
): ITimelineBucket[] => {
    const seen = new Set<string>();
    const pts: { t: number; s: Sentiment }[] = [];
    let min = Infinity;
    let max = -Infinity;

    for (const a of list) {
        const t = timeOf(a);
        if (!Number.isFinite(t)) continue;
        // pages overlap when new posts land between two "show more" calls
        const key = a?._id ? String(a._id) : null;
        if (key) {
            if (seen.has(key)) continue;
            seen.add(key);
        }
        pts.push({ t, s: analysisSentiment(a.classify) });
        if (t < min) min = t;
        if (t > max) max = t;
    }

    const hasRange =
        !!range && Number.isFinite(range.from) && Number.isFinite(range.to) && range.to > range.from;
    const from = hasRange ? (range as { from: number; to: number }).from : min;
    const to = hasRange ? (range as { from: number; to: number }).to : max;
    if (!Number.isFinite(from) || !Number.isFinite(to)) return [];

    const span = Math.max(to - from, 0);
    const step = pickStep(span);

    /* the axis always carries the date, so hour buckets are never ambiguous */
    const axisFmt = new Intl.DateTimeFormat(
        locale,
        step < DAY
            ? { day: "numeric", month: "short", hour: "numeric", timeZone: TZ }
            : span > 300 * DAY
                ? { month: "short", year: "numeric", timeZone: TZ }
                : { day: "numeric", month: "short", timeZone: TZ }
    );
    const fullFmt = new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        ...(step < DAY ? { timeStyle: "short" as const } : {}),
        timeZone: TZ,
    });

    const buckets = new Map<number, ITimelineBucket>();
    const start = floorTo(from, step);
    const end = floorTo(to, step);
    for (let ts = start; ts <= end; ts += step) {
        buckets.set(ts, {
            ts,
            label: axisFmt.format(ts),
            full: fullFmt.format(ts),
            positive: 0,
            neutral: 0,
            negative: 0,
            total: 0,
        });
    }

    for (const p of pts) {
        const b = buckets.get(floorTo(p.t, step));
        if (!b) continue; // published outside the applied range (matched only by createdAt)
        b[p.s]++;
        b.total++;
    }
    return Array.from(buckets.values());
};

const buildBreakdown = (items: { name?: string; s: Sentiment }[], limit = 6): IBreakdownRow[] => {
    const map = new Map<string, IBreakdownRow>();
    for (const { name, s } of items) {
        const key = name?.trim();
        if (!key) continue;
        let row = map.get(key);
        if (!row) {
            row = { name: key, positive: 0, neutral: 0, negative: 0, total: 0 };
            map.set(key, row);
        }
        row[s]++;
        row.total++;
    }
    return Array.from(map.values())
        .sort((a, b) => b.total - a.total)
        .slice(0, limit);
};

/* ------------------------------------------------------------------ */
/* Hook — compute everything ONCE in the layout and pass it down       */
/* ------------------------------------------------------------------ */

export const useDashboardInsights = (
    allAnalysis: IAnalysis[],
    allNews: INews[],
    range?: { from: number; to: number } | null
): IDashboardInsights => {
    const locale = useLocale();

    return useMemo(() => {
        const analysis = allAnalysis || [];
        const news = allNews || [];

        let totalEngagement = 0;
        let pos = 0;
        let neg = 0;

        const platformMap = new Map<PlatformsEnum, IPlatformShare>();
        const publisherMap = new Map<string, IPublisherRank>();

        for (const a of analysis) {
            const e = engagementOf(a);
            totalEngagement += e;

            const s = analysisSentiment(a.classify);
            if (s === "positive") pos++;
            else if (s === "negative") neg++;

            const p = platformMap.get(a.platform) ?? { platform: a.platform, count: 0, engagement: 0 };
            p.count++;
            p.engagement += e;
            platformMap.set(a.platform, p);

            const name = a.publisher?.name;
            if (name) {
                const r = publisherMap.get(name) ?? {
                    name,
                    avatar: a.publisher?.avatar,
                    platform: a.platform,
                    followers: 0,
                    posts: 0,
                    engagement: 0,
                    net: 0,
                };
                r.posts++;
                r.engagement += e;
                r.followers = Math.max(r.followers, a.publisher?.followers || 0);
                r.net += s === "positive" ? 1 : s === "negative" ? -1 : 0;
                if (!r.avatar && a.publisher?.avatar) r.avatar = a.publisher.avatar;
                publisherMap.set(name, r);
            }
        }

        for (const n of news) {
            const s = newsSentiment(n.classify);
            if (s === "positive") pos++;
            else if (s === "negative") neg++;
        }

        const totalMonitoring = analysis.length + news.length;
        const timeline = buildTimeline(analysis, locale, range);
        const peak = timeline.reduce<ITimelineBucket | null>(
            (best, b) => (b.total > 0 && (!best || b.total > best.total) ? b : best),
            null
        );
        const platforms = Array.from(platformMap.values()).sort((a, b) => b.count - a.count);

        return {
            totalMonitoring,
            analysisCount: analysis.length,
            newsCount: news.length,
            totalEngagement,
            sentimentScore: totalMonitoring ? Math.round(((pos - neg) / totalMonitoring) * 100) : 0,
            timeline,
            peak,
            platforms,
            topPlatform: platforms[0] ?? null,
            publishers: Array.from(publisherMap.values())
                .sort((a, b) => b.engagement - a.engagement)
                .slice(0, 6),
            sectorRows: buildBreakdown([
                ...analysis.map((a) => ({ name: a.sectorData?.name, s: analysisSentiment(a.classify) })),
                ...news.map((n) => ({ name: n.sectorData?.name, s: newsSentiment(n.classify) })),
            ]),
            subAnalysisRows: buildBreakdown(
                analysis.map((a) => ({ name: a.subAnalysisData?.body, s: analysisSentiment(a.classify) }))
            ),
        };
    }, [allAnalysis, allNews, locale, range?.from, range?.to]);
};
