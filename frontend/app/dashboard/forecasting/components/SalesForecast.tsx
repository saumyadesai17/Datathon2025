'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';

// Define the type for the sales data
interface SalesData {
  date: string;
  sales: number;
  confidence: number;
}

export default function SalesForecast() {
  const [salesData, setSalesData] = useState<SalesData[]>([]); // Define the state type as SalesData[]
  const [loading, setLoading] = useState(true);
  const [selectedOutlet, setSelectedOutlet] = useState('andheri');
  const [averageConfidence, setAverageConfidence] = useState<number | null>(null);
  const [predictedGrowth, setPredictedGrowth] = useState<number>(12.5);
  const [accuracyRate, setAccuracyRate] = useState<number>(89);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Make the API request to the backend
        const response = await fetch('http://localhost:8000/forecast');
        const data = await response.json();

        // Process the data for the selected outlet
        const outletData = data.forecast[selectedOutlet];
        const formattedData = Object.entries(outletData).map(([date, sales]) => ({
          date,
          sales: Number(sales).toFixed(2), // Round to 2 decimals, keeping it as a string
          confidence: Math.floor(Math.random() * 20) + 80 // Mock confidence between 80% - 100%
        }));

        // Set the sales data and calculate the average confidence
        setSalesData(formattedData);
        const avgConfidence = Math.round(
          formattedData.reduce((acc, curr) => acc + curr.confidence, 0) / formattedData.length
        );
        setAverageConfidence(avgConfidence);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedOutlet]);

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gradient-text">30-Day Sales Forecast</h2>
        <select
          value={selectedOutlet}
          onChange={(e) => setSelectedOutlet(e.target.value)}
          className="glass-card px-4 py-2 rounded-lg border border-gray-700 focus:border-[#00f3ff] bg-transparent"
        >
          <option value="andheri">Andheri</option>
          <option value="dadar">Dadar</option>
          <option value="borivali">Borivali</option>
          <option value="bhayander">Bhayander</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading forecast...</p>
      ) : (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#ffffff" tick={{ fill: '#ffffff' }} />
              <YAxis stroke="#ffffff" tick={{ fill: '#ffffff' }} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Legend />
              <Area type="monotone" dataKey="sales" fill="url(#colorGradient)" stroke="#00f3ff" fillOpacity={0.3} />
              <Line type="monotone" dataKey="confidence" stroke="#00ff9d" strokeWidth={2} dot={false} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 p-4 glass-card rounded-lg border border-[#00f3ff]/20">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Average Confidence</p>
            <p className="text-2xl font-bold text-[#00ff9d]">
              {averageConfidence !== null ? `${averageConfidence}%` : "--%"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Predicted Growth</p>
            <p className="text-2xl font-bold text-[#00f3ff]">+{predictedGrowth}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Accuracy Rate</p>
            <p className="text-2xl font-bold text-white">{accuracyRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
