'use client'

import { IAnalysis } from "@/interfaces/analysis.types";
import { INews } from "@/interfaces/news.types";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import ClassificationSection from "./sections/ClassificationSection";
import ImportantAnalysisSection from "./sections/ImportantAnalysisSection";
import LiveAnalysisSection from "./sections/LiveAnalysisSection";
import MapSection from "./sections/MapSection";
import DateSection from "./sections/DateSection";
import KpiStrip from "./sections/KpiStrip";
import ActivityTimelineChart from "./sections/ActivityTimelineChart";
import PlatformShareChart from "./sections/PlatformShareChart";
import TopPublishersSection from "./sections/TopPublishersSection";
import SentimentBreakdownChart from "./sections/SentimentBreakdownChart";
import { useDashboardInsights, useLabels } from "./sections/insights";
import { ListTree, Maximize2, Minimize2 } from "lucide-react";
import { toZonedTime, fromZonedTime, format } from 'date-fns-tz'
import { fetchAllAnalysis } from "@/lib/features/socialMedia/analysisThunks";
import { fetchAllNews } from "@/lib/features/news/newsthunks";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import SocialAndNewsEngagements from "./sections/SocialAndNewsEngagements";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const timeZone = 'Asia/Riyadh';
const WALL_PATTERN = "yyyy-MM-dd'T'HH:mm";

/** 0 = off. Set e.g. 60_000 to re-fetch page 1 of the APPLIED range every minute (the old socket made this "live"). */
const AUTO_REFRESH_MS = 0;

// stable reference, so `allAnalysis = []` can't create a new array every render
const EMPTY_ANALYSIS: IAnalysis[] = [];

/**
 * Today 00:00 → 23:59 as Riyadh wall-clock strings (what the datetime-local inputs hold).
 * The old version converted to Riyadh time twice, which is why a browser outside Saudi time showed 01:00 / 12:59.
 */
const getInitialDates = () => {
    const nowKSA = toZonedTime(new Date(), timeZone); // its local fields = Riyadh wall time
    const start = new Date(nowKSA);
    start.setHours(0, 0, 0, 0);
    const end = new Date(nowKSA);
    end.setHours(23, 59, 0, 0);
    return { start: format(start, WALL_PATTERN), end: format(end, WALL_PATTERN) };
};

/** Riyadh wall-clock string from the inputs → the real instant, whatever the browser's timezone is. */
const toInstant = (wall: string) => fromZonedTime(wall, timeZone);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

/** Column shell: on lg+ each column fills the viewport height and scrolls internally only if it must. */
const colClass = "flex min-h-0 flex-col gap-2 lg:overflow-y-auto custom-scrollbar";

