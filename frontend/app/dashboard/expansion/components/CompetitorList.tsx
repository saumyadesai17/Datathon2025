'use client';

import { useState } from 'react';
import { competitors } from '../mockData';

export default function CompetitorList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompetitors = competitors.filter(competitor =>
    competitor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    competitor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-2xl font-bold gradient-text mb-6">Nearby Competitors</h2>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg glass-card border border-gray-700 focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-colors bg-transparent pl-10"
          />
          <span className="absolute left-3 top-3.5">🔍</span>
        </div>
      </div>

      <div className="space-y-4">
        {filteredCompetitors.map((competitor) => (
          <div
            key={competitor.id}
            className="glass-card p-4 rounded-lg border border-gray-700 hover:border-[#00f3ff]/40 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{competitor.name}</h3>
                <p className="text-gray-400 flex items-center mt-1">
                  <span className="mr-2">📍</span>
                  {competitor.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#00f3ff]">{competitor.distance} miles away</p>
                <p className="text-gray-400 mt-1">Rating: {competitor.rating}/5</p>
              </div>
            </div>
            
            <div className="mt-3 flex justify-between items-center text-sm">
              <span className="text-gray-400">
                Avg. Daily Footfall: {competitor.avgFootfall}
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-700 text-white">
                {competitor.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}