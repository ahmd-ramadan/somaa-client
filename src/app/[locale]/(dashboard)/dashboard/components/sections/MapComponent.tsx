'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { AnalysisClassifyEnum, IAnalysis } from '@/interfaces/analysis.types';
import Link from 'next/link';
import { BarChart, EyeIcon, Heart, Link2, LinkIcon, MessageCircle, Share2, Users, X } from 'lucide-react';
import { formatDistanceToNow } from './utils';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export interface MapLocation {
    lat: number;
    lng: number;
}

interface MapComponentProps {
    center: [number, number];
    analyses: IAnalysis[];
}

const MAP_STYLE = "https://api.maptiler.com/maps/streets-v2-dark/style.json?key=jjuqtnTn5UotbKbLcuyo";

const SAUDI_BOUNDS: [[number, number], [number, number]] = [
  [34.4957, 16.3795], // جنوب غرب السعودية
  [55.6667, 32.1543], // شمال شرق السعودية
];

const MapComponent = ({ center, analyses }: MapComponentProps) => {
    const t = useTranslations("DashboardPage")
    const locale = useLocale()

    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const [selectedAnalysis, setSelectedAnalysis] = useState<IAnalysis | null>(null);
    const markerRefs = useRef<maplibregl.Marker[]>([]);

    useEffect(() => {
        if (!mapContainer.current) return;
        if (mapRef.current) return;
        mapRef.current = new maplibregl.Map({
            container: mapContainer.current,
            style: MAP_STYLE,
        });
        mapRef.current.fitBounds(SAUDI_BOUNDS, { padding: 20, duration: 0 });
        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);
    
    useEffect(() => {
        if (!mapRef.current) return;
        // Remove old markers
        markerRefs.current.forEach(marker => marker.remove());
        markerRefs.current = [];
        analyses.forEach((analysis, idx) => {
            if (!analysis.location || typeof analysis.location.lat !== 'number' || typeof analysis.location.lng !== 'number') return;
            // Create a custom marker with publisher avatar
            const el = document.createElement('div');
            el.style.width = '40px';
            el.style.height = '40px';
            el.style.borderRadius = '50%';
            el.style.overflow = 'hidden';
            el.style.border = '2px solid #fff';
            el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
            el.style.background = '#222';
            const img = document.createElement('img');
            img.src = analysis.publisher.avatar;
            img.alt = analysis.publisher.name;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            el.appendChild(img);
            el.style.cursor = 'pointer';
            el.onclick = () => setSelectedAnalysis(analysis);
            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([analysis.location.lng, analysis.location.lat])
                .addTo(mapRef.current!);
            markerRefs.current.push(marker);
        });
    }, [analyses]);

    return (
        <div className="relative w-full h-full flex-1 rounded-lg overflow-hidden">
            <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
            {selectedAnalysis && (
                <motion.div          
                    className="absolute top-4 left-4 bg-white/90 rounded-lg shadow-lg p-4 z-10 min-w-[250px] max-w-[90vw]"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1 * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                            {/* UserInfo */}
                            <div className="flex gap-1">
                                <Link
                                    href={selectedAnalysis.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    { selectedAnalysis.publisher.avatar ? 
                                        <img 
                                            src={selectedAnalysis.publisher.avatar}
                                            alt={selectedAnalysis.publisher?.name?.charAt(0)}
                                            className="rounded-full w-10 h-10 bg-gray-600 flex items-center justify-center text-gray-800"
                                        /> :
                                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-gray-800">
                                            { selectedAnalysis.publisher?.name?.charAt(0) || '?' }
                                        </div>
                                    }
                                </Link>
                                <div className="flex flex-col justify-start items-start gap-1 mb-1">
                                    <span className="text-xs font-medium text-gray-800">
                                        {selectedAnalysis.publisher?.name || 'Unknown Publisher'}
                                    </span>
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3 text-blue-500" />
                                            <span className="text-xs font-medium text-gray-800">{selectedAnalysis.publisher.followers.toLocaleString()}</span>
                                        </div>
                                        <span className="text-xs text-gray-800">
                                            { formatDistanceToNow({ locale, date: selectedAnalysis.createdAt })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Classification Badge */}
                            <div className={`h-fit w-fit p-1 rounded-md text-xs ${
                                selectedAnalysis.classify === AnalysisClassifyEnum.POSITIVE 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : selectedAnalysis.classify === AnalysisClassifyEnum.NEUTRAL 
                                    ? 'bg-gray-500/20 text-gray-600'
                                    : 'bg-red-500/20 text-red-400'
                            }`}>
                                {t(selectedAnalysis.classify)}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="">
                            <p className="text-xs text-gray-800 my-2 px-2 line-clamp-2">
                                {selectedAnalysis.content?.body || selectedAnalysis.subAnalysisData?.body || 'No content available'}
                            </p>

                            {/* Statistics */}
                            <div className="flex items-center justify-around text-xs text-gray-800">
                                <div className="flex items-center gap-1">
                                    <EyeIcon className="w-3 h-3 text-blue-500"/>
                                    {selectedAnalysis.statistics?.views.toLocaleString() || 0}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Share2 className="w-3 h-3 text-blue-500"/>
                                    {selectedAnalysis.statistics?.shares.toLocaleString() || 0}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Heart className="w-3 h-3 text-blue-500"/>
                                    {selectedAnalysis.statistics?.reactions.toLocaleString() || 0}
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3 text-blue-500"/>
                                    {selectedAnalysis.statistics?.comments.toLocaleString() || 0}
                                </div>
                                <div className="flex items-center gap-1">
                                    <BarChart className="w-3 h-3 text-blue-500"/>
                                    {selectedAnalysis.statistics?.appearance.toLocaleString() || 0}
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 flex justify-start gap-1 items-center text-xs">
                            <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1" onClick={() => setSelectedAnalysis(null)}>
                                <X className='w-4 h-4' />
                                {t("cancelBtn")}
                            </button>
                            <Link
                                href={selectedAnalysis.url}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                                target="_blank"
                            >
                                <LinkIcon className='w-4 h-4'/>
                                {t("showBtn")}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default MapComponent; 