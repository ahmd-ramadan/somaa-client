import { useTranslations } from "next-intl"

export interface IDateSectionProps {
    startDate: string
    endDate: string
    setStartDate: (date: string) => void
    setEndDate: (date: string) => void
    callData: () => void
}

const DateSection = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    callData
}: IDateSectionProps) => {

    const t = useTranslations("DashboardPage")

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
            <div className="w-[20%]">
                <button
                    onClick={callData}
                    className="h-full w-full bg-gradient-to-r from-primary to-secondary text-white px-2 py-0.5 rounded shadow hover:from-secondary hover:to-primary transition font-semibold text-xs whitespace-nowrap"
                    // className="flex-1 bg-gray-700 text-white px-2 py-0.5 rounded shadow hover:from-blue-700 hover:to-green-600 transition font-semibold text-xs whitespace-nowrap"
                >
                    {t("updateTime")}
                </button>
            </div>
        </div>
    )
}

export default DateSection;