'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { competitors, rentableShops } from '../mockData';
import L from 'leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;

const competitorIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const shopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function ExpansionMap() {
  const [showCompetitors, setShowCompetitors] = useState(true);
  const [showShops, setShowShops] = useState(true);

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gradient-text">Location Overview</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowCompetitors(!showCompetitors)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showCompetitors
                ? 'bg-gradient-to-r from-[#ff0055]/20 to-[#ff0055]/10 border border-[#ff0055]/40'
                : 'glass-card hover:border-[#ff0055]/40'
            }`}
          >
            {showCompetitors ? 'Hide Competitors' : 'Show Competitors'}
          </button>
          <button
            onClick={() => setShowShops(!showShops)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showShops
                ? 'bg-gradient-to-r from-[#00f3ff]/20 to-[#00ff9d]/20 border border-[#00f3ff]/40'
                : 'glass-card hover:border-[#00f3ff]/40'
            }`}
          >
            {showShops ? 'Hide Rentals' : 'Show Rentals'}
          </button>
        </div>
      </div>
      
      <div className="h-[400px] rounded-lg overflow-hidden">
        <MapContainer
          center={[40.7128, -74.0060]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {showCompetitors && competitors.map((competitor) => (
            <Marker
              key={competitor.id}
              position={[competitor.lat, competitor.lng]}
              icon={competitorIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{competitor.name}</h3>
                  <p>Location: {competitor.location}</p>
                  <p>Rating: {competitor.rating}/5</p>
                  <p>Daily Footfall: {competitor.avgFootfall}</p>
                  <p className="text-sm mt-1 text-red-400">Competitor</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {showShops && rentableShops.map((shop) => (
            <Marker
              key={shop.id}
              position={[shop.lat, shop.lng]}
              icon={shopIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{shop.name}</h3>
                  <p>Location: {shop.location}</p>
                  <p>Price: ${shop.price.toLocaleString()}/month</p>
                  <p>Size: {shop.size} sq ft</p>
                  <p>Available: {shop.availability}</p>
                  <p className="text-sm mt-1 text-blue-400">Rentable Space</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Competitors</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Rentable Shops</span>
        </div>
      </div>
    </div>
  );
}