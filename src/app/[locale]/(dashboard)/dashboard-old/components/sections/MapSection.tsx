'use client'

import { IAnalysis } from "@/interfaces/analysis.types"
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { MapLocation } from "./MapComponent";

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
const MapSection = ({ allAnalysis }: IMapSectionProps) => {

    const [lastAnalysisLocation, setLastAnalysisLocation] = useState<MapLocation>({ lat: 31.9522, lng: 35.9231 })
    const [mapCenter, setMapCenter] = useState<[number, number]>([31.9522, 35.9231]); // Default to Jordan
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    useEffect(() => {
        if(allAnalysis) setLastAnalysisLocation(deriveLastAnalysisLocation(allAnalysis))
    }, [allAnalysis])

    const deriveLastAnalysisLocation = (analysisData: IAnalysis[]): MapLocation => {
        const location = analysisData.at(-1)?.location
        console.log(location);
        return { lat: location?.lat as number, lng: location?.lng as number }
    }

    return (
        <div className="w-5/6 bg-gray-800/50 backdrop-blur-sm rounded-lg shadow border border-gray-700/50 hover:shadow-xl transition-all duration-300 flex flex-col">
        {/* <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            خريطة التحليلات
        </h3> */}
        <div className="flex-1 relative">
            {isMounted && (
                <MapWithNoSSR 
                    center={mapCenter}
                    lastAnalysisLocation={lastAnalysisLocation}
                    key="dashboard-map"
                />
            )}
        </div>
    </div>
    )
}

export default MapSection
