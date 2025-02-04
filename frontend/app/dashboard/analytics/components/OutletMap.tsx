"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import dynamic from "next/dynamic"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"

// Dynamically import react-leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

// Define types
interface OutletLocation {
    name: string
    latitude: number
    longitude: number
}

interface PredictedLocation {
    name: string
    count: number
    latitude: number
    longitude: number
    demandCategory: "High" | "Medium" | "Low"
}

// Create icons outside of the component
const activeIcon = new Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

const predictedIcons = {
    High: new Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    }),
    Medium: new Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    }),
    Low: new Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    }),
}

export default function OutletMap() {
    const [outletLocations, setOutletLocations] = useState<OutletLocation[]>([])
    const [predictedLocations, setPredictedLocations] = useState<PredictedLocation[]>([])
    const [showPredicted, setShowPredicted] = useState(false)

    const fetchLocations = useCallback(async () => {
        try {
            const [outletResponse, predictedResponse] = await Promise.all([
                fetch("http://localhost:8000/get_location/"),
                fetch("http://localhost:8000/get_missing_locations/"),
            ])

            const outletData: { locations: OutletLocation[] } = await outletResponse.json()
            const predictedData: Record<string, { count: number; latitude: number; longitude: number }> =
                await predictedResponse.json()

            setOutletLocations(outletData.locations)

            const sortedPredicted = Object.entries(predictedData)
                .map(([name, data]) => ({
                    name,
                    count: data.count,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    demandCategory:
                        data.count > 700
                            ? "High"
                            : data.count > 400
                                ? "Medium"
                                : "Low",
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 6)

            setPredictedLocations(sortedPredicted as PredictedLocation[]) // Type assertion to ensure the type is correct

        } catch (error) {
            console.error("Error fetching locations:", error)
        }
    }, [])

    useEffect(() => {
        fetchLocations()
    }, [fetchLocations])

    const togglePredicted = useCallback(() => setShowPredicted((prev) => !prev), [])

    const memoizedOutletMarkers = useMemo(
        () =>
            outletLocations.map((outlet: OutletLocation) => (
                <Marker key={outlet.name} position={[outlet.latitude, outlet.longitude]} icon={activeIcon}>
                    <Popup>
                        <div className="p-2">
                            <h3 className="font-bold">{outlet.name}</h3>
                            <p className="text-green-400">Existing Outlet</p>
                        </div>
                    </Popup>
                </Marker>
            )),
        [outletLocations],
    )

    const memoizedPredictedMarkers = useMemo(
        () =>
            showPredicted &&
            predictedLocations.map((location: PredictedLocation) => (
                <Marker
                    key={location.name}
                    position={[location.latitude, location.longitude]}
                    icon={predictedIcons[location.demandCategory]}
                >
                    <Popup>
                        <div className="p-2">
                            <h3 className="font-bold">{location.name}</h3>
                            <p>Potential Demand: {location.count}</p>
                            <p
                                className={`text-${location.demandCategory === "High" ? "red" : location.demandCategory === "Medium" ? "orange" : "blue"}-400`}
                            >
                                {location.demandCategory} Demand
                            </p>
                        </div>
                    </Popup>
                </Marker>
            )),
        [showPredicted, predictedLocations],
    )

    return (
        <div className="glass-card p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold gradient-text">Outlet Locations</h2>
                <button
                    onClick={togglePredicted}
                    className={`px-4 py-2 rounded-lg transition-colors ${showPredicted
                            ? "bg-gradient-to-r from-[#00f3ff]/20 to-[#00ff9d]/20 border border-[#00f3ff]/40"
                            : "glass-card hover:border-[#00f3ff]/40"
                        }`}
                >
                    {showPredicted ? "Hide Predictions" : "Show Predictions"}
                </button>
            </div>

            <div className="h-[400px] rounded-lg overflow-hidden">
                <MapContainer center={[19.076, 72.8777]} zoom={12} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {memoizedOutletMarkers}
                    {memoizedPredictedMarkers}
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
    )
}