const DashboardLayout = () => {
    const L = useLabels();
    const dispatch = useAppDispatch();
    const [allNews, setAllNews] = useState<INews[]>([]);
    const [error, setError] = useState<string | null>(null);
    /** the range the chart buckets by — set when "تطبيق" runs, so the axis does not jump with the data */
    const [appliedWindow, setAppliedWindow] = useState<{ from: number; to: number } | null>(null);

    const [isMounted, setIsMounted] = useState(false);
    const [startDate, setStartDate] = useState(() => getInitialDates().start);
    const [endDate, setEndDate] = useState(() => getInitialDates().end);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);

    const { allAnalysisForDashboard: allAnalysis = EMPTY_ANALYSIS, dashboardPagenation: pagenation, allAnalysisStatus } =
        useAppSelector((state: RootState) => state.analysis);
    const isLoading = allAnalysisStatus === 'loading';

    // ✅ A hook is called at the top level — never inside useEffect/useState(...). It already memoizes itself.
    const insights = useDashboardInsights(allAnalysis, allNews, appliedWindow);
    const tl = insights.timeline;
    const loadedRange = tl.length ? { from: tl[0].ts, to: tl[tl.length - 1].ts } : null;

    /** The range that was actually requested. "Show more" and auto-refresh use THIS, not whatever is typed in the inputs. */
    const appliedRange = useRef<{ from: Date; to: Date } | null>(null);
    /** Lets a slow older news response be ignored when a newer Apply was clicked. */
    const newsRequestId = useRef(0);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // auto-dismiss the error toast
    useEffect(() => {
        if (!error) return;
        const id = setTimeout(() => setError(null), 6000);
        return () => clearTimeout(id);
    }, [error]);

    /** First page of analysis + the news for a range. Matches posts published OR added inside the range. */
    const loadRange = useCallback((from: Date, to: Date) => {
        const reqId = ++newsRequestId.current;

        // News feeds the KPIs, sectors and classification, so it must follow the same range.
        dispatch(fetchAllNews({ startDate: from, endDate: to }))
            .then((res: any) => {
                if (reqId !== newsRequestId.current) return; // superseded by a newer Apply
                if (res?.meta?.requestStatus === 'rejected') {
                    // keep what is on screen instead of wiping it, and say why
                    setError(res?.error?.message || 'تعذر تحميل الأخبار');
                    return;
                }
                const payload = res?.payload;
                const list = Array.isArray(payload) ? payload : payload?.data;
                setAllNews(Array.isArray(list) ? list : []);
            })
            .catch((e: any) => reqId === newsRequestId.current && setError(e?.message || 'تعذر تحميل الأخبار'));

        return dispatch(fetchAllAnalysis({
            startDate: from,
            endDate: to,
            publishStartDate: from,
            publishEndDate: to,
            matchAnyDate: true,
            pagenationQuery: { page: 1 },
            forDashboard: true
        }))
            .then((res: any) => {
                // createAsyncThunk never rejects the promise — it resolves with a "rejected" action
                if (res?.meta?.requestStatus === 'rejected') setError(res?.error?.message || 'تعذر تحميل البيانات');
                return res;
            })
            .catch((e: any) => setError(e?.message || 'تعذر تحميل البيانات'));
    }, [dispatch]);

    /** The "تطبيق" button. */
    const requestData = useCallback(() => {
        if (!startDate || !endDate) return;
        const from = toInstant(startDate);
        const to = toInstant(endDate);
        if (!(from < to)) {
            setError('تاريخ البداية يجب أن يسبق تاريخ النهاية');
            return;
        }
        appliedRange.current = { from, to };
        setAppliedWindow({ from: from.getTime(), to: to.getTime() });
        return loadRange(from, to);
    }, [startDate, endDate, loadRange]);

    // Load the current day once the dashboard mounts (the socket used to do this).
    const didInitialFetch = useRef(false);
    useEffect(() => {
        if (!isMounted || didInitialFetch.current) return;
        didInitialFetch.current = true;
        requestData();
    }, [isMounted, requestData]);

    // Optional polling. NOTE: re-fetching page 1 resets any pages added with "show more".
    useEffect(() => {
        if (!AUTO_REFRESH_MS) return;
        const id = setInterval(() => {
            const r = appliedRange.current;
            if (r) loadRange(r.from, r.to);
        }, AUTO_REFRESH_MS);
        return () => clearInterval(id);
    }, [loadRange]);

    useEffect(() => {
        const onChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onChange);
        return () => {
            document.removeEventListener('fullscreenchange', onChange);
            if (document.fullscreenElement) document.exitFullscreen();
        };
    }, []);

    const handleToggleFullscreen = () => {
        if (!document.fullscreenElement) dashboardRef.current?.requestFullscreen();
        else document.exitFullscreen();
    };

    // Next page of the APPLIED range (not of unapplied input edits), appended by the reducer.
    // Returns the dispatch promise so DateSection's spinner is real.
    const handleShowMore = () => {
        const r = appliedRange.current;
        if (!r || isLoading) return;
        return dispatch(fetchAllAnalysis({
            startDate: r.from,
            endDate: r.to,
            publishStartDate: r.from,
            publishEndDate: r.to,
            matchAnyDate: true,
            pagenationQuery: { page: (pagenation?.page ?? 1) + 1 },
            forDashboard: true
        }));
    };

    return (
        <div className="backround-pattern-2">
            <div
                ref={dashboardRef}
                className="relative flex min-h-screen w-full flex-col gap-2 bg-[#2e3537] dark:bg-[#2e3537] lg:h-screen lg:overflow-hidden"
            >
                {error && (
                    <div
                        role="alert"
                        onClick={() => setError(null)}
                        className="fixed top-4 right-4 z-50 cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm text-white shadow-lg"
                    >
                        {error}
                    </div>
                )}

                {isMounted && (
                    <motion.div
                        className="flex min-h-0 flex-1 flex-col gap-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* KPI strip + fullscreen toggle */}
                        <motion.div variants={itemVariants} className="flex shrink-0 items-stretch gap-2">
                            <div className="min-w-0 flex-1">
                                <KpiStrip insights={insights} />
                            </div>
                            <button
                                onClick={handleToggleFullscreen}
                                className="shrink-0 rounded-lg border border-gray-700/50 bg-gray-900/40 px-2 transition hover:bg-gray-800"
                                title={isFullscreen ? "خروج من ملء الشاشة" : "ملء الشاشة"}
                                aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                            >
                                {isFullscreen ? <Minimize2 className="h-4 w-4 text-white" /> : <Maximize2 className="h-4 w-4 text-white" />}
                            </button>
                        </motion.div>

                        {/* One-screen board: 25% | 50% | 25% */}
                        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-4">
                            {/* ───── Column 1 (right in RTL): filters + the two tickers ───── */}
                            <motion.div variants={itemVariants} className={colClass}>
                                <DateSection
                                    startDate={startDate}
                                    endDate={endDate}
                                    setStartDate={setStartDate}
                                    setEndDate={setEndDate}
                                    handleShowMore={handleShowMore}
                                    callData={requestData}
                                    isLoading={isLoading}
                                    loadedCount={allAnalysis.length}
                                    loadedRange={loadedRange}
                                />
                                <ImportantAnalysisSection allAnalysis={allAnalysis} />
                                <LiveAnalysisSection allAnalysis={allAnalysis} />
                            </motion.div>

                            {/* ───── Column 2: map + publishers, tables, timeline, breakdowns ───── */}
                            <motion.div variants={itemVariants} className={`${colClass} lg:col-span-2 h-full`}>
                                <div className="flex flex-col gap-2 lg:h-[clamp(280px,36vh,420px)] lg:shrink-0 lg:flex-row">
                                    <MapSection allAnalysis={allAnalysis} />
                                    <TopPublishersSection insights={insights}/>
                                    {/* <PublishersSection allAnalysis={allAnalysis} /> */}
                                    {/* <PlatformShareChart insights={insights} /> */}
                                </div>

                                {/* <div className="shrink-0">
                                    <SubAnalysisAndSectorsSection allAnalysis={allAnalysis} allNews={allNews} />
                                </div> */}

                                <div className="grid shrink-0 grid-cols-1 gap-2 lg:grid-cols-3">
                                    <div className="h-[200px] lg:col-span-3">
                                        <ActivityTimelineChart insights={insights} />
                                    </div>
                                    {/* <div className="h-[200px] lg:h-full">
                                        <PlatformShareChart insights={insights} />
                                    </div> */}
                                </div>

                                {/* breakdown grows into whatever height the column has left */}
                                <div className="grid min-h-0 flex-1 grid-cols-1 gap-2">
                                    {/* <SentimentBreakdownChart
                                        title={L.sectorsSentiment}
                                        icon={<Layers className="h-4 w-4" />}
                                        rows={insights.sectorRows.slice(0, 5)}
                                    /> */}
                                    <SentimentBreakdownChart
                                        title={L.subAnalysisSentiment}
                                        icon={<ListTree className="h-4 w-4" />}
                                        rows={insights.subAnalysisRows.slice(0, 20)}
                                        className="h-full"
                                    />
                                    {/* <PlatformShareChart insights={insights} /> */}
                                </div>
                            </motion.div>

                            {/* ───── Column 3 (left in RTL): sentiment, sectors, people ───── */}
                            <motion.div variants={itemVariants} className={colClass}>
                                <ClassificationSection allAnalysis={allAnalysis} allNews={allNews} />
                                <div className="shrink-0">
                                    <SocialAndNewsEngagements allAnalysis={allAnalysis} allNews={allNews} />
                                </div>
                                <div className="max-h-[500px] flex-1">
                                    {/* <TopPublishersSection insights={insights} /> */}
                                    <PlatformShareChart insights={insights} />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DashboardLayout;
