/* eslint-disable react/display-name */
'use client';

import { useState, useEffect, useCallback, memo } from "react";
import { Building2, MapPin, Store, Key, Trophy, Send } from "lucide-react";

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

// Memoized card components for better performance
const CityCard = memo(({ data, onWhatsApp }: { 
  data: CityAnalysis; 
  onWhatsApp: (city: string) => void;
}) => (
  <div className="glass-card p-6 rounded-xl border border-gray-600">
    <div className="flex items-center gap-2 mb-4">
      <MapPin className="w-5 h-5 text-[#007acc]" />
      <h2 className="text-xl font-semibold text-white">
        {data.city}
      </h2>
    </div>

    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-4 h-4 text-[#00b894]" />
          <h3 className="text-lg font-medium text-gray-300">Competitors</h3>
        </div>
        <div className="space-y-2">
          {data.competitors.length > 0 ? (
            data.competitors.map((comp, index) => (
              <div key={index} className="text-gray-300">
                {comp.name} - {comp.location}
              </div>
            ))
          ) : (
            <div className="text-gray-400">No competitors found</div>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Store className="w-4 h-4 text-[#e67e22]" />
          <h3 className="text-lg font-medium text-gray-300">Available Spaces</h3>
        </div>
        <div className="space-y-2">
          {data.rentable_shops.length > 0 ? (
            data.rentable_shops.map((shop, index) => (
              <div key={index} className="text-gray-300">
                {shop.name} - <span className="text-[#007acc]">₹{new Intl.NumberFormat('en-IN').format(parseInt(shop.rent_price))}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-400">No spaces available</div>
          )}
        </div>
      </div>

      {data.cheapest_shop && (
        <div className="mt-4 p-4 glass-card rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-4 h-4 text-[#00b894]" />
            <h4 className="text-lg font-medium text-gray-300">Best Option</h4>
          </div>
          <p className="text-gray-300">
            {data.cheapest_shop.name} - <span className="text-[#007acc] font-bold">₹{new Intl.NumberFormat('en-IN').format(parseInt(data.cheapest_shop.rent_price))}</span>
          </p>
        </div>
      )}
    </div>
  </div>
));

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="glass-card p-6 rounded-xl">
        <div className="h-8 w-24 bg-gray-700 rounded animate-pulse mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((j) => (
            <div key={j} className="h-4 bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default function LocationAnalysis() {
  const [topCities, setTopCities] = useState<string[]>([]);
  const [analysisData, setAnalysisData] = useState<CityAnalysis[]>([]);
  const [cheapestOverall, setCheapestOverall] = useState<RentableShop | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopLocations = useCallback(async () => {
    try {
      const res = await fetch("https://datathon2025.onrender.com/get_missing_locations");
      if (!res.ok) throw new Error("Failed to fetch locations");
      const data = await res.json();

      const sortedLocations = Object.entries(data)
        .sort((a: any, b: any) => b[1].count - a[1].count)
        .slice(0, 3)
        .map(([city]) => city);

      setTopCities(sortedLocations);
      return sortedLocations;
    } catch (err) {
      throw err;
    }
  }, []);

  const fetchCityAnalysis = useCallback(async (cities: string[]) => {
    const results: CityAnalysis[] = [];
    let cheapestShop: RentableShop | null = null;

    await Promise.all(
      cities.map(async (city) => {
        try {
          const res = await fetch("https://datathon2025.onrender.com/analyze-location", {
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

          if (cityData.rentable_shops.length > 0) {
            const cityCheapest = cityData.rentable_shops.reduce((min, shop) =>
              parseInt(shop.rent_price) < parseInt(min.rent_price) ? shop : min
            );

            cityData.cheapest_shop = cityCheapest;

            if (!cheapestShop || parseInt(cityCheapest.rent_price) < parseInt(cheapestShop.rent_price)) {
              cheapestShop = cityCheapest;
            }
          }

          results.push(cityData);
        } catch (err) {
          console.error(`Error analyzing ${city}:`, err);
        }
      })
    );

    return { results, cheapestShop };
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const cities = await fetchTopLocations();
        const { results, cheapestShop } = await fetchCityAnalysis(cities);
        
        setAnalysisData(results);
        setCheapestOverall(cheapestShop);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [fetchTopLocations, fetchCityAnalysis]);

  const sendWhatsApp = async (city: string) => {
    try {
      const res = await fetch(`https://datathon2025.onrender.com/send_whatsapp?city=${city}`, {
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
    <div className="space-y-8">
      <h1 className="text-4xl font-bold gradient-text">Location Analysis</h1>

      {error && (
        <div className="glass-card p-4 rounded-xl text-red-400 border border-red-400/20">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-2">Total Locations</h3>
              <p className="text-3xl font-bold text-[#007acc]">{analysisData.length}</p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-2">Total Competitors</h3>
              <p className="text-3xl font-bold text-[#00b894]">
                {analysisData.reduce((sum, city) => sum + city.competitors.length, 0)}
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-2">Available Spaces</h3>
              <p className="text-3xl font-bold text-[#e67e22]">
                {analysisData.reduce((sum, city) => sum + city.rentable_shops.length, 0)}
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysisData.map((cityData) => (
                <CityCard 
                  key={cityData.city} 
                  data={cityData}
                  onWhatsApp={sendWhatsApp}
                />
              ))}
            </div>
          </div>

          {cheapestOverall && (
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-6 h-6 text-[#00b894]" />
                <h2 className="text-2xl font-bold">Recommended Location</h2>
              </div>
              <div className="mb-6">
                <p className="text-lg text-gray-300">
                  <span className="font-medium">{cheapestOverall.name}</span> in{" "}
                  <span className="font-medium">{cheapestOverall.location}</span>
                </p>
                <p className="text-3xl font-bold text-[#007acc] mt-2">
                  ₹{new Intl.NumberFormat('en-IN').format(parseInt(cheapestOverall.rent_price))}
                </p>
              </div>
              <button
                onClick={() => sendWhatsApp(cheapestOverall.location)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#007acc] hover:bg-[#006bb3] rounded-lg text-white font-medium transition-colors duration-200"
              >
                <Send className="w-4 h-4" />
                Create Outlet
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}