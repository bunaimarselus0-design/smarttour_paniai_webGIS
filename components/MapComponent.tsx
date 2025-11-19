import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Destination } from '../types';
import L from 'leaflet';

// Helper component to update map view when props change
const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

// Custom Icon using raw SVG string instead of ReactDOMServer for better browser compatibility
const createCustomIcon = (category: string) => {
  const color = category === 'Alam' ? '#16a34a' : '#ea580c'; // Green for Nature, Orange for Culture
  
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3" fill="white"/>
    </svg>
  `;

  const iconUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

  return L.icon({
    iconUrl: iconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
  });
};

interface MapComponentProps {
  destinations: Destination[];
  center?: [number, number];
  zoom?: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  destinations, 
  center = [-3.9055, 136.3566], // Default Paniai
  zoom = 11 
}) => {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full rounded-lg z-0">
      <MapUpdater center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {destinations.map((dest) => (
        <Marker 
          key={dest.id} 
          position={[dest.latitude, dest.longitude]}
          icon={createCustomIcon(dest.category)}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold text-lg">{dest.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full text-white ${dest.category === 'Alam' ? 'bg-green-600' : 'bg-orange-600'}`}>
                {dest.category}
              </span>
              <img src={dest.image} alt={dest.name} className="w-full h-24 object-cover rounded mt-2 mb-2" />
              <p className="text-sm text-gray-600 line-clamp-2">{dest.description}</p>
              <div className="mt-2 text-xs font-semibold text-gray-500">
                Fitur: {dest.features.join(', ')}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;