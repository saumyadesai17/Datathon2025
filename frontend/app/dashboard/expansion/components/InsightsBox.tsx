'use client';

import { insights } from '../mockData';

export default function InsightsBox() {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-2xl font-bold gradient-text mb-6">Location Insights</h2>
      
      <div className="grid gap-6">
        <div className="glass-card p-4 rounded-lg border border-[#00f3ff]/20">
          <h3 className="text-lg font-semibold mb-2">Best Location Option</h3>
          <p className="text-[#00f3ff] text-2xl font-bold mb-2">{insights.bestLocation.name}</p>
          <div className="flex items-center space-x-2 mb-3">
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00f3ff] to-[#00ff9d]"
                style={{ width: `${insights.bestLocation.score}%` }}
              />
            </div>
            <span className="text-sm text-[#00ff9d]">{insights.bestLocation.score}%</span>
          </div>
          <ul className="space-y-1 text-sm text-gray-400">
            {insights.bestLocation.reasons.map((reason, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span>✓</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="glass-card p-4 rounded-lg border border-[#00f3ff]/20">
            <h3 className="text-lg font-semibold mb-2">Competitor Density</h3>
            <p className="text-xl font-bold mb-1">{insights.competitorDensity.count} competitors</p>
            <p className="text-sm text-gray-400">within {insights.competitorDensity.radius}</p>
            <p className="mt-2 text-[#00f3ff]">{insights.competitorDensity.level} density</p>
          </div>

          <div className="glass-card p-4 rounded-lg border border-[#00f3ff]/20">
            <h3 className="text-lg font-semibold mb-2">Market Potential</h3>
            <div className="flex items-center space-x-2 mb-3">
              <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00f3ff] to-[#00ff9d]"
                  style={{ width: `${insights.marketPotential.score}%` }}
                />
              </div>
              <span className="text-sm text-[#00ff9d]">{insights.marketPotential.score}%</span>
            </div>
            <ul className="text-sm text-gray-400">
              {insights.marketPotential.factors.map((factor, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span>•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00f3ff] to-[#00ff9d] text-black font-bold hover:opacity-90 transition-opacity">
          Get Detailed Location Analysis
        </button>
      </div>
    </div>
  );
}