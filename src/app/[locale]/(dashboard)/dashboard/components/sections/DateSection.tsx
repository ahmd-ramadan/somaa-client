import { useAppSelector } from "@/lib/hooks"
import { RootState } from "@/lib/store"
import { IterationCcw } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

export interface IDateSectionProps {
    startDate: string
    endDate: string
    setStartDate: (date: string) => void
    setEndDate: (date: string) => void
    callData: () => void
    handleShowMore:  () => void
}

const DateSection = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    callData,
    handleShowMore
}: IDateSectionProps) => {

    const t = useTranslations("DashboardPage")
    const [isSpinning, setIsSpinning] = useState(false)

    const { dashboardPagenation } = useAppSelector((state: RootState) => state.analysis);

    const handleShowMoreClick = async () => {
        try {
            setIsSpinning(true)
            handleShowMore()
        } catch (error) {
            console.error(error)
        } finally {
            setIsSpinning(false)
        }
    }

    return (
        <div className="flex items-center gap-1 mb-1 w-full mx-1">
            <div className="w-[40%] flex flex-col gap-1">
                {/* <label className="absolute top-0 start-0 text-[10px] text-secondary flex items-center gap-0.5 whitespace-nowrap">
                    {t("from")}
                </label> */}
                <input
                    type="datetime-local"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value.slice(0, 16))}
                    className="w-full text-[10px] bg-gray-800 text-gray-200 rounded px-1 py-0.5 border border-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition outline-none text-xs"
                />
            </div>
            <div className="w-[40%] flex flex-col gap-1">
                {/* <label className="absolute top-0 start-0 text-[10px] text-secondary flex items-center gap-0.5 whitespace-nowrap">
                    {t("to")}
                </label> */}
                <input
                    type="datetime-local"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value.slice(0, 16))}
                    className="w-full text-[10px] bg-gray-800 text-gray-200 rounded px-1 py-0.5 border border-gray-700 focus:ring-1 focus:ring-green-500 focus:border-green-500 transition outline-none text-xs"
                />
            </div>
            <div className="w-[20%] flex items-center gap-1">
                <button
                    onClick={callData}
                    className={`h-full ${ dashboardPagenation?.totalPages > dashboardPagenation?.page ? 'w-[70%]' : 'w-[100%]'} bg-gradient-to-r from-primary to-secondary text-white px-2 py-0.5 rounded shadow hover:from-secondary hover:to-primary transition font-semibold text-xs whitespace-nowrap ${dashboardPagenation?.totalPages > dashboardPagenation?.page ? 'opacity-100' : 'opacity-50'}`}
                    // className="flex-1 bg-gray-700 text-white px-2 py-0.5 rounded shadow hover:from-blue-700 hover:to-green-600 transition font-semibold text-xs whitespace-nowrap"
                >
                    {t("updateTime")}
                </button>
                { dashboardPagenation?.totalPages > dashboardPagenation?.page && <div
                    onClick={handleShowMoreClick}
                        title={t("showMore")}
                        className="size-[30%] p-.5 rounded-sm text-secondary font-bold cursor-pointer"
                    >
                    <IterationCcw className={`w-full h-full transition-transform duration-200 ${isSpinning ? 'animate-spin' : ''}`} />
                    </div> 
                }
            </div>
        </div>
    )
}

export default DateSection;