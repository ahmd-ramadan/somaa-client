'use client'

import { useAppSelector } from "@/lib/hooks"
import { RootState } from "@/lib/store"
import { IterationCcw } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import { useMemo, useState } from "react"
import { useLabels } from "./insights"
import DateTimePicker from "./DateTimePicker"
import { formatDate } from "@/utils/formatDateAndTime"

export interface IDateSectionProps {
    startDate: string
    endDate: string
    setStartDate: (date: string) => void
    setEndDate: (date: string) => void
    callData: () => void
    /** Return the dispatch promise so the spinner reflects the real request */
    handleShowMore: () => void | Promise<unknown>
    isLoading?: boolean
    /** How many analyses are on screen right now */
    loadedCount?: number
    /** Oldest / newest item actually loaded (ms) — makes it obvious what range the data really covers */
    loadedRange?: { from: number; to: number } | null
}

const DateSection = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    callData,
    handleShowMore,
    isLoading = false,
    loadedCount = 0,
    loadedRange = null,
}: IDateSectionProps) => {
    const t = useTranslations("DashboardPage")
    const L = useLabels()
    const locale = useLocale()
    const [isSpinning, setIsSpinning] = useState(false)
    const { dashboardPagenation } = useAppSelector((state: RootState) => state.analysis) as any

    // supports both store shapes (old: dashboardPagenation, new: pagenation)
    const pg = dashboardPagenation
    const hasMore = (pg?.totalPages ?? 0) > (pg?.page ?? 0)

    const dayFmt = useMemo(
        () => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'Asia/Riyadh' }),
        [locale]
    )

    const handleShowMoreClick = async () => {
        setIsSpinning(true)
        try {
            await handleShowMore()
        } catch (error) {
            console.error(error)
        } finally {
            setIsSpinning(false)
        }
    }

    const busy = isLoading || isSpinning

    return (
        <div className="flex flex-col gap-1.5 rounded-lg border border-gray-700/50 bg-gray-900/40 p-2 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2">
                <div className="relative h-9 w-36">
                    <Image src="/dash-logo.png" alt="Somaa Logo" fill sizes="144px" className="object-contain" />
                    <p className="text-[10px] tabular-nums text-gray-400">
                        {/* {L.loaded} {loadedCount.toLocaleString()} {L.items} */}
                        {/* {loadedRange && ` · ${formatDate({ date: loadedRange.from as any,  locale, withTime: true })} – ${formatDate({ date: loadedRange.to as any, locale, withTime: true })}`} */}
                    </p>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={callData}
                        disabled={isLoading}
                        className="rounded bg-gradient-to-r from-primary to-secondary px-3 py-1 text-xs font-semibold whitespace-nowrap text-white shadow transition hover:from-secondary hover:to-primary disabled:cursor-wait disabled:opacity-60"
                    >
                        {isLoading ? L.applying : t("updateTime")}
                    </button>
                    {hasMore && (
                        <button
                            onClick={handleShowMoreClick}
                            disabled={busy}
                            title={t("showMore")}
                            aria-label={t("showMore")}
                            className="rounded p-1 text-secondary transition-colors hover:bg-gray-700/50 disabled:opacity-50"
                        >
                            <IterationCcw className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
                <DateTimePicker value={startDate} onChange={setStartDate} ariaLabel="Start date" />
                <DateTimePicker value={endDate} onChange={setEndDate} ariaLabel="End date" />
            </div>

            {/* {loadedCount > 0 && (
                <p className="text-[10px] tabular-nums text-gray-400">
                    {L.loaded} {loadedCount.toLocaleString()} {L.items}
                    {loadedRange && ` · ${dayFmt.format(loadedRange.from)} – ${dayFmt.format(loadedRange.to)}`}
                </p>
            )} */}
        </div>
    )
}

export default DateSection;
