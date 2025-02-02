'use client';

import { useState } from 'react';
import { rentableShops } from '../mockData';

const getPriceColor = (category: string) => {
  switch (category) {
    case 'affordable':
      return 'text-[#00ff9d]';
    case 'moderate':
      return 'text-yellow-400';
    case 'expensive':
      return 'text-[#ff0055]';
    default:
      return 'text-white';
  }
};

export default function RentableShops() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredShops = selectedCategory === 'all'
    ? rentableShops
    : rentableShops.filter(shop => shop.priceCategory === selectedCategory);

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gradient-text">Available Rental Spaces</h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="glass-card px-4 py-2 rounded-lg border border-gray-700 focus:border-[#00f3ff] bg-gray-800 text-white focus:bg-gray-900"
        >
          <option value="all">All Prices</option>
          <option value="affordable">Affordable</option>
          <option value="moderate">Moderate</option>
          <option value="expensive">Expensive</option>
        </select>
      </div>

      <div className="grid gap-6">
        {filteredShops.map((shop) => (
          <div
            key={shop.id}
            className="glass-card p-6 rounded-lg border border-gray-700 hover:border-[#00f3ff]/40 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{shop.name}</h3>
                <p className="text-gray-400 flex items-center mt-1">
                  <span className="mr-2">📍</span>
                  {shop.location}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${getPriceColor(shop.priceCategory)}`}>
                  ${shop.price.toLocaleString()}/month
                </p>
                <p className="text-gray-400 mt-1">{shop.size} sq ft</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Features:</p>
              <div className="flex flex-wrap gap-2">
                {shop.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm bg-gray-700"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm">
                <span className="text-gray-400">Available in: </span>
                <span className="text-[#00f3ff]">{shop.availability}</span>
              </p>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00f3ff] to-[#00ff9d] text-black font-semibold hover:opacity-90 transition-opacity">
                Check Availability
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}