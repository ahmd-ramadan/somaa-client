import { INews } from "@/interfaces/news.types";

export type GroupingState = {
    [key: string]: { active: boolean; order?: number }
};

export interface GroupedNewsData {
    key: string;
    label: string;
    items: INews[];
    children: GroupedNewsData[];
    level: number;
    isCollapsed: boolean;
}

export interface AllNewsTableProps {}

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
        getValue: (item: INews) => string;
    };
}

export const groupingOrderMap: GroupingOrderMap = {
    adType: { key: 'adType', getValue: (item: INews) => item.adType },
    pressType: { key: 'pressType', getValue: (item: INews) => item.pressType },
    addedBy: { key: 'addedBy', getValue: (item: INews) => item.addedByData?.name || 'Unknown' },
    geoClassify: { key: 'geoClassify', getValue: (item: INews) => item.geoClassify },
    url: { key: 'url', getValue: (item: INews) => item.url },
    classify: { key: 'classify', getValue: (item: INews) => item.classify },
    title: { key: 'title', getValue: (item: INews) => item.title },
    newspaper: { key: 'newspaper', getValue: (item: INews) => item.newspaper },
    sector: { key: 'sector', getValue: (item: INews) => item.sectorData.name }
}; 