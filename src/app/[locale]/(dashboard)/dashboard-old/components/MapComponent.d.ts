import { FC } from 'react';

interface MapComponentProps {
    center: [number, number];
    lastAnalysisLocation: {
        lat: number;
        lng: number;
    } | null;
}

declare const MapComponent: FC<MapComponentProps>;
export default MapComponent; 