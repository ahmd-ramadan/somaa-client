'use client'

import { useMemo } from "react";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { IAnalysis } from "@/interfaces/analysis.types";
import AnalysisTicker from "./AnalysisTicker";

interface IImportantAnalysisSectionProps {
    allAnalysis: IAnalysis[]
}

const ImportantAnalysisSection = ({ allAnalysis }: IImportantAnalysisSectionProps) => {
    const t = useTranslations("DashboardPage");
    const important = useMemo(() => (allAnalysis || []).filter((a) => a.isHighlighted === true), [allAnalysis]);

    return (
        <AnalysisTicker
            title={t("importantMonitoring")}
            icon={<Star className="h-4 w-4" />}
            items={important}
            className="min-h-[240px] flex-1 transition bg-blend-color-burn bg-gradient-to-l from-primary to-secondary"
        />
    );
};

export default ImportantAnalysisSection;
