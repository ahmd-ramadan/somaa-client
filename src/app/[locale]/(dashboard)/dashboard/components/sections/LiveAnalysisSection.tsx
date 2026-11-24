'use client'

import { Radio } from "lucide-react";
import { useTranslations } from "next-intl";
import { IAnalysis } from "@/interfaces/analysis.types";
import AnalysisTicker from "./AnalysisTicker";

interface ILiveAnalysisSectionProps {
    allAnalysis: IAnalysis[]
}

const LiveAnalysisSection = ({ allAnalysis }: ILiveAnalysisSectionProps) => {
    const t = useTranslations("DashboardPage");

    return (
        <AnalysisTicker
            title={t("liveMonitoring")}
            icon={<Radio className="h-4 w-4" />}
            items={allAnalysis || []}
            className="min-h-[240px] flex-1"
        />
    );
};

export default LiveAnalysisSection;