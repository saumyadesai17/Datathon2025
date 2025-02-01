'use client';

import { waitingTimes } from '../mockData';

export default function WaitingTimes() {
  const maxTime = Math.max(...waitingTimes.map(wt => wt.peak));

  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-2xl font-bold gradient-text mb-6">Average Waiting Times</h2>
      
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
    </div>
  );
}