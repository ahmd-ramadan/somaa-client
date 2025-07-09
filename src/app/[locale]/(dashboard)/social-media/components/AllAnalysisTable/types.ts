import { AnalysisClassifyEnum, ContentTypesEnum, IAnalysis, PlatformsEnum, TweetTypesEnum } from "@/interfaces/analysis.types";

export type GroupingState = {
    [key: string]: { active: boolean; order?: number }
};

export interface GroupedAnalysisData {
    key: string;
    label: string;
    items: IAnalysis[];
    children: GroupedAnalysisData[];
    level: number;
    isCollapsed: boolean;
}

export interface AllAnalysisTableProps {}

export interface HoveredImage {
    src: string;
    name: string;
    position: { x: number; y: number };
}

export interface UnoptimizedAvatars {
    [key: string]: { publisher: boolean; addedBy: boolean; avatar: string };
}

export interface GroupingOrderMap {
    [key: string]: {
        key: string;
        getValue: (item: IAnalysis) => string;
    };
}

export const groupingOrderMap: GroupingOrderMap = {
    sector: { key: 'sector', getValue: (item: IAnalysis) => item.sectorData.name },
    addedBy: { key: 'addedBy', getValue: (item: IAnalysis) => item.addedByData?.name || 'Unknown' },
    platform: { key: 'platform', getValue: (item: IAnalysis) => item.platform },
    publisher: { key: 'publisher', getValue: (item: IAnalysis) => item.publisher.name },
    subAnalysis: { key: 'subAnalysis', getValue: (item: IAnalysis) => item.subAnalysisData.body },
    classify: { key: 'classify', getValue: (item: IAnalysis) => item.classify },
    contentType: { key: 'contentType', getValue: (item: IAnalysis) => item.content?.type },
    tweetType: { key: 'tweetType', getValue: (item: IAnalysis) => item.tweetType }
}; 