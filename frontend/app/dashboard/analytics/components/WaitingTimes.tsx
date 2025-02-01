'use client';

import { useState, useEffect } from 'react';

interface WaitingTime {
  outlet: string;
  averageTime: number;
  peak: number;
  offPeak: number;
}

export default function WaitingTimes() {
  const [waitingTimes, setWaitingTimes] = useState<WaitingTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaitingTimes = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/get_waiting');
        const data: Record<string, unknown> = await response.json();

        // Transform API response into array format
        const formattedData: WaitingTime[] = Object.entries(data).map(([outlet, time]) => {
          const avgTime = typeof time === 'number' ? parseFloat(time.toFixed(2)) : 0;
          return {
            outlet,
            averageTime: avgTime,
            peak: parseFloat((avgTime * 1.2).toFixed(2)), // Peak ~20% higher
            offPeak: parseFloat((avgTime * 0.8).toFixed(2)), // Off-peak ~20% lower
          };
        });

        setWaitingTimes(formattedData);
      } catch (error) {
        console.error('Error fetching waiting times:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWaitingTimes();
  }, []);

  const maxTime = waitingTimes.length ? Math.max(...waitingTimes.map(wt => wt.peak)) : 1;

  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-2xl font-bold gradient-text mb-6">Average Waiting Times</h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading waiting times...</p>
      ) : (
        <div className="space-y-6">
          {waitingTimes.map((wt) => (
            <div key={wt.outlet} className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-medium">{wt.outlet}</p>
                <p className="text-gray-400">{wt.averageTime} mins avg.</p>
              </div>

              <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-[#00f3ff] to-[#00ff9d] rounded-full transition-all duration-500"
                  style={{ width: `${(wt.averageTime / maxTime) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-sm text-gray-400">
                <p>Peak: {wt.peak} mins</p>
                <p>Off-peak: {wt.offPeak} mins</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
