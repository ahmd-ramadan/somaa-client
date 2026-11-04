import {IStatistics } from "@/interfaces/analysis.types"

export const formatNumbers = (num: number) => {
    return num.toLocaleString('en-US')
}

export const getTotalStatistics = (statistics: IStatistics): number => {
    return statistics.comments + statistics.reactions + statistics.shares + statistics.shares + statistics.views + statistics.appearance;
}