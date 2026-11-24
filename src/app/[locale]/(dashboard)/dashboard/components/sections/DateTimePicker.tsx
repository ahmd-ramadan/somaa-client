'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { useLocale } from "next-intl";
import { toZonedTime } from "date-fns-tz";

/**
 * Drop-in replacement for <input type="datetime-local">.
 * The browser's own popup can't have an "OK" button, so this one keeps a DRAFT:
 * nothing changes until you press OK; outside-click / Esc / Cancel discard it.
 *
 * value / onChange use the same "yyyy-MM-ddTHH:mm" wall-clock string as datetime-local.
 */

interface IDateTimePickerProps {
    value: string;
    onChange: (value: string) => void;
    ariaLabel?: string;
}

interface IParts {
    y: number;
    mo: number; // 0–11
    d: number;
    h: number; // 0–23
    mi: number;
}

const TZ = "Asia/Riyadh";
const DAY_MS = 86_400_000;

const T = {
    ar: { ok: "موافق", cancel: "إلغاء", today: "اليوم", am: "ص", pm: "م" },
    en: { ok: "OK", cancel: "Cancel", today: "Today", am: "AM", pm: "PM" },
} as const;

const pad = (n: number) => String(n).padStart(2, "0");
const toValue = (p: IParts) => `${String(p.y).padStart(4, "0")}-${pad(p.mo + 1)}-${pad(p.d)}T${pad(p.h)}:${pad(p.mi)}`;

const parse = (v: string): IParts | null => {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(v);
    return m ? { y: +m[1], mo: +m[2] - 1, d: +m[3], h: +m[4], mi: +m[5] } : null;
};

/** "Now" as Riyadh wall-clock parts. */
const nowKSA = (): IParts => {
    const n = toZonedTime(new Date(), TZ);
    return { y: n.getFullYear(), mo: n.getMonth(), d: n.getDate(), h: n.getHours(), mi: n.getMinutes() };
};

