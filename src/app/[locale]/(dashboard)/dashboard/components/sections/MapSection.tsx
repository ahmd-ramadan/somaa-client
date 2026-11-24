'use client'

import { IAnalysis } from "@/interfaces/analysis.types"
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from "react";

interface IMapSectionProps {
    allAnalysis: IAnalysis[]
}

// Dynamically import the map component with no SSR
const MapWithNoSSR = dynamic(
    () => import('./MapComponent').then((mod) => mod.default),
    {
        ssr: false,
        loading: () => (
            <div className="aspect-video bg-gray-800 rounded-lg flex-grow flex items-center justify-center text-gray-400 h-full">
                Loading map...
            </div>
        ),
    }
);

const SAUDI_CENTER: [number, number] = [23.8859, 45.0792];

const MapSection = ({ allAnalysis }: IMapSectionProps) => {
    const [isMounted, setIsMounted] = useState(false);
    // Get last 5 analyses with valid locations
    const last5Analyses = useMemo(() => allAnalysis
        .filter(a => a.location && typeof a.location.lat === 'number' && typeof a.location.lng === 'number')
        // .slice(0, 10);
    , [allAnalysis]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="w-full h-full min-h-[300px] flex flex-col rounded-lg">
            <div className="flex-1 relative w-full h-full  rounded-lg">
                {isMounted && (
                    <MapWithNoSSR
                        center={SAUDI_CENTER}
                        analyses={last5Analyses}
                        key="dashboard-map"
                    />
                )}
            </div>
        </div>
    )
}

export default MapSection
