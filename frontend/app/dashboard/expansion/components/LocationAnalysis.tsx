"use client";
import { useState, useEffect } from "react";

interface Competitor {
  name: string;
  location: string;
}

interface RentableShop {
  name: string;
  location: string;
  rent_price: string;
}

interface CityAnalysis {
  city: string;
  competitors: Competitor[];
  rentable_shops: RentableShop[];
  cheapest_shop?: RentableShop;
}

export default function LocationAnalysis() {
  const [topCities, setTopCities] = useState<string[]>([]);
  const [analysisData, setAnalysisData] = useState<CityAnalysis[]>([]);
  const [cheapestOverall, setCheapestOverall] = useState<RentableShop | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopLocations = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/get_missing_locations");
      if (!res.ok) throw new Error("Failed to fetch locations");
      const data = await res.json();

      const sortedLocations = Object.entries(data)
        .sort((a: any, b: any) => b[1].count - a[1].count)
        .slice(0, 3)
        .map(([city]) => city);

      setTopCities(sortedLocations);
      fetchCityAnalysis(sortedLocations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopLocations();
  }, [fetchTopLocations]);

  const fetchCityAnalysis = async (cities: string[]) => {
    const results: CityAnalysis[] = [];
    let cheapestShop: RentableShop | null = null;

    for (const city of cities) {
      try {
        const res = await fetch("http://localhost:8000/analyze-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city }),
        });

        if (!res.ok) throw new Error(`Failed to analyze ${city}`);

        const data = await res.json();
        const cityData: CityAnalysis = {
          city,
          competitors: data.Competitors || [],
          rentable_shops: data.Rentable_Shops || [],
        };

        // Find the cheapest shop for this city
        if (cityData.rentable_shops.length > 0) {
          const cityCheapest = cityData.rentable_shops.reduce((min, shop) =>
            parseInt(shop.rent_price) < parseInt(min.rent_price) ? shop : min
          );

          cityData.cheapest_shop = cityCheapest;

          // Compare with overall cheapest
          if (!cheapestShop || parseInt(cityCheapest.rent_price) < parseInt(cheapestShop.rent_price)) {
            cheapestShop = cityCheapest;
          }
        }

        results.push(cityData);
      } catch (err) {
        console.error(`Error analyzing ${city}:`, err);
      }
    }

    setAnalysisData(results);
    setCheapestOverall(cheapestShop);
  };

  const sendWhatsApp = async (city: string) => {
    try {
      const res = await fetch(`http://localhost:8000/send_whatsapp?city=${city}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to send WhatsApp message");

      alert(`WhatsApp message sent for outlet creation in ${city}!`);
    } catch (err) {
      alert("Failed to send WhatsApp message.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🏪 RetailAI - Location Analysis</h1>
      {loading && <p className="mt-4">Fetching top locations...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analysisData.map(({ city, competitors, rentable_shops, cheapest_shop }) => (
          <div key={city} className="p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-bold">📍 {city}</h2>
            <p className="text-yellow-400">Potential Location</p>

            <h3 className="mt-3 text-lg font-bold">🏢 Competitors</h3>
            {competitors.length > 0 ? (
              competitors.map((comp, index) => (
                <p key={index}>🏪 {comp.name} - {comp.location}</p>
              ))
            ) : (
              <p>No competitors found.</p>
            )}

            <h3 className="mt-3 text-lg font-bold">🏬 Available Spaces</h3>
            {rentable_shops.length > 0 ? (
              rentable_shops.map((shop, index) => (
                <p key={index}>🔑 {shop.name} - {shop.location} (₹{shop.rent_price})</p>
              ))
            ) : (
              <p>No rentable spaces found.</p>
            )}

            {cheapest_shop && (
              <div className="mt-4 p-2 bg-gray-700 rounded">
                <h4 className="font-bold">💰 Cheapest Space</h4>
                <p>{cheapest_shop.name} - {cheapest_shop.location} (₹{cheapest_shop.rent_price})</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {cheapestOverall && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-bold">🏆 Best Rentable Space</h2>
          <p><strong>{cheapestOverall.name}</strong> in <strong>{cheapestOverall.location}</strong></p>
          <p>Rent: ₹{cheapestOverall.rent_price}</p>
          <button
            onClick={() => sendWhatsApp(cheapestOverall.location)}
            className="mt-3 px-4 py-2 bg-green-500 rounded hover:bg-green-700"
          >
            Create Outlet
          </button>
        </div>
      )}
    </div>
  );
}
