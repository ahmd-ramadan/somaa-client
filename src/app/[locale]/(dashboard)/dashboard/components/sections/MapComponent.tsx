'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSocket } from '@/hooks/useSocket';
import { IAnalysis } from '@/interfaces/analysis.types';

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
    iconUrl: '/images/marker-icon.png',
    iconRetinaUrl: '/images/marker-icon-2x.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
    lat: number;
    lng: number;
}

interface MapComponentProps {
    center: [number, number];
    lastAnalysisLocation: Location | null;
}

const MapComponent = ({ center, lastAnalysisLocation }: MapComponentProps) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<L.Map | null>(null);
    const markers = useRef<L.Marker[]>([]);
    const polyline = useRef<L.Polyline | null>(null);
    const { socket } = useSocket();
    const [locations, setLocations] = useState<IAnalysis[]>([]);

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current) return;

        // Create map instance
        map.current = L.map(mapContainer.current, {
            center: center,
            zoom: 8,
            zoomControl: false,
            attributionControl: false
        });

        // Add dark theme tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map.current);

        // Add zoom control
        L.control.zoom({
            position: 'topright'
        }).addTo(map.current);

        // Add scale control
        L.control.scale({
            imperial: false,
            position: 'bottomright'
        }).addTo(map.current);

        return () => {
            if (map.current) {
                map.current.remove();
            }
        };
    }, []);

    // Handle socket updates for live locations
    useEffect(() => {
        if (!socket) return;

        const handleNewAnalysis = (analysis: IAnalysis) => {
            if (analysis.location && map.current) {
                setLocations(prev => [...prev, analysis]);
                
                // Create custom marker
                const markerEl = document.createElement('div');
                markerEl.className = 'location-marker';
                markerEl.style.width = '20px';
                markerEl.style.height = '20px';
                markerEl.style.borderRadius = '50%';
                markerEl.style.backgroundColor = '#4299e1';
                markerEl.style.border = '2px solid white';
                markerEl.style.boxShadow = '0 0 10px rgba(66, 153, 225, 0.5)';

                const customIcon = L.divIcon({
                    className: 'custom-marker',
                    html: markerEl,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });

                // Add marker
                const marker = L.marker([analysis.location.lat as number, analysis.location.lng as number], { icon: customIcon })
                    .addTo(map.current)
                    .bindPopup(`
                        <div class="p-2">
                            <h3 class="text-sm font-bold">${analysis.publisher?.name || 'Unknown'}</h3>
                            <p class="text-xs">${analysis.content?.body || analysis.subAnalysis?.body || 'No content'}</p>
                        </div>
                    `);

                markers.current.push(marker);

                // Update polyline
                updatePolyline();

                // Fly to new location
                map.current.flyTo([analysis.location.lat as number, analysis.location.lng as number], 12, {
                    duration: 2
                });
            }
        };

        socket.on('addAnalysis', handleNewAnalysis);

        return () => {
            socket.off('addAnalysis', handleNewAnalysis);
        };
    }, [socket]);

    // Update polyline with all locations
    const updatePolyline = () => {
        if (!map.current) return;

        const points = locations
            .filter(loc => loc.location)
            .map(loc => [loc.location!.lat, loc.location!.lng] as [number, number]);

        if (points.length > 1) {
            if (polyline.current) {
                polyline.current.setLatLngs(points);
            } else {
                polyline.current = L.polyline(points, {
                    color: '#4299e1',
                    weight: 4,
                    opacity: 0.8,
                    lineJoin: 'round'
                }).addTo(map.current);
            }
        }
    };

    // Update map when lastAnalysisLocation changes
    useEffect(() => {
        if (lastAnalysisLocation && map.current) {
            const { lat, lng } = lastAnalysisLocation;

            // Create or update current location marker
            const currentMarkerEl = document.createElement('div');
            currentMarkerEl.className = 'current-location-marker';
            currentMarkerEl.style.width = '24px';
            currentMarkerEl.style.height = '24px';
            currentMarkerEl.style.borderRadius = '50%';
            currentMarkerEl.style.backgroundColor = '#ef4444';
            currentMarkerEl.style.border = '3px solid white';
            currentMarkerEl.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.7)';

            const currentIcon = L.divIcon({
                className: 'current-marker',
                html: currentMarkerEl,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            // Remove existing current location marker
            markers.current.forEach(marker => marker.remove());
            markers.current = [];

            // Add new current location marker
            const marker = L.marker([lat, lng], { icon: currentIcon })
                .addTo(map.current)
                .bindPopup('Current Location');

            markers.current.push(marker);

            // Update polyline
            updatePolyline();

            // Fly to location
            map.current.flyTo([lat, lng], 12, {
                duration: 2
            });
        }
    }, [lastAnalysisLocation, locations]);

    return (
        <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />
    );
};

export default MapComponent; 