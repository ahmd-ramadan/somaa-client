import { AnalysisClassifyEnum, PlatformsEnum } from "@/interfaces/analysis.types";
import { Variants } from "framer-motion";

export interface IDashboardClassify {
    type: AnalysisClassifyEnum,
    count: number
}

export interface IDashboardSubAnalysis {
    name: string,
    count: number,
    totalEngagement: number,
    classifications: IDashboardClassify[]
}

export interface IDashboardSector {
    name: string,
    total: number,
    classifications: IDashboardClassify[]
}

export interface IDashboardPublisher {
    name: string,
    handle?: string,
    avatar?: string,
    total: number,
    reactions: number,
    comments: number,
    shares: number,
    appearance: number,
    views: number
}

export interface IDashboardPlatform {
    platform: PlatformsEnum,
    total: number,
}

export const DashboardClassificationsDefault: IDashboardClassify[] = [
    { type: AnalysisClassifyEnum.POSITIVE, count: 0 },
    { type: AnalysisClassifyEnum.NEUTRAL, count: 0 },
    { type: AnalysisClassifyEnum.NEGATIVE, count: 0 },
]

export type IAnimationVariants = Variants; 