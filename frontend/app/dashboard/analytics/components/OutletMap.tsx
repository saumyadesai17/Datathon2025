'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

// Custom icon based on demand category
const getPredictedIcon = (demandCategory: 'High' | 'Medium' | 'Low') => {
    return new L.Icon({
        iconUrl: demandCategory === 'High'
            ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
            : demandCategory === 'Medium'
                ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png'
                : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};

interface OutletLocation {
    name: string;
    latitude: number;
    longitude: number;
}

interface PredictedLocation {
    name: string;
    count: number;
    latitude: number;
    longitude: number;
    demandCategory: 'High' | 'Medium' | 'Low';
}

export default function OutletMap() {
    const [outletLocations, setOutletLocations] = useState<OutletLocation[]>([]);
    const [predictedLocations, setPredictedLocations] = useState<PredictedLocation[]>([]);
    const [showPredicted, setShowPredicted] = useState(false);

    useEffect(() => {
        async function fetchLocations() {
            try {
                const outletResponse = await fetch('http://localhost:8000/get_location/');
                const predictedResponse = await fetch('http://localhost:8000/get_missing_locations/');

                const outletData: { locations: OutletLocation[] } = await outletResponse.json();
                const predictedData: Record<string, { count: number; latitude: number; longitude: number }> = await predictedResponse.json();

                setOutletLocations(outletData.locations);

                const sortedPredicted = Object.entries(predictedData)
                    .map(([name, data]) => ({
                        name,
                        count: data.count,
                        latitude: data.latitude,
                        longitude: data.longitude,
                    }))
                    .sort((a, b) => b.count - a.count) // Sort by count in descending order
                    .slice(0, 6); // Get top 6

                // Assign demand categories
                const categorizedPredicted = sortedPredicted.map(location => {
                    let demandCategory: 'High' | 'Medium' | 'Low' = 'Low';
                    if (location.count > 700) {
                        demandCategory = 'High';
                    } else if (location.count > 400) {
                        demandCategory = 'Medium';
                    }
                    return { ...location, demandCategory };
                });

                setPredictedLocations(categorizedPredicted);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        }

        fetchLocations();
    }, []);

    return (
        <div className="glass-card p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold gradient-text">Outlet Locations</h2>
                <button
                    onClick={() => setShowPredicted(!showPredicted)}
                    className={`px-4 py-2 rounded-lg transition-colors ${showPredicted
                            ? 'bg-gradient-to-r from-[#00f3ff]/20 to-[#00ff9d]/20 border border-[#00f3ff]/40'
                            : 'glass-card hover:border-[#00f3ff]/40'
                        }`}
                >
                    {showPredicted ? 'Hide Predictions' : 'Show Predictions'}
                </button>
            </div>

            <div className="h-[400px] rounded-lg overflow-hidden">
                <MapContainer
                    center={[19.076, 72.8777]} // Centered on Mumbai
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {outletLocations.map((outlet: OutletLocation) => (
                        <Marker key={outlet.name} position={[outlet.latitude, outlet.longitude]} icon={activeIcon}>
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-bold">{outlet.name}</h3>
                                    <p className="text-green-400">Existing Outlet</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {showPredicted &&
                        predictedLocations.map((location: PredictedLocation) => (
                            <Marker
                                key={location.name}
                                position={[location.latitude, location.longitude]}
                                icon={getPredictedIcon(location.demandCategory)} // Use dynamic icon for demand category
                            >
                                <Popup>
                                    <div className="p-2">
                                        <h3 className="font-bold">{location.name}</h3>
                                        <p>Potential Demand: {location.count}</p>
                                        <p className={`text-${location.demandCategory === 'High' ? 'red' : location.demandCategory === 'Medium' ? 'orange' : 'blue'}-400`}>
                                            {location.demandCategory} Demand
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                </MapContainer>
            </div>

            <div className="mt-4 flex justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Active Outlets</span>
                </div>
                {showPredicted && (
                    <>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span>High Demand</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500" />
                            <span>Medium Demand</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span>Low Demand</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
