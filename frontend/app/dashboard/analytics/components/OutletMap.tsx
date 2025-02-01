'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { outletLocations, predictedLocations } from '../mockData';
import L from 'leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;

const activeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const lowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const predictedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function OutletMap() {
  const [showPredicted, setShowPredicted] = useState(false);

  const getIcon = (status: string) => {
    switch (status) {
      case 'active':
        return activeIcon;
      case 'low':
        return lowIcon;
      default:
        return predictedIcon;
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gradient-text">Outlet Locations</h2>
        <button
          onClick={() => setShowPredicted(!showPredicted)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            showPredicted
              ? 'bg-gradient-to-r from-[#00f3ff]/20 to-[#00ff9d]/20 border border-[#00f3ff]/40'
              : 'glass-card hover:border-[#00f3ff]/40'
          }`}
        >
          {showPredicted ? 'Hide Predictions' : 'Show Predictions'}
        </button>
      </div>
      
      <div className="h-[400px] rounded-lg overflow-hidden">
        <MapContainer
          center={[40.7128, -74.0060]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {outletLocations.map((outlet) => (
            <Marker
              key={outlet.id}
              position={[outlet.lat, outlet.lng]}
              icon={getIcon(outlet.status)}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{outlet.name}</h3>
                  <p>Performance: {outlet.performance}%</p>
                  <p>Sales: ${outlet.sales.toLocaleString()}</p>
                  <p className="text-sm mt-1">
                    Status: <span className={outlet.status === 'active' ? 'text-green-400' : 'text-orange-400'}>
                      {outlet.status === 'active' ? 'Active' : 'Low Performance'}
                    </span>
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          {showPredicted && predictedLocations.map((location) => (
            <>
              <Marker
                key={location.id}
                position={[location.lat, location.lng]}
                icon={predictedIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold">{location.name}</h3>
                    <p>Confidence: {location.confidence}%</p>
                    <p>Predicted Sales: ${location.predictedSales.toLocaleString()}</p>
                    <p className="text-sm mt-1 text-blue-400">Predicted Location</p>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[location.lat, location.lng]}
                radius={500}
                pathOptions={{
                  color: '#00f3ff',
                  fillColor: '#00f3ff',
                  fillOpacity: 0.1
                }}
              />
            </>
          ))}
        </MapContainer>
      </div>

      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Active</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span>Low Performance</span>
        </div>
        {showPredicted && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Predicted</span>
          </div>
        )}
      </div>
    </div>
  );
}