const DateTimePicker = ({ value, onChange, ariaLabel }: IDateTimePickerProps) => {
    const locale = useLocale();
    const rtl = locale === "ar";
    const L = T[rtl ? "ar" : "en"];

    const triggerRef = useRef<HTMLButtonElement>(null);
    const popRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [host, setHost] = useState<HTMLElement | null>(null);
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
    const [draft, setDraft] = useState<IParts>(() => parse(value) ?? nowKSA());
    const [view, setView] = useState<{ y: number; mo: number }>(() => {
        const p = parse(value) ?? nowKSA();
        return { y: p.y, mo: p.mo };
    });

    /* ---------- formatting (wall-clock fields formatted as UTC, so no timezone shift) ---------- */

    const triggerFmt = useMemo(
        () => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }),
        [locale]
    );
    const monthFmt = useMemo(
        () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }),
        [locale]
    );
    const weekdays = useMemo(() => {
        const f = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
        return Array.from({ length: 7 }, (_, i) => f.format(Date.UTC(2023, 0, 1 + i))); // 2023-01-01 is a Sunday
    }, [locale]);

    const current = parse(value);
    const triggerText = current ? triggerFmt.format(Date.UTC(current.y, current.mo, current.d, current.h, current.mi)) : "—";

    /* ---------- open / close ---------- */

    const openPicker = () => {
        const base = parse(value) ?? nowKSA();
        setDraft(base);
        setView({ y: base.y, mo: base.mo });
        // in fullscreen only the fullscreen element's subtree is visible, so the popup must live inside it
        setHost((document.fullscreenElement as HTMLElement | null) ?? document.body);
        setOpen(true);
    };

    const close = useCallback(() => {
        setOpen(false);
        setPos(null);
    }, []);

    const commit = () => {
        onChange(toValue(draft));
        close();
    };

    /* ---------- positioning (fixed, so scroll containers can't clip it) ---------- */

    const place = useCallback(() => {
        const trigger = triggerRef.current;
        const pop = popRef.current;
        if (!trigger || !pop) return;
        const r = trigger.getBoundingClientRect();
        const w = pop.offsetWidth;
        const h = pop.offsetHeight;
        const left = Math.min(Math.max(8, r.left), Math.max(8, window.innerWidth - w - 8));
        let top = r.bottom + 6;
        if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 6); // flip above
        setPos({ top, left });
    }, []);

    useLayoutEffect(() => {
        if (open) place();
    }, [open, host, place]);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            const target = e.target as Node;
            if (popRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
            close(); // discards the draft
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
            if (e.key === "Enter" && popRef.current?.contains(document.activeElement)) {
                if ((document.activeElement as HTMLElement).tagName !== "SELECT") commit();
            }
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        window.addEventListener("resize", place);
        window.addEventListener("scroll", place, true);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
            window.removeEventListener("resize", place);
            window.removeEventListener("scroll", place, true);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, close, place, draft]);

    /* ---------- calendar grid: always 6 weeks, so the popup height never jumps ---------- */

    const today = useMemo(() => nowKSA(), [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const cells = useMemo(() => {
        const firstDow = new Date(Date.UTC(view.y, view.mo, 1)).getUTCDay();
        const start = Date.UTC(view.y, view.mo, 1 - firstDow);
        return Array.from({ length: 42 }, (_, i) => {
            const dt = new Date(start + i * DAY_MS);
            return { y: dt.getUTCFullYear(), mo: dt.getUTCMonth(), d: dt.getUTCDate() };
        });
    }, [view]);

    const shiftMonth = (delta: number) =>
        setView((v) => {
            const dt = new Date(Date.UTC(v.y, v.mo + delta, 1));
            return { y: dt.getUTCFullYear(), mo: dt.getUTCMonth() };
        });

    const pickDay = (c: { y: number; mo: number; d: number }) => {
        setDraft((p) => ({ ...p, y: c.y, mo: c.mo, d: c.d }));
        setView({ y: c.y, mo: c.mo });
    };

    const goToday = () => {
        const n = nowKSA();
        setDraft((p) => ({ ...p, y: n.y, mo: n.mo, d: n.d }));
        setView({ y: n.y, mo: n.mo });
    };

    /* ---------- 12-hour time ---------- */

    const h12 = draft.h % 12 || 12;
    const isPm = draft.h >= 12;
    const setHour12 = (n: number) => setDraft((p) => ({ ...p, h: (n % 12) + (p.h >= 12 ? 12 : 0) }));
    const setMinute = (n: number) => setDraft((p) => ({ ...p, mi: n }));
    const setPm = (pm: boolean) => setDraft((p) => ({ ...p, h: (p.h % 12) + (pm ? 12 : 0) }));

    const selectClass =
        "rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

    const popover = (
        <div
            ref={popRef}
            role="dialog"
            aria-label={ariaLabel}
            dir={rtl ? "rtl" : "ltr"}
            className="fixed z-[9999] w-[272px] rounded-xl border border-gray-700 bg-gray-900 p-3 text-gray-100 shadow-2xl"
            style={{ top: pos?.top ?? 0, left: pos?.left ?? 0, visibility: pos ? "visible" : "hidden" }}
        >
            {/* month header */}
            <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">{monthFmt.format(Date.UTC(view.y, view.mo, 1))}</span>
                <div className="flex items-center gap-1">
                    <button type="button" onClick={() => shiftMonth(-1)} className="rounded p-1 text-gray-300 hover:bg-gray-700" aria-label="Previous month">
                        <ChevronUp className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => shiftMonth(1)} className="rounded p-1 text-gray-300 hover:bg-gray-700" aria-label="Next month">
                        <ChevronDown className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* weekdays */}
            <div className="mb-1 grid grid-cols-7 text-center text-[10px] text-gray-400">
                {weekdays.map((w, i) => (
                    <span key={i} className="truncate">{w}</span>
                ))}
            </div>

            {/* days */}
            <div className="grid grid-cols-7 gap-y-0.5 text-center">
                {cells.map((c, i) => {
                    const inMonth = c.mo === view.mo;
                    const selected = c.y === draft.y && c.mo === draft.mo && c.d === draft.d;
                    const isToday = c.y === today.y && c.mo === today.mo && c.d === today.d;
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => pickDay(c)}
                            onDoubleClick={commit}
                            className={[
                                "mx-auto flex h-8 w-8 items-center justify-center rounded-md text-xs tabular-nums transition-colors",
                                selected
                                    ? "bg-blue-500 font-semibold text-white"
                                    : inMonth
                                        ? "text-gray-100 hover:bg-gray-700"
                                        : "text-gray-600 hover:bg-gray-800",
                                isToday && !selected ? "ring-1 ring-blue-400" : "",
                            ].join(" ")}
                        >
                            {c.d}
                        </button>
                    );
                })}
            </div>

            {/* time */}
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-700/60 pt-3" >
                <div className="flex items-center gap-1">
                    <select value={h12} onChange={(e) => setHour12(+e.target.value)} className={selectClass} aria-label="Hour">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>{pad(n)}</option>
                        ))}
                    </select>
                    <span className="text-gray-400">:</span>
                    <select value={draft.mi} onChange={(e) => setMinute(+e.target.value)} className={selectClass} aria-label="Minute">
                        {Array.from({ length: 60 }, (_, i) => i).map((n) => (
                            <option key={n} value={n}>{pad(n)}</option>
                        ))}
                    </select>
                </div>

                <div className="flex overflow-hidden rounded-md border border-gray-700 text-xs">
                    {[false, true].map((pm) => (
                        <button
                            key={String(pm)}
                            type="button"
                            onClick={() => setPm(pm)}
                            className={`px-2.5 py-1 transition-colors ${isPm === pm ? "bg-blue-500 font-semibold text-white" : "text-gray-300 hover:bg-gray-700"}`}
                        >
                            {pm ? L.pm : L.am}
                        </button>
                    ))}
                </div>
            </div>

            {/* actions */}
            <div className="mt-3 flex items-center justify-between">
                <button type="button" onClick={goToday} className="text-xs text-blue-400 hover:underline">
                    {L.today}
                </button>
                <div className="flex items-center gap-1.5">
                    <button type="button" onClick={close} className="rounded-md px-3 py-1 text-xs text-gray-300 hover:bg-gray-700">
                        {L.cancel}
                    </button>
                    <button
                        type="button"
                        onClick={commit}
                        className="rounded-md bg-gradient-to-r from-primary to-secondary px-4 py-1 text-xs font-semibold text-white shadow transition hover:from-secondary hover:to-primary"
                    >
                        {L.ok}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                onClick={() => (open ? close() : openPicker())}
                aria-label={ariaLabel}
                aria-haspopup="dialog"
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-2 rounded border border-gray-700 bg-gray-800 px-1.5 py-1 text-[11px] text-gray-200 outline-none transition hover:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
                <span className="truncate tabular-nums" dir={rtl ? "rtl" : "ltr"}>{triggerText}</span>
                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            </button>

            {open && host && createPortal(popover, host)}
        </>
    );
};

export default DateTimePicker;
