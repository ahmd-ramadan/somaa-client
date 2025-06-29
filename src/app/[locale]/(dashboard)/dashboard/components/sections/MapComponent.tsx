'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface MapLocation {
    lat: number;
    lng: number;
}

interface MapComponentProps {
    center: [number, number];
    lastAnalysisLocation: MapLocation;
}

const MAP_STYLE = "https://api.maptiler.com/maps/streets-v2-dark/style.json?key=jjuqtnTn5UotbKbLcuyo";

const MapComponent = ({ center, lastAnalysisLocation }: MapComponentProps) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;
        if (mapRef.current) return;

        mapRef.current = new maplibregl.Map({
            container: mapContainer.current,
            style: MAP_STYLE,
            center: [center[1], center[0]],
            zoom: 6,
        });

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, [center]);

    console.log(lastAnalysisLocation)
    
    useEffect(() => {
        if (!mapRef.current) return;
        if (
            !lastAnalysisLocation ||
            typeof lastAnalysisLocation.lat !== 'number' ||
            typeof lastAnalysisLocation.lng !== 'number' ||
            isNaN(lastAnalysisLocation.lat) ||
            isNaN(lastAnalysisLocation.lng)
        ) {
            markerRef.current?.remove();
            markerRef.current = null;
            return;
        }
        // Remove previous marker
        markerRef.current?.remove();
        // Add new marker
        markerRef.current = new maplibregl.Marker({ color: '#ef4444' })
            .setLngLat([lastAnalysisLocation.lng, lastAnalysisLocation.lat])
            .addTo(mapRef.current);
        // Fly to marker
        mapRef.current.flyTo({
            center: [lastAnalysisLocation.lng, lastAnalysisLocation.lat],
            zoom: 12,
            essential: true,
        });
    }, [lastAnalysisLocation]);

    return (
        <div
            ref={mapContainer}
            className="w-full h-full rounded-lg overflow-hidden"
            style={{ height: "100%", width: "100%" }}
        />
    );
};

export default MapComponent